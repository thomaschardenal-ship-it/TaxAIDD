// Data Access Layer - Interface definitions
import {
  Project,
  DocumentItem,
  ReportElement,
  IRLItem,
  QAItem,
} from '@/types';

// DTOs for creating/updating entities
export interface CreateProjectDTO {
  name: string;
  clientId: string;
  startDate: string;
  endDate: string;
  domains: string[];
  responsibleId: string;
  teamIds: string[];
}

export interface UploadResult {
  documents: DocumentItem[];
  jobId?: string;
}

export interface GenerateReportResult {
  elements: ReportElement[];
  jobId?: string;
}

/**
 * DataSource interface - abstraction for data access
 * Implementations: MockDataSource (static data) and APIDataSource (real API)
 */
export interface DataSource {
  // Projects
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  createProject(data: CreateProjectDTO): Promise<Project>;

  // Documents
  getDocuments(projectId: string): Promise<DocumentItem[]>;
  getDocumentById(projectId: string, documentId: string): Promise<DocumentItem | null>;
  uploadDocuments(projectId: string, files: File[]): Promise<UploadResult>;

  // Report Elements
  getReportElements(projectId: string): Promise<ReportElement[]>;
  generateReportElements(projectId: string, domain: string): Promise<GenerateReportResult>;

  // IRL (Information Request List)
  getIRLItems(projectId: string): Promise<IRLItem[]>;

  // Q&A
  getQAItems(projectId: string): Promise<QAItem[]>;
}

// Helper type for async data state
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}
