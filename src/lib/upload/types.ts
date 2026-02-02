import type { DomainType } from '@/types';

// Upload status for individual files
export type FileUploadStatus =
  | 'pending'      // Waiting to be uploaded
  | 'uploading'    // Currently uploading to Supabase
  | 'processing'   // Server processing (AI classification)
  | 'completed'    // Successfully uploaded
  | 'failed';      // Upload failed

// Individual file tracking
export interface UploadFile {
  id: string;                    // Unique identifier
  file: File;                    // The actual File object
  name: string;                  // Display name
  size: number;                  // File size in bytes
  status: FileUploadStatus;
  progress: number;              // 0-100 percentage
  error?: string;                // Error message if failed
  retryCount: number;            // Number of retry attempts

  // After successful upload
  storagePath?: string;          // Path in Supabase storage
  publicUrl?: string;            // Public URL for the file
  documentId?: string;           // Assigned document ID
  category?: string;             // AI-classified or manual category
  categoryCode?: string;         // e.g., '02.1' for CIT
  domain?: DomainType;           // Classified domain
}

// Overall upload session
export interface UploadSession {
  id: string;
  projectId: string;
  files: UploadFile[];
  mode: 'manual' | 'ai';         // Upload mode
  manualCategory?: string;       // For manual mode
  manualCategoryCode?: string;   // For manual mode

  // Aggregate stats
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  totalBytes: number;
  uploadedBytes: number;

  // Timestamps
  startedAt: Date;
  completedAt?: Date;
}

// Progress callback
export interface UploadProgress {
  sessionId: string;
  file: UploadFile;
  overallProgress: number;     // Overall progress (0-100)
  currentFileIndex: number;    // Current file index
  totalFiles: number;          // Total file count
}

export type OnProgressCallback = (progress: UploadProgress) => void;
export type OnFileCompleteCallback = (file: UploadFile) => void;
export type OnErrorCallback = (file: UploadFile, error: Error) => void;

// Upload options
export interface UploadOptions {
  projectId: string;
  files: File[];
  mode: 'manual' | 'ai';
  category?: string;              // For manual mode
  categoryCode?: string;          // For manual mode
  onProgress?: OnProgressCallback;
  onFileComplete?: OnFileCompleteCallback;
  onError?: OnErrorCallback;
}

// API Response types
export interface SignedUrlResponse {
  signedUrl: string;
  path: string;
  token: string;
}

export interface UploadConfirmRequest {
  projectId: string;
  files: Array<{
    path: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>;
  mode: 'manual' | 'ai';
  category?: string;
  categoryCode?: string;
}

export interface UploadConfirmResponse {
  success: boolean;
  documents: Array<{
    path: string;
    documentId: string;
    category?: string;
    categoryCode?: string;
    domain?: DomainType;
  }>;
  errors: Array<{
    path: string;
    error: string;
  }>;
}

// Error codes
export type UploadErrorCode =
  | 'SIZE_EXCEEDED'
  | 'INVALID_TYPE'
  | 'STORAGE_ERROR'
  | 'QUOTA_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'PROCESSING_ERROR';
