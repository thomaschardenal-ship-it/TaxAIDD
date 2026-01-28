// MockDataSource - Uses static data from @/data
import {
  projects,
  getProjectById as getProjectByIdFromData,
} from '@/data/projects';
import {
  getDocumentsForProject,
  getDocumentById as getDocumentByIdFromData,
  flattenDocuments,
} from '@/data/documents';
import {
  getReportElementsForProject,
  getIRLItemsForProject,
  getQAItemsForProject,
} from '@/data/reportContent';
import type { Project, DocumentItem, ReportElement, IRLItem, QAItem } from '@/types';
import type { DataSource, CreateProjectDTO, UploadResult, GenerateReportResult } from './types';

/**
 * MockDataSource - Implementation using static mock data
 * Used for demos, development, and GitHub Pages deployment
 */
export class MockDataSource implements DataSource {
  // Simulate network delay for realistic UX
  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    await this.delay();
    return [...projects];
  }

  async getProjectById(id: string): Promise<Project | null> {
    await this.delay();
    return getProjectByIdFromData(id) || null;
  }

  async createProject(data: CreateProjectDTO): Promise<Project> {
    await this.delay(500);
    // In mock mode, just return a fake created project
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: data.name,
      clientId: data.clientId,
      status: 'en-cours',
      startDate: data.startDate,
      endDate: data.endDate,
      progress: 0,
      responsibleId: data.responsibleId,
      teamIds: data.teamIds,
      domains: data.domains as Project['domains'],
      companies: [],
    };
    return newProject;
  }

  // Documents
  async getDocuments(projectId: string): Promise<DocumentItem[]> {
    await this.delay();
    return getDocumentsForProject(projectId);
  }

  async getDocumentById(projectId: string, documentId: string): Promise<DocumentItem | null> {
    await this.delay();
    return getDocumentByIdFromData(projectId, documentId) || null;
  }

  async uploadDocuments(projectId: string, files: File[]): Promise<UploadResult> {
    await this.delay(1000);
    // Simulate upload - in mock mode, just return empty result
    console.log(`[Mock] Uploading ${files.length} files to project ${projectId}`);
    return {
      documents: [],
      jobId: `mock-job-${Date.now()}`,
    };
  }

  // Report Elements
  async getReportElements(projectId: string): Promise<ReportElement[]> {
    await this.delay();
    return getReportElementsForProject(projectId);
  }

  async generateReportElements(projectId: string, domain: string): Promise<GenerateReportResult> {
    await this.delay(2000);
    // In mock mode, return existing elements for the domain
    console.log(`[Mock] Generating report elements for project ${projectId}, domain ${domain}`);
    const allElements = getReportElementsForProject(projectId);
    const domainElements = allElements.filter(el => el.domain === domain);
    return {
      elements: domainElements,
      jobId: `mock-gen-${Date.now()}`,
    };
  }

  // IRL
  async getIRLItems(projectId: string): Promise<IRLItem[]> {
    await this.delay();
    return getIRLItemsForProject(projectId);
  }

  // Q&A
  async getQAItems(projectId: string): Promise<QAItem[]> {
    await this.delay();
    return getQAItemsForProject(projectId);
  }
}
