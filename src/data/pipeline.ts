import { DomainType } from '@/types';

export type PipelineStage = 'proposition' | 'engagement' | 'en-cours' | 'terminee';

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
  year: number;
}

export const stageConfig: Record<PipelineStage, { label: string; color: string; bgColor: string }> = {
  proposition: { label: 'Proposition', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  engagement: { label: 'Engagement', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  'en-cours': { label: 'En cours', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  terminee: { label: 'Terminée', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
};

export const allStages: PipelineStage[] = ['proposition', 'engagement', 'en-cours', 'terminee'];

export const opportunities: Opportunity[] = [
  // ── 2025 ─────────────────────────────────────────────────────────────────
  {
    id: 'opp-1',
    name: 'Acquisition Groupe Nexus',
    clientId: 'client-1',
    clientName: 'Fonds Altaris Capital',
    stage: 'proposition',
    domains: ['TAX', 'Corporate'],
    estimatedValue: 85000,
    probability: 30,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2025-04-15',
    createdAt: '2025-01-10',
    year: 2025,
    description: 'DD fiscale et corporate dans le cadre d\'une acquisition par LBO d\'un groupe industriel.',
  },
  {
    id: 'opp-2',
    name: 'Cession DataFlow SAS',
    clientId: 'client-2',
    clientName: 'DataFlow SAS',
    stage: 'proposition',
    domains: ['TAX', 'Social', 'IP/IT'],
    estimatedValue: 120000,
    probability: 40,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2025-03-30',
    createdAt: '2025-01-05',
    year: 2025,
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
    probability: 50,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2025-03-15',
    createdAt: '2024-12-20',
    year: 2025,
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
    year: 2025,
    description: 'DD fiscale et sociale dans le cadre d\'un MBO avec financement bancaire.',
  },
  {
    id: 'opp-5',
    name: 'Acquisition BioPharm Labs',
    clientId: 'client-5',
    clientName: 'Invest Pharma Fund',
    stage: 'en-cours',
    domains: ['TAX', 'Corporate', 'IP/IT', 'Social'],
    estimatedValue: 180000,
    probability: 95,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2025-02-20',
    createdAt: '2024-12-01',
    year: 2025,
    description: 'DD complète 4 domaines pour l\'acquisition d\'un laboratoire pharmaceutique. Enjeux PI importants (brevets).',
    companies: ['BioPharm Labs SAS', 'BioPharm R&D SAS', 'BioPharm Distribution SARL'],
    teamIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
  },
  {
    id: 'opp-6',
    name: 'Carve-out Division Logistique',
    clientId: 'client-6',
    clientName: 'TransLog Group',
    stage: 'engagement',
    domains: ['TAX', 'Social', 'Corporate'],
    estimatedValue: 140000,
    probability: 70,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2025-05-01',
    createdAt: '2025-01-08',
    year: 2025,
    description: 'DD dans le cadre d\'un carve-out de la division logistique. Complexité liée aux contrats de travail et baux.',
  },
  {
    id: 'opp-7',
    name: 'Joint-Venture EcoTech',
    clientId: 'client-7',
    clientName: 'GreenFund Partners',
    stage: 'proposition',
    domains: ['TAX', 'IP/IT'],
    estimatedValue: 45000,
    probability: 25,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2025-06-01',
    createdAt: '2025-01-12',
    year: 2025,
    description: 'DD pré-JV pour un projet dans les technologies vertes.',
  },
  // ── 2024 — Terminées ────────────────────────────────────────────────────
  {
    id: 'opp-8',
    name: 'Acquisition TechVision SAS',
    clientId: 'client-1',
    clientName: 'Groupe TechVision',
    stage: 'terminee',
    domains: ['TAX', 'Social', 'Corporate'],
    estimatedValue: 110000,
    probability: 100,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2024-11-15',
    createdAt: '2024-06-20',
    year: 2024,
    description: 'DD fiscale, sociale et corporate dans le cadre d\'un LBO. Mission terminée avec succès.',
    companies: ['TechVision Holding SAS', 'TechVision SAS', 'TechVision Services SARL', 'InnoLab SAS'],
    teamIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
  },
  {
    id: 'opp-9',
    name: 'DD Fiscale MediaGroup',
    clientId: 'client-8',
    clientName: 'Fonds Crescendo',
    stage: 'terminee',
    domains: ['TAX'],
    estimatedValue: 42000,
    probability: 100,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2024-09-30',
    createdAt: '2024-05-15',
    year: 2024,
    description: 'DD fiscale pré-acquisition d\'un groupe média. Focus CIR et intégration fiscale.',
  },
  {
    id: 'opp-10',
    name: 'Cession BelleVue Immobilier',
    clientId: 'client-9',
    clientName: 'BelleVue SA',
    stage: 'terminee',
    domains: ['TAX', 'Corporate'],
    estimatedValue: 75000,
    probability: 100,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2024-07-20',
    createdAt: '2024-03-10',
    year: 2024,
    description: 'Vendor DD dans le cadre de la cession d\'un portefeuille immobilier. Mission terminée.',
    companies: ['BelleVue SA', 'BelleVue Gestion SCI', 'BelleVue Promotion SARL'],
  },
  {
    id: 'opp-11',
    name: 'Acquisition CyberSec Pro',
    clientId: 'client-10',
    clientName: 'Digital Trust Fund',
    stage: 'terminee',
    domains: ['TAX', 'IP/IT', 'Social'],
    estimatedValue: 88000,
    probability: 100,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2024-12-10',
    createdAt: '2024-08-01',
    year: 2024,
    description: 'DD complète pour l\'acquisition d\'un éditeur de solutions de cybersécurité.',
    teamIds: ['user-2', 'user-3', 'user-4', 'user-6'],
  },
  {
    id: 'opp-12',
    name: 'MBO Groupe Artisan',
    clientId: 'client-11',
    clientName: 'Management Artisan',
    stage: 'terminee',
    domains: ['TAX', 'Social', 'Corporate'],
    estimatedValue: 55000,
    probability: 100,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2024-10-30',
    createdAt: '2024-06-01',
    year: 2024,
    description: 'DD pour MBO d\'un groupe artisanal. Focus social sur les conventions collectives.',
  },
  // ── 2023 — Terminées ────────────────────────────────────────────────────
  {
    id: 'opp-13',
    name: 'LBO Distribution Pro',
    clientId: 'client-12',
    clientName: 'Fonds Capital Avenir',
    stage: 'terminee',
    domains: ['TAX', 'Social'],
    estimatedValue: 180000,
    probability: 100,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2023-11-15',
    createdAt: '2023-06-10',
    year: 2023,
    description: 'DD fiscale et sociale dans le cadre d\'un LBO sur un réseau de distribution — 15 entités.',
    companies: ['Distribution Pro SA', 'DP Logistique SARL', 'DP Sud SAS'],
  },
  {
    id: 'opp-14',
    name: 'Acquisition FinTech Labs',
    clientId: 'client-13',
    clientName: 'BankInvest Partners',
    stage: 'terminee',
    domains: ['TAX', 'IP/IT'],
    estimatedValue: 45000,
    probability: 100,
    responsibleId: 'user-2',
    responsibleName: 'Sophie Laurent',
    expectedCloseDate: '2023-09-30',
    createdAt: '2023-05-20',
    year: 2023,
    description: 'DD fiscale et IP/IT pour l\'acquisition d\'une fintech — focus brevets et CIR.',
  },
  {
    id: 'opp-15',
    name: 'Carve-out Industrie Verte',
    clientId: 'client-14',
    clientName: 'GreenCorp Industries',
    stage: 'terminee',
    domains: ['TAX', 'Corporate', 'Social', 'IP/IT'],
    estimatedValue: 200000,
    probability: 100,
    responsibleId: 'user-1',
    responsibleName: 'Marc Dubois',
    expectedCloseDate: '2023-12-20',
    createdAt: '2023-07-15',
    year: 2023,
    description: 'DD complète 4 domaines dans le cadre du carve-out d\'une division industrielle verte.',
    companies: ['GreenCorp SA', 'GreenCorp Energy SAS', 'GreenCorp Tech SARL'],
    teamIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
  },
];

export const getOpportunitiesByStage = (stage: PipelineStage, filteredOpps?: Opportunity[]): Opportunity[] => {
  const source = filteredOpps || opportunities;
  return source.filter(o => o.stage === stage);
};

export const getTotalPipelineValue = (filteredOpps?: Opportunity[]): number => {
  const source = filteredOpps || opportunities;
  return source.reduce((sum, o) => sum + o.estimatedValue, 0);
};

export const getWeightedPipelineValue = (filteredOpps?: Opportunity[]): number => {
  const source = filteredOpps || opportunities;
  return source.reduce((sum, o) => sum + (o.estimatedValue * o.probability / 100), 0);
};

export const getAvailableYears = (): number[] => {
  const years = Array.from(new Set(opportunities.map(o => o.year)));
  return years.sort((a, b) => b - a);
};

export const getAvailableLeaders = (): { id: string; name: string }[] => {
  const map = new Map<string, string>();
  opportunities.forEach(o => map.set(o.responsibleId, o.responsibleName));
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
};
