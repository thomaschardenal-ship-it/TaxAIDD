'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDataSource } from '@/lib/data';
import type { ReportElement, DomainType } from '@/types';

interface UseReportElementsReturn {
  elements: ReportElement[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  generateElements: (domain: DomainType) => Promise<void>;
  generating: boolean;
}

/**
 * Hook for fetching report elements for a project
 * Automatically switches between mock and API data based on NEXT_PUBLIC_USE_MOCK
 */
export function useReportElements(projectId: string): UseReportElementsReturn {
  const [elements, setElements] = useState<ReportElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchElements = useCallback(async () => {
    if (!projectId) {
      setElements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dataSource = getDataSource();
      const data = await dataSource.getReportElements(projectId);
      setElements(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch report elements'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const generateElements = useCallback(async (domain: DomainType) => {
    if (!projectId) return;

    setGenerating(true);
    setError(null);
    try {
      const dataSource = getDataSource();
      const result = await dataSource.generateReportElements(projectId, domain);
      // Merge new elements with existing ones
      setElements(prev => {
        const existingIds = new Set(prev.map(el => el.id));
        const newElements = result.elements.filter(el => !existingIds.has(el.id));
        return [...prev, ...newElements];
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate report elements'));
      throw err;
    } finally {
      setGenerating(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  return {
    elements,
    loading,
    error,
    refetch: fetchElements,
    generateElements,
    generating,
  };
}
