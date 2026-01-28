'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDataSource } from '@/lib/data';
import type { Project } from '@/types';

interface UseProjectReturn {
  project: Project | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single project by ID
 * Automatically switches between mock and API data based on NEXT_PUBLIC_USE_MOCK
 */
export function useProject(projectId: string): UseProjectReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dataSource = getDataSource();
      const data = await dataSource.getProjectById(projectId);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  };
}
