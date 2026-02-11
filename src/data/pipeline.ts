import { DomainType } from '@/types';

export type PipelineStage = 'identification' | 'qualification' | 'proposition' | 'engagement' | 'staffing' | 'lancement';

export interface Opportunity {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  stage: PipelineStage;
  domains: DomainType[];
  estimatedValue: number;
  probability: number;
  responsibleId: string;
  responsibleName: string;
  expectedCloseDate: string;
  createdAt: string;
  description?: string;
  companies?: string[];
  teamIds?: string[];
}

export const stageConfig: Record<PipelineStage, { label: string; color: string; bgColor: string }> = {
  identification: { label: 'Identification', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  qualification: { label: 'Qualification', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  proposition: { label: 'Proposition', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  engagement: { label: 'Engagement', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  staffing: { label: 'Staffing', color: 'text-indigo-700', bgColor: 'bg-indigo-50' },
  lancement: { label: 'Lancement', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
};

export const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    name: 'Acquisition Groupe Nexus',
    clientId: 'client-1',
    clientName: 'Fonds Altaris Capital',
    stage: 'identification',
    domains: ['TAX', 'Corporate'],
    estimatedValue: 85000,
    probability: 20,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2025-04-15',
    createdAt: '2025-01-10',
    description: 'DD fiscale et corporate dans le cadre d\'une acquisition par LBO d\'un groupe industriel.',
  },
  {
    id: 'opp-2',
    name: 'Cession DataFlow SAS',
    clientId: 'client-2',
    clientName: 'DataFlow SAS',
    stage: 'qualification',
    domains: ['TAX', 'Social', 'IP/IT'],
    estimatedValue: 120000,
    probability: 40,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2025-03-30',
    createdAt: '2025-01-05',
    description: 'Vendor DD complète pour une cession à un acquéreur stratégique. Enjeux IP significatifs.',
    companies: ['DataFlow SAS', 'DataFlow Cloud SARL'],
  },
  {
    id: 'opp-3',
    name: 'Restructuration Groupe Vidal',
    clientId: 'client-3',
    clientName: 'Groupe Vidal',
    stage: 'proposition',
    domains: ['TAX', 'Corporate', 'Social'],
    estimatedValue: 95000,
    probability: 60,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2025-03-15',
    createdAt: '2024-12-20',
    description: 'DD dans le cadre d\'une restructuration juridique et fiscale du groupe familial.',
    companies: ['Vidal Holding SAS', 'Vidal Industries SA', 'Vidal Services SARL'],
  },
  {
    id: 'opp-4',
    name: 'MBO TechSolutions',
    clientId: 'client-4',
    clientName: 'Management TechSolutions',
    stage: 'engagement',
    domains: ['TAX', 'Social'],
    estimatedValue: 65000,
    probability: 80,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2025-02-28',
    createdAt: '2024-12-15',
    description: 'DD fiscale et sociale dans le cadre d\'un MBO avec financement bancaire.',
  },
  {
    id: 'opp-5',
    name: 'Acquisition BioPharm Labs',
    clientId: 'client-5',
    clientName: 'Invest Pharma Fund',
    stage: 'staffing',
    domains: ['TAX', 'Corporate', 'IP/IT', 'Social'],
    estimatedValue: 180000,
    probability: 90,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2025-02-20',
    createdAt: '2024-12-01',
    description: 'DD complète 4 domaines pour l\'acquisition d\'un laboratoire pharmaceutique. Enjeux PI importants (brevets).',
    companies: ['BioPharm Labs SAS', 'BioPharm R&D SAS', 'BioPharm Distribution SARL'],
    teamIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
  },
  {
    id: 'opp-6',
    name: 'Acquisition TechVision SAS',
    clientId: 'client-1',
    clientName: 'Groupe TechVision',
    stage: 'lancement',
    domains: ['TAX', 'Social', 'Corporate'],
    estimatedValue: 110000,
    probability: 100,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2025-02-15',
    createdAt: '2024-11-20',
    description: 'Mission lancée - voir le dossier DD correspondant.',
    companies: ['TechVision Holding SAS', 'TechVision SAS', 'TechVision Services SARL', 'InnoLab SAS'],
    teamIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
  },
  {
    id: 'opp-7',
    name: 'Carve-out Division Logistique',
    clientId: 'client-6',
    clientName: 'TransLog Group',
    stage: 'qualification',
    domains: ['TAX', 'Social', 'Corporate'],
    estimatedValue: 140000,
    probability: 35,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2025-05-01',
    createdAt: '2025-01-08',
    description: 'DD dans le cadre d\'un carve-out de la division logistique. Complexité liée aux contrats de travail et baux.',
  },
  {
    id: 'opp-8',
    name: 'Joint-Venture EcoTech',
    clientId: 'client-7',
    clientName: 'GreenFund Partners',
    stage: 'identification',
    domains: ['TAX', 'IP/IT'],
    estimatedValue: 45000,
    probability: 15,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2025-06-01',
    createdAt: '2025-01-12',
    description: 'DD pré-JV pour un projet dans les technologies vertes.',
  },
];

export const getOpportunitiesByStage = (stage: PipelineStage): Opportunity[] => {
  return opportunities.filter(o => o.stage === stage);
};

export const allStages: PipelineStage[] = ['identification', 'qualification', 'proposition', 'engagement', 'staffing', 'lancement'];

export const getTotalPipelineValue = (): number => {
  return opportunities.reduce((sum, o) => sum + o.estimatedValue, 0);
};

export const getWeightedPipelineValue = (): number => {
  return opportunities.reduce((sum, o) => sum + (o.estimatedValue * o.probability / 100), 0);
};
