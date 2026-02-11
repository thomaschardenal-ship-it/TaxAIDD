// Types pour l'application WeDD

export type UserRole = 'admin' | 'senior' | 'junior' | 'specialist';
export type DomainType = 'TAX' | 'Social' | 'Corporate' | 'IP/IT';
export type ProjectStatus = 'en-cours' | 'review' | 'valide' | 'urgent';
export type DocumentStatus = 'received' | 'pending' | 'missing' | 'partiel' | 'na';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar?: string;
  initials: string;
  color: string;
}

export interface ClientContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isPrimary?: boolean;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  initials: string;
  color: string;
  address?: string;
  website?: string;
  siren?: string;
  contacts?: ClientContact[];
}

export interface Company {
  id: string;
  name: string;
  ownership: number;
  parentId: string | null;
  type: 'holding' | 'subsidiary';
  siren?: string;
  legalForm?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  progress: number;
  responsibleId: string;
  teamIds: string[];
  domains: DomainType[];
  companies: Company[];
}

export interface DocumentItem {
  id: string;
  code: string;
  name: string;
  status: DocumentStatus;
  children?: DocumentItem[];
  parentId?: string;
  domain?: DomainType;
  pages?: number;
  highlights?: Highlight[];
  missingElements?: string[];
  tags?: DocumentTag[];
}

export interface Highlight {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  linkedElementId: string;
  linkedElementName: string;
}

export interface ReportElement {
  id: string;
  type: 'section' | 'table' | 'list' | 'text';
  title: string;
  domain: DomainType;
  content: ReportTableData | ReportListItem[] | string;
  sourceDocumentIds: string[];
  isCollapsed?: boolean;
}

export interface ReportTableData {
  headers: string[];
  rows: ReportTableRow[];
}

export interface ReportTableRow {
  label: string;
  values: (string | number)[];
  isEditable?: boolean;
  sourceDocId?: string;
}

export type AttentionLevel = 'information' | 'modere' | 'critique';

export interface ReportListItem {
  id: string;
  text: string;
  risk?: 'low' | 'medium' | 'high';
  attention?: AttentionLevel;
  sourceDocId?: string;
}

export type TagType = 'document_type' | 'entity' | 'period' | 'domain' | 'free';

export interface DocumentTag {
  type: TagType;
  value: string;
  color?: string;
}

export interface IRLItem {
  category: string;
  document: string;
  status: DocumentStatus;
}

export interface QAItem {
  question: string;
  source: string;
  partialAnswer?: string;
}
