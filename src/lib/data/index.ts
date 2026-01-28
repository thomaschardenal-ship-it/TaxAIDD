// Data Source Factory
// Returns MockDataSource or APIDataSource based on environment
import type { DataSource } from './types';
import { MockDataSource } from './mock';
import { APIDataSource } from './api';

// Check if we should use mock data
// Default to true (mock) for safety - only use API when explicitly set to 'false'
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// Singleton instances
let mockDataSource: MockDataSource | null = null;
let apiDataSource: APIDataSource | null = null;

/**
 * Get the appropriate DataSource based on environment configuration
 * - NEXT_PUBLIC_USE_MOCK=true → MockDataSource (static data, for demos)
 * - NEXT_PUBLIC_USE_MOCK=false → APIDataSource (real API calls)
 */
export function getDataSource(): DataSource {
  if (USE_MOCK) {
    if (!mockDataSource) {
      mockDataSource = new MockDataSource();
    }
    return mockDataSource;
  }

  if (!apiDataSource) {
    apiDataSource = new APIDataSource();
  }
  return apiDataSource;
}

/**
 * Check if currently using mock data
 */
export function isMockMode(): boolean {
  return USE_MOCK;
}

// Re-export types
export type { DataSource, CreateProjectDTO, UploadResult, GenerateReportResult, AsyncState } from './types';
