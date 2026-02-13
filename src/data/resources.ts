import { DomainType } from '@/types';

export interface CVProfile {
  id: string;
  userId: string;
  name: string;
  title: string;
  specialty: DomainType;
  yearsExperience: number;
  education: string;
  certifications: string[];
  languages: string[];
  keyExperiences: string[];
  availability: 'available' | 'busy' | 'partial';
}

export interface Credential {
  id: string;
  year: number;
  operationType: string;
  sector: string;
  scope: string;
  domains: DomainType[];
  description: string;
  dealSize?: string;
}

export interface ScopeTemplate {
  id: string;
  domain: DomainType;
  missionType: string;
  title: string;
  sections: string[];
  estimatedDays: number;
}

export const cvProfiles: CVProfile[] = [
  {
    id: 'cv-1',
    userId: 'user-1',
    name: 'Marc Dubois',
    title: 'Associé — Fiscaliste',
    specialty: 'TAX',
    yearsExperience: 15,
    education: 'DJCE Montpellier, LL.M. NYU',
    certifications: ['Avocat Barreau de Paris', 'Certified Tax Advisor'],
    languages: ['Français', 'Anglais', 'Espagnol'],
    keyExperiences: [
      'DD fiscale sur plus de 80 opérations M&A (€10M-€500M)',
      'Expert en prix de transfert et restructurations internationales',
      'Spécialiste CIR/CII et régimes d\'incitation fiscale',
      'Expérience LBO, MBO, carve-out, joint-ventures',
    ],
    availability: 'partial',
  },
  {
    id: 'cv-2',
    userId: 'user-2',
    name: 'Sophie Laurent',
    title: 'Senior Manager — Fiscaliste',
    specialty: 'TAX',
    yearsExperience: 8,
    education: 'Master 2 Droit Fiscal, Université Paris-Dauphine',
    certifications: ['Avocat Barreau de Paris'],
    languages: ['Français', 'Anglais'],
    keyExperiences: [
      'DD fiscale sur 40+ opérations mid-market',
      'Expert en intégration fiscale et consolidation',
      'Spécialiste TVA complexe et groupes multi-entités',
      'Coordination d\'équipes DD pluridisciplinaires',
    ],
    availability: 'available',
  },
  {
    id: 'cv-3',
    userId: 'user-3',
    name: 'Thomas Bernard',
    title: 'Consultant — Fiscaliste Junior',
    specialty: 'TAX',
    yearsExperience: 2,
    education: 'Master 2 Droit Fiscal, Université Paris-Saclay',
    certifications: ['CAPA en cours'],
    languages: ['Français', 'Anglais'],
    keyExperiences: [
      'Participation à 8 DD fiscales',
      'Analyse de liasses fiscales et réconciliation résultat fiscal',
      'Revue des crédits d\'impôt (CIR/CII)',
    ],
    availability: 'available',
  },
  {
    id: 'cv-4',
    userId: 'user-4',
    name: 'Claire Martin',
    title: 'Senior — Spécialiste Social',
    specialty: 'Social',
    yearsExperience: 6,
    education: 'Master 2 Droit Social, Université Paris 1 Panthéon-Sorbonne',
    certifications: ['Avocat Barreau de Paris'],
    languages: ['Français', 'Anglais'],
    keyExperiences: [
      'DD sociale sur 25+ opérations',
      'Expert contentieux prud\'homal et URSSAF',
      'Spécialiste restructurations sociales et PSE',
      'Audit masse salariale et avantages sociaux',
    ],
    availability: 'busy',
  },
  {
    id: 'cv-5',
    userId: 'user-5',
    name: 'Pierre Durand',
    title: 'Senior — Spécialiste Corporate',
    specialty: 'Corporate',
    yearsExperience: 7,
    education: 'Master 2 Droit des Affaires, Université Paris 2 Assas',
    certifications: ['Avocat Barreau de Paris'],
    languages: ['Français', 'Anglais', 'Allemand'],
    keyExperiences: [
      'DD corporate sur 30+ opérations',
      'Expert en gouvernance et droit des sociétés',
      'Spécialiste pactes d\'actionnaires et management packages',
      'Revue contractuelle (baux, conventions réglementées)',
    ],
    availability: 'available',
  },
];

