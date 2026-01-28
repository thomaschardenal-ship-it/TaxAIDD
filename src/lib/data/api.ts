// APIDataSource - Real API calls for production
import type { Project, DocumentItem, ReportElement, IRLItem, QAItem } from '@/types';
import type { DataSource, CreateProjectDTO, UploadResult, GenerateReportResult } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * APIDataSource - Implementation using real API endpoints
 * Used for production deployment on Vercel/Azure
 */
export class APIDataSource implements DataSource {
  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.fetch<Project[]>('/projects');
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      return await this.fetch<Project>(`/projects/${id}`);
    } catch {
      return null;
    }
  }

  async createProject(data: CreateProjectDTO): Promise<Project> {
    return this.fetch<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Documents
  async getDocuments(projectId: string): Promise<DocumentItem[]> {
    return this.fetch<DocumentItem[]>(`/projects/${projectId}/documents`);
  }

  async getDocumentById(projectId: string, documentId: string): Promise<DocumentItem | null> {
    try {
      return await this.fetch<DocumentItem>(`/projects/${projectId}/documents/${documentId}`);
    } catch {
      return null;
    }
  }

  async uploadDocuments(projectId: string, files: File[]): Promise<UploadResult> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  // Report Elements
  async getReportElements(projectId: string): Promise<ReportElement[]> {
    return this.fetch<ReportElement[]>(`/projects/${projectId}/report-elements`);
  }

  async generateReportElements(projectId: string, domain: string): Promise<GenerateReportResult> {
    return this.fetch<GenerateReportResult>(`/projects/${projectId}/report-elements/generate`, {
      method: 'POST',
      body: JSON.stringify({ domain }),
    });
  }

  // IRL
  async getIRLItems(projectId: string): Promise<IRLItem[]> {
    return this.fetch<IRLItem[]>(`/projects/${projectId}/irl`);
  }

  // Q&A
  async getQAItems(projectId: string): Promise<QAItem[]> {
    return this.fetch<QAItem[]>(`/projects/${projectId}/qa`);
  }
}
