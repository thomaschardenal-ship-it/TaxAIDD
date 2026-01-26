import { Project, Company } from '@/types';

const techVisionCompanies: Company[] = [
  {
    id: 'comp-tv-1',
    name: 'TechVision Holding',
    ownership: 100,
    parentId: null,
    type: 'holding',
    siren: '123 456 789',
    legalForm: 'SAS',
  },
  {
    id: 'comp-tv-2',
    name: 'TechVision SAS',
    ownership: 100,
    parentId: 'comp-tv-1',
    type: 'subsidiary',
    siren: '234 567 890',
    legalForm: 'SAS',
  },
  {
    id: 'comp-tv-3',
    name: 'TechVision Services',
    ownership: 75,
    parentId: 'comp-tv-1',
    type: 'subsidiary',
    siren: '345 678 901',
    legalForm: 'SARL',
  },
  {
    id: 'comp-tv-4',
    name: 'InnoLab',
    ownership: 51,
    parentId: 'comp-tv-1',
    type: 'subsidiary',
    siren: '456 789 012',
    legalForm: 'SAS',
  },
];

const innovateCompanies: Company[] = [
  {
    id: 'comp-in-1',
    name: 'Innovate Holding',
    ownership: 100,
    parentId: null,
    type: 'holding',
    siren: '567 890 123',
    legalForm: 'SA',
  },
  {
    id: 'comp-in-2',
    name: 'Innovate France',
    ownership: 100,
    parentId: 'comp-in-1',
    type: 'subsidiary',
    siren: '678 901 234',
    legalForm: 'SAS',
  },
  {
    id: 'comp-in-3',
    name: 'Innovate Digital',
    ownership: 80,
    parentId: 'comp-in-1',
    type: 'subsidiary',
    siren: '789 012 345',
    legalForm: 'SARL',
  },
];

export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Acquisition TechVision SAS',
    clientId: 'client-1',
    status: 'en-cours',
    startDate: '2025-01-15',
    endDate: '2025-02-28',
    progress: 65,
    responsibleId: 'user-1',
    teamIds: ['user-2', 'user-3', 'user-4'],
    domains: ['TAX', 'Social', 'Corporate'],
    companies: techVisionCompanies,
  },
  {
    id: 'project-2',
    name: 'Due Diligence Innovate Holding',
    clientId: 'client-2',
    status: 'review',
    startDate: '2024-12-10',
    endDate: '2025-01-31',
    progress: 85,
    responsibleId: 'user-2',
    teamIds: ['user-1', 'user-5', 'user-6'],
    domains: ['TAX', 'Corporate', 'IP/IT'],
    companies: innovateCompanies,
  },
];

export const getProjectById = (id: string): Project | undefined =>
  projects.find(project => project.id === id);