export const credentials: Credential[] = [
  {
    id: 'cred-1',
    year: 2024,
    operationType: 'LBO',
    sector: 'Technologies',
    scope: 'DD fiscale, sociale et corporate',
    domains: ['TAX', 'Social', 'Corporate'],
    description: 'Acquisition par LBO d\'un éditeur de logiciel SaaS — DD complète pour le fonds acquéreur',
    dealSize: '€120M',
  },
  {
    id: 'cred-2',
    year: 2024,
    operationType: 'Cession',
    sector: 'Santé / Pharma',
    scope: 'Vendor DD fiscale et IP/IT',
    domains: ['TAX', 'IP/IT'],
    description: 'Vendor DD dans le cadre de la cession d\'un laboratoire — focus brevets et CIR',
    dealSize: '€85M',
  },
  {
    id: 'cred-3',
    year: 2024,
    operationType: 'MBO',
    sector: 'Services B2B',
    scope: 'DD fiscale et sociale',
    domains: ['TAX', 'Social'],
    description: 'DD pour le management dans le cadre d\'un MBO avec financement bancaire',
    dealSize: '€35M',
  },
  {
    id: 'cred-4',
    year: 2023,
    operationType: 'Carve-out',
    sector: 'Industrie',
    scope: 'DD fiscale, sociale, corporate et IP/IT',
    domains: ['TAX', 'Social', 'Corporate', 'IP/IT'],
    description: 'DD complète dans le cadre du carve-out d\'une division industrielle d\'un groupe coté',
    dealSize: '€200M',
  },
  {
    id: 'cred-5',
    year: 2023,
    operationType: 'Acquisition',
    sector: 'E-commerce',
    scope: 'DD fiscale et corporate',
    domains: ['TAX', 'Corporate'],
    description: 'DD pour l\'acquisition d\'une marketplace en forte croissance par un fonds de growth',
    dealSize: '€65M',
  },
  {
    id: 'cred-6',
    year: 2023,
    operationType: 'Joint-Venture',
    sector: 'Énergie',
    scope: 'DD fiscale',
    domains: ['TAX'],
    description: 'Due diligence fiscale dans le cadre de la création d\'une JV dans les énergies renouvelables',
  },
  {
    id: 'cred-7',
    year: 2022,
    operationType: 'LBO secondaire',
    sector: 'Distribution',
    scope: 'DD fiscale et sociale complète',
    domains: ['TAX', 'Social'],
    description: 'DD pour un LBO secondaire sur un réseau de distribution spécialisée — 15 entités',
    dealSize: '€180M',
  },
  {
    id: 'cred-8',
    year: 2022,
    operationType: 'Acquisition',
    sector: 'FinTech',
    scope: 'DD fiscale et IP/IT',
    domains: ['TAX', 'IP/IT'],
    description: 'Acquisition d\'une fintech — focus sur la propriété intellectuelle et les crédits d\'impôt',
    dealSize: '€45M',
  },
];

export const scopeTemplates: ScopeTemplate[] = [
  {
    id: 'scope-1',
    domain: 'TAX',
    missionType: 'DD Fiscale Standard',
    title: 'Due Diligence Fiscale — Périmètre Standard',
    sections: [
      'Impôt sur les sociétés (IS) — Détermination du résultat fiscal (3 exercices)',
      'Rapports des commissaires aux comptes (3 exercices)',
      'Balances générales (5 exercices)',
      'Crédits d\'impôt (CIR, CII) — Déclarations, rescrits et dossiers supports',
      'Contrats intragroupe — Conventions réglementées et prix de transfert',
      'Restructurations — Opérations exceptionnelles (5 ans)',
      'TVA — Réconciliation, coefficient de déduction et piste d\'audit fiable',
      'Taxe sur les salaires — Déclarations et coefficient',
      'Formalités fiscales — DAS2, IFU, 2777, FEC',
      'Contrôles fiscaux et contentieux (5 ans)',
      'Attestation de régularité fiscale',
      'Synthèse des risques et recommandations',
    ],
    estimatedDays: 12,
  },
  {
    id: 'scope-2',
    domain: 'Social',
    missionType: 'DD Sociale Standard',
    title: 'Due Diligence Sociale — Périmètre Standard',
    sections: [
      'Effectifs et organisation — Organigramme et masse salariale',
      'Contrats de travail — Revue des contrats clés et clauses sensibles',
      'Rémunération et avantages — Politique salariale, intéressement, participation',
      'Relations collectives — Accords d\'entreprise, CSE, conventions collectives',
      'Contentieux social — Litiges prud\'homaux et contrôles URSSAF',
      'Restructuration — Impact social de l\'opération envisagée',
      'Synthèse des risques et recommandations',
    ],
    estimatedDays: 10,
  },
  {
    id: 'scope-3',
    domain: 'Corporate',
    missionType: 'DD Corporate Standard',
    title: 'Due Diligence Corporate — Périmètre Standard',
    sections: [
      'Structure juridique — Organigramme, statuts, K-bis',
      'Gouvernance — Vie sociale, PV AG et Conseil',
      'Actionnariat — Cap table, pactes, management packages',
      'Contrats significatifs — Baux, assurances, conventions réglementées',
      'Contentieux — Litiges en cours et risques latents',
      'Synthèse des risques et recommandations',
    ],
    estimatedDays: 8,
  },
  {
    id: 'scope-4',
    domain: 'IP/IT',
    missionType: 'DD IP/IT Standard',
    title: 'Due Diligence IP/IT — Périmètre Standard',
    sections: [
      'Propriété intellectuelle — Marques, brevets, dessins et modèles',
      'Noms de domaine et actifs numériques',
      'Cessions de droits — Salariés et tiers',
      'Licences logicielles et open source',
      'RGPD — Conformité et registre des traitements',
      'Synthèse des risques et recommandations',
    ],
    estimatedDays: 6,
  },
];
