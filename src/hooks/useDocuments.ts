'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDataSource } from '@/lib/data';
import type { DocumentItem } from '@/types';

interface UseDocumentsReturn {
  documents: DocumentItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  uploadDocuments: (files: File[]) => Promise<void>;
  uploading: boolean;
}

/**
 * Hook for fetching documents for a project
 * Automatically switches between mock and API data based on NEXT_PUBLIC_USE_MOCK
 */
export function useDocuments(projectId: string): UseDocumentsReturn {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!projectId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dataSource = getDataSource();
      const data = await dataSource.getDocuments(projectId);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const uploadDocuments = useCallback(async (files: File[]) => {
    if (!projectId || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const dataSource = getDataSource();
      await dataSource.uploadDocuments(projectId, files);
      // Refetch documents after upload
      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload documents'));
      throw err;
    } finally {
      setUploading(false);
    }
  }, [projectId, fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
    uploadDocuments,
    uploading,
  };
}
