'use client';

import { getSupabaseClient, isSupabaseConfigured, DOCUMENTS_BUCKET } from '@/lib/supabase/client';
import {
  UploadFile,
  UploadSession,
  UploadOptions,
  UploadProgress,
  SignedUrlResponse,
  UploadConfirmRequest,
  UploadConfirmResponse,
} from './types';
import { generateFileId, generateStoragePath, validateFile, UPLOAD_CONFIG } from './config';
import type { DomainType } from '@/types';

/**
 * Check if we should use mock mode
 */
function shouldUseMockMode(): boolean {
  // Use mock if Supabase is not configured or if explicitly set
  return !isSupabaseConfigured() || process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
}

/**
 * Main upload function - handles both real and mock uploads
 */
export async function uploadFiles(options: UploadOptions): Promise<UploadSession> {
  const {
    projectId,
    files,
    mode,
    category,
    categoryCode,
    onProgress,
    onFileComplete,
    onError,
  } = options;

  // Prepare upload files
  const uploadFiles: UploadFile[] = files.map((file, index) => {
    const validation = validateFile(file);
    return {
      id: generateFileId(),
      file,
      name: file.name,
      size: file.size,
      status: validation.valid ? 'pending' : 'failed',
      progress: 0,
      retryCount: 0,
      error: validation.error,
    };
  });

  // Create session
  const session: UploadSession = {
    id: `session-${Date.now()}`,
    projectId,
    files: uploadFiles,
    mode,
    manualCategory: category,
    manualCategoryCode: categoryCode,
    totalFiles: uploadFiles.length,
    completedFiles: 0,
    failedFiles: uploadFiles.filter(f => f.status === 'failed').length,
    totalBytes: uploadFiles.reduce((sum, f) => sum + f.size, 0),
    uploadedBytes: 0,
    startedAt: new Date(),
  };

  // Use mock or real upload based on configuration
  if (shouldUseMockMode()) {
    return await uploadFilesMock(session, options);
  }

  return await uploadFilesReal(session, options);
}

/**
 * Real upload using Supabase Storage
 */
async function uploadFilesReal(
  session: UploadSession,
  options: UploadOptions
): Promise<UploadSession> {
  const { projectId, mode, category, categoryCode, onProgress, onFileComplete, onError } = options;
  const supabase = getSupabaseClient();

  const successfulPaths: Array<{
    path: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }> = [];

  // Upload each file
  for (let i = 0; i < session.files.length; i++) {
    const uploadFile = session.files[i];

    // Skip already failed files
    if (uploadFile.status === 'failed') {
      continue;
    }

    uploadFile.status = 'uploading';
    reportProgress(session, uploadFile, onProgress);

    try {
      // Generate storage path
      const path = generateStoragePath(projectId, uploadFile.name);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .upload(path, uploadFile.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      // Update file status
      uploadFile.storagePath = data.path;
      uploadFile.progress = 100;
      session.uploadedBytes += uploadFile.size;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(DOCUMENTS_BUCKET)
        .getPublicUrl(data.path);
      uploadFile.publicUrl = urlData.publicUrl;

      successfulPaths.push({
        path: data.path,
        fileName: uploadFile.name,
        fileSize: uploadFile.size,
        mimeType: uploadFile.file.type,
      });

      reportProgress(session, uploadFile, onProgress);

    } catch (err) {
      uploadFile.status = 'failed';
      uploadFile.error = err instanceof Error ? err.message : 'Upload failed';
      session.failedFiles++;

      if (onError) {
        onError(uploadFile, err instanceof Error ? err : new Error('Upload failed'));
      }
    }
  }

  // Confirm uploads and get classifications
  if (successfulPaths.length > 0) {
    try {
      const confirmRequest: UploadConfirmRequest = {
        projectId,
        files: successfulPaths,
        mode,
        category,
        categoryCode,
      };

      const response = await fetch('/api/upload/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(confirmRequest),
      });

      const confirmResponse: UploadConfirmResponse = await response.json();

      // Update files with classification results
      for (const doc of confirmResponse.documents) {
        const uploadFile = session.files.find(f => f.storagePath === doc.path);
        if (uploadFile) {
          uploadFile.status = 'completed';
          uploadFile.documentId = doc.documentId;
          uploadFile.category = doc.category;
          uploadFile.categoryCode = doc.categoryCode;
          uploadFile.domain = doc.domain;
          session.completedFiles++;

          if (onFileComplete) {
            onFileComplete(uploadFile);
          }
        }
      }

      // Handle confirmation errors
      for (const err of confirmResponse.errors) {
        const uploadFile = session.files.find(f => f.storagePath === err.path);
        if (uploadFile) {
          uploadFile.status = 'failed';
          uploadFile.error = err.error;
          session.failedFiles++;

          if (onError) {
            onError(uploadFile, new Error(err.error));
          }
        }
      }

    } catch (err) {
      // If confirmation fails, mark all uploaded files as failed
      for (const path of successfulPaths) {
        const uploadFile = session.files.find(f => f.storagePath === path.path);
        if (uploadFile) {
          uploadFile.status = 'failed';
          uploadFile.error = 'Classification failed';
          session.failedFiles++;
        }
      }
    }
  }

  session.completedAt = new Date();
  return session;
}

