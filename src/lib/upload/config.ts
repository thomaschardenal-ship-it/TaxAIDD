export const UPLOAD_CONFIG = {
  // Size limits
  maxSingleFileSize: 50 * 1024 * 1024, // 50MB (Supabase limit)
  maxTotalStorageBytes: 1024 * 1024 * 1024, // 1GB free tier

  // Retry configuration
  retryAttempts: 2,
  retryDelayMs: 1000,

  // Concurrent uploads
  maxConcurrentUploads: 3,

  // Allowed file types
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/msword', // doc
    'text/csv',
    'text/plain',
  ],

  // File extensions (backup check)
  allowedExtensions: [
    '.pdf',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.xlsx',
    '.xls',
    '.docx',
    '.doc',
    '.csv',
    '.txt',
  ],
} as const;

/**
 * Validate a file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check size
  if (file.size > UPLOAD_CONFIG.maxSingleFileSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Maximum: ${formatBytes(UPLOAD_CONFIG.maxSingleFileSize)}`,
    };
  }

  // Check type
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const mimeValid = UPLOAD_CONFIG.allowedMimeTypes.includes(file.type as typeof UPLOAD_CONFIG.allowedMimeTypes[number]);
  const extValid = UPLOAD_CONFIG.allowedExtensions.includes(extension as typeof UPLOAD_CONFIG.allowedExtensions[number]);

  if (!mimeValid && !extValid) {
    return {
      valid: false,
      error: `Type de fichier non supporté: ${extension}`,
    };
  }

  return { valid: true };
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Generate a unique file ID
 */
export function generateFileId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate storage path for a file
 */
export function generateStoragePath(projectId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${projectId}/${timestamp}-${sanitizedName}`;
}