/**
 * Mock upload simulation
 */
async function uploadFilesMock(
  session: UploadSession,
  options: UploadOptions
): Promise<UploadSession> {
  const { projectId, mode, category, categoryCode, onProgress, onFileComplete, onError } = options;

  for (let i = 0; i < session.files.length; i++) {
    const uploadFile = session.files[i];

    // Skip already failed files
    if (uploadFile.status === 'failed') {
      continue;
    }

    uploadFile.status = 'uploading';

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 20) {
      uploadFile.progress = progress;
      await delay(100);
      reportProgress(session, uploadFile, onProgress);
    }

    // Simulate processing for AI mode
    if (mode === 'ai') {
      uploadFile.status = 'processing';
      reportProgress(session, uploadFile, onProgress);
      await delay(500);

      // Mock classification
      const classification = mockClassifyDocument(uploadFile.name);
      uploadFile.category = classification.category;
      uploadFile.categoryCode = classification.code;
      uploadFile.domain = classification.domain;
    } else if (mode === 'manual' && category) {
      uploadFile.category = category;
      uploadFile.categoryCode = categoryCode;
      uploadFile.domain = getDomainFromCode(categoryCode);
    }

    // Mark as completed
    uploadFile.status = 'completed';
    uploadFile.storagePath = generateStoragePath(projectId, uploadFile.name);
    uploadFile.documentId = `doc-mock-${Date.now()}-${i}`;
    uploadFile.publicUrl = `mock://storage/${uploadFile.storagePath}`;

    session.completedFiles++;
    session.uploadedBytes += uploadFile.size;

    reportProgress(session, uploadFile, onProgress);

    if (onFileComplete) {
      onFileComplete(uploadFile);
    }
  }

  session.completedAt = new Date();
  return session;
}

/**
 * Report progress to callback
 */
function reportProgress(
  session: UploadSession,
  file: UploadFile,
  onProgress?: (progress: UploadProgress) => void
): void {
  if (!onProgress) return;

  const overallProgress = session.totalBytes > 0
    ? Math.round((session.uploadedBytes / session.totalBytes) * 100)
    : 0;

  const currentIndex = session.files.findIndex(f => f.id === file.id);

  onProgress({
    sessionId: session.id,
    file,
    overallProgress,
    currentFileIndex: currentIndex + 1,
    totalFiles: session.totalFiles,
  });
}

/**
 * Mock document classification
 */
function mockClassifyDocument(fileName: string): { category: string; code: string; domain: DomainType } {
  const lowerName = fileName.toLowerCase();

  // Tax
  if (lowerName.includes('liasse') || lowerName.includes('fiscal') || lowerName.includes('impot')) {
    return { category: 'CIT (IS)', code: '02.1', domain: 'TAX' };
  }
  if (lowerName.includes('tva') || lowerName.includes('ca3')) {
    return { category: 'VAT (TVA)', code: '02.2', domain: 'TAX' };
  }

  // Corporate
  if (lowerName.includes('statut') || lowerName.includes('kbis')) {
    return { category: 'Constitution & Kbis', code: '01.1', domain: 'Corporate' };
  }
  if (lowerName.includes('pv') || lowerName.includes('ag')) {
    return { category: 'Vie Sociale', code: '01.3', domain: 'Corporate' };
  }

  // Social
  if (lowerName.includes('contrat') || lowerName.includes('travail')) {
    return { category: 'Contrats Travail', code: '03.2', domain: 'Social' };
  }
  if (lowerName.includes('paie') || lowerName.includes('salaire')) {
    return { category: 'Paie', code: '03.3', domain: 'Social' };
  }

  // IP/IT
  if (lowerName.includes('marque') || lowerName.includes('brevet')) {
    return { category: 'Propriete Intellectuelle', code: '04.1', domain: 'IP/IT' };
  }
  if (lowerName.includes('rgpd') || lowerName.includes('donnees')) {
    return { category: 'RGPD', code: '04.4', domain: 'IP/IT' };
  }

  // Default
  return { category: 'Documents Divers', code: '01.5', domain: 'Corporate' };
}

/**
 * Get domain from category code
 */
function getDomainFromCode(code?: string): DomainType | undefined {
  if (!code) return undefined;
  if (code.startsWith('01')) return 'Corporate';
  if (code.startsWith('02')) return 'TAX';
  if (code.startsWith('03')) return 'Social';
  if (code.startsWith('04')) return 'IP/IT';
  return undefined;
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
