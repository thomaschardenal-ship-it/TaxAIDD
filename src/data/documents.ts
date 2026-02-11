import { DocumentItem, DomainType } from '@/types';

// Fonction utilitaire pour créer des highlights mockés
const createHighlights = (docId: string, elementId: string, elementName: string, domain: DomainType) => {
  const domainColors: Record<DomainType, string> = {
    'TAX': '#6B00E0',
    'Social': '#00D4AA',
    'Corporate': '#0033A0',
    'IP/IT': '#E91E8C',
  };

  return [
    {
      id: `hl-${docId}-1`,
      page: 1,
      x: 10,
      y: 20,
      width: 80,
      height: 15,
      color: domainColors[domain],
      linkedElementId: elementId,
      linkedElementName: elementName,
    },
    {
      id: `hl-${docId}-2`,
      page: 1,
      x: 10,
      y: 45,
      width: 60,
      height: 10,
      color: domainColors[domain],
      linkedElementId: elementId,
      linkedElementName: elementName,
    },
  ];
};

export const projectDocuments: Record<string, DocumentItem[]> = {
  'project-1': [
    {
      id: 'cat-corp',
      code: '01',
      name: 'CORPORATE (JURIDIQUE)',
      status: 'received',
      domain: 'Corporate',
      children: [
        {
          id: 'cat-corp-1',
          code: '01.1',
          name: 'Constitution & Kbis',
          status: 'received',
          domain: 'Corporate',
          children: [
            {
              id: 'doc-corp-1-1',
              code: '01.1.1',
              name: 'Statuts à jour (signés)',
              status: 'received',
              domain: 'Corporate',
              pages: 24,
              highlights: createHighlights('doc-corp-1-1', 'report-corp-structure', 'Legal Structure', 'Corporate'),
              tags: [{ type: 'document_type', value: 'Statuts' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'domain', value: 'Corporate' }],
            },
            {
              id: 'doc-corp-1-2',
              code: '01.1.2',
              name: 'Kbis (< 3 mois)',
              status: 'received',
              domain: 'Corporate',
              pages: 2,
              highlights: createHighlights('doc-corp-1-2', 'report-corp-structure', 'Legal Structure', 'Corporate'),
              tags: [{ type: 'document_type', value: 'K-bis' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2024' }],
            },
            {
              id: 'doc-corp-1-3',
              code: '01.1.3',
              name: 'Organigramme Juridique',
              status: 'pending',
              domain: 'Corporate',
              pages: 1,
              tags: [{ type: 'document_type', value: 'Organigramme' }, { type: 'entity', value: 'TechVision Holding' }, { type: 'domain', value: 'Corporate' }],
            },
          ],
        },
        {
          id: 'cat-corp-2',
          code: '01.2',
          name: 'Actionnariat',
          status: 'received',
          domain: 'Corporate',
          children: [
            {
              id: 'doc-corp-2-1',
              code: '01.2.1',
              name: 'Cap Table',
              status: 'received',
              domain: 'Corporate',
              pages: 3,
              highlights: createHighlights('doc-corp-2-1', 'report-corp-governance', 'Governance', 'Corporate'),
              tags: [{ type: 'document_type', value: 'Cap Table' }, { type: 'entity', value: 'TechVision Holding' }],
            },
            {
              id: 'doc-corp-2-2',
              code: '01.2.2',
              name: 'Registres mouvements titres',
              status: 'missing',
              domain: 'Corporate',
            },
            {
              id: 'doc-corp-2-3',
              code: '01.2.3',
              name: 'Pacte actionnaires',
              status: 'received',
              domain: 'Corporate',
              pages: 18,
              highlights: createHighlights('doc-corp-2-3', 'report-corp-governance', 'Governance', 'Corporate'),
              tags: [{ type: 'document_type', value: 'Pacte' }, { type: 'entity', value: 'TechVision Holding' }],
            },
            {
              id: 'doc-corp-2-4',
              code: '01.2.4',
              name: 'Management Packages',
              status: 'partiel',
              domain: 'Corporate',
              missingElements: ['Package CEO manquant', 'Grille de vesting non fournie'],
              tags: [{ type: 'document_type', value: 'Management Package' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'domain', value: 'Corporate' }],
            },
          ],
        },
        {
          id: 'cat-corp-3',
          code: '01.3',
          name: 'Vie Sociale',
          status: 'received',
          domain: 'Corporate',
          children: [
            {
              id: 'cat-corp-3-1',
              code: '01.3.1',
              name: 'FY N-3',
              status: 'received',
              domain: 'Corporate',
              children: [
                { id: 'doc-corp-3-1-1', code: '', name: 'PV AG N-3', status: 'received', domain: 'Corporate', pages: 8, tags: [{ type: 'document_type', value: 'PV AG' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022' }] },
                { id: 'doc-corp-3-1-2', code: '', name: 'PV Conseil N-3', status: 'received', domain: 'Corporate', pages: 12, tags: [{ type: 'document_type', value: 'PV Conseil' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022' }] },
              ],
            },
            {
              id: 'cat-corp-3-2',
              code: '01.3.2',
              name: 'FY N-2',
              status: 'pending',
              domain: 'Corporate',
              children: [
                { id: 'doc-corp-3-2-1', code: '', name: 'PV AG N-2', status: 'received', domain: 'Corporate', pages: 10 },
                { id: 'doc-corp-3-2-2', code: '', name: 'PV Conseil N-2', status: 'missing', domain: 'Corporate' },
              ],
            },
            {
              id: 'cat-corp-3-3',
              code: '01.3.3',
              name: 'FY N-1',
              status: 'received',
              domain: 'Corporate',
              children: [
                { id: 'doc-corp-3-3-1', code: '', name: 'PV AG N-1', status: 'received', domain: 'Corporate', pages: 9 },
                { id: 'doc-corp-3-3-2', code: '', name: 'PV Conseil N-1', status: 'received', domain: 'Corporate', pages: 14 },
              ],
            },
            {
              id: 'cat-corp-3-4',
              code: '01.3.4',
              name: 'YTD',
              status: 'pending',
              domain: 'Corporate',
              children: [
                { id: 'doc-corp-3-4-1', code: '', name: 'PV AG 2025', status: 'pending', domain: 'Corporate' },
              ],
            },
          ],
        },
        {
          id: 'cat-corp-4',
          code: '01.4',
          name: 'Contrats & Engagements',
          status: 'received',
          domain: 'Corporate',
          children: [
            { id: 'doc-corp-4-1', code: '01.4.1', name: 'Conventions Réglementées', status: 'received', domain: 'Corporate', pages: 6, tags: [{ type: 'document_type', value: 'Convention' }, { type: 'entity', value: 'TechVision SAS' }] },
            { id: 'doc-corp-4-2', code: '01.4.2', name: 'Baux Commerciaux', status: 'received', domain: 'Corporate', pages: 22, tags: [{ type: 'document_type', value: 'Bail' }, { type: 'entity', value: 'TechVision SAS' }] },
            { id: 'doc-corp-4-3', code: '01.4.3', name: 'Assurances', status: 'received', domain: 'Corporate', pages: 15, tags: [{ type: 'document_type', value: 'Assurance' }, { type: 'entity', value: 'TechVision SAS' }] },
          ],
        },
      ],
    },
    {
      id: 'cat-tax',
      code: '02',
      name: 'TAX (FISCALITÉ)',
      status: 'received',
      domain: 'TAX',
      children: [
        {
          id: 'cat-tax-1',
          code: '02.1',
          name: 'CIT (IS)',
          status: 'received',
          domain: 'TAX',
          children: [
            {
              id: 'cat-tax-1-1',
              code: '02.1.1',
              name: 'FY N-3',
              status: 'received',
              domain: 'TAX',
              children: [
                {
                  id: 'doc-tax-1-1-1',
                  code: '',
                  name: 'Liasse 2050-2059 N-3',
                  status: 'received',
                  domain: 'TAX',
                  pages: 32,
                  highlights: createHighlights('doc-tax-1-1-1', 'report-tax-determination', 'Tableau de Détermination du Résultat Fiscal', 'TAX'),
                  tags: [{ type: 'document_type', value: 'Liasse fiscale' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022' }],
                },
              ],
            },
            {
              id: 'cat-tax-1-2',
              code: '02.1.2',
              name: 'FY N-2',
              status: 'received',
              domain: 'TAX',
              children: [
                {
                  id: 'doc-tax-1-2-1',
                  code: '',
                  name: 'Liasse 2050-2059 N-2',
                  status: 'received',
                  domain: 'TAX',
                  pages: 34,
                  highlights: createHighlights('doc-tax-1-2-1', 'report-tax-determination', 'Tableau de Détermination du Résultat Fiscal', 'TAX'),
                  tags: [{ type: 'document_type', value: 'Liasse fiscale' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2023' }],
                },
              ],
            },
            {
              id: 'cat-tax-1-3',
              code: '02.1.3',
              name: 'FY N-1',
              status: 'received',
              domain: 'TAX',
              children: [
                {
                  id: 'doc-tax-1-3-1',
                  code: '',
                  name: 'Liasse 2050-2059 N-1',
                  status: 'received',
                  domain: 'TAX',
                  pages: 35,
                  highlights: createHighlights('doc-tax-1-3-1', 'report-tax-determination', 'Tableau de Détermination du Résultat Fiscal', 'TAX'),
                  tags: [{ type: 'document_type', value: 'Liasse fiscale' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2024' }],
                },
              ],
            },
            { id: 'doc-tax-1-4', code: '02.1.4', name: 'Relevés solde IS (3 ans)', status: 'received', domain: 'TAX', pages: 6, tags: [{ type: 'document_type', value: 'Relevé IS' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022-2024' }] },
            { id: 'doc-tax-1-5', code: '02.1.5', name: 'Suivi déficits reportables', status: 'pending', domain: 'TAX', tags: [{ type: 'document_type', value: 'Suivi déficits' }, { type: 'entity', value: 'TechVision SAS' }] },
          ],
        },
        {
          id: 'cat-tax-2',
          code: '02.2',
          name: 'VAT (TVA)',
          status: 'received',
          domain: 'TAX',
          children: [
            {
              id: 'cat-tax-2-1',
              code: '02.2.1',
              name: 'FY N-3',
              status: 'received',
              domain: 'TAX',
              children: [
                { id: 'doc-tax-2-1-1', code: '', name: 'CA3 N-3 (12 mois)', status: 'received', domain: 'TAX', pages: 24, tags: [{ type: 'document_type', value: 'CA3' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022' }] },
              ],
            },
            {
              id: 'cat-tax-2-2',
              code: '02.2.2',
              name: 'FY N-2',
              status: 'received',
              domain: 'TAX',
              children: [
                { id: 'doc-tax-2-2-1', code: '', name: 'CA3 N-2 (12 mois)', status: 'received', domain: 'TAX', pages: 24, tags: [{ type: 'document_type', value: 'CA3' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2023' }] },
              ],
            },
            {
              id: 'cat-tax-2-3',
              code: '02.2.3',
              name: 'FY N-1 & YTD',
              status: 'pending',
              domain: 'TAX',
              children: [
                { id: 'doc-tax-2-3-1', code: '', name: 'CA3 N-1 (12 mois)', status: 'received', domain: 'TAX', pages: 24 },
                { id: 'doc-tax-2-3-2', code: '', name: 'CA3 YTD', status: 'partiel', domain: 'TAX', missingElements: ['Mois de novembre et décembre manquants'] },
              ],
            },
            { id: 'doc-tax-2-4', code: '02.2.4', name: 'Coefficient déduction', status: 'received', domain: 'TAX', pages: 2 },
          ],
        },
        {
          id: 'cat-tax-3',
          code: '02.3',
          name: 'Autres Taxes',
          status: 'pending',
          domain: 'TAX',
          children: [
            { id: 'doc-tax-3-1', code: '02.3.1', name: 'CET (3 ans)', status: 'received', domain: 'TAX', pages: 9 },
            { id: 'doc-tax-3-2', code: '02.3.2', name: 'Taxes salaires (3 ans)', status: 'received', domain: 'TAX', pages: 6 },
            { id: 'doc-tax-3-3', code: '02.3.3', name: 'DAS2 & IFU (3 ans)', status: 'received', domain: 'TAX', pages: 12 },
            { id: 'doc-tax-3-4', code: '02.3.4', name: 'TVS', status: 'missing', domain: 'TAX' },
          ],
        },
        {
          id: 'cat-tax-4',
          code: '02.4',
          name: 'Crédits d\'Impôts',
          status: 'pending',
          domain: 'TAX',
          children: [
            {
              id: 'doc-tax-4-1',
              code: '02.4.1',
              name: 'Déclarations 2069-A (3 ans)',
              status: 'received',
              domain: 'TAX',
              pages: 15,
              highlights: createHighlights('doc-tax-4-1', 'report-tax-credits', 'Tax Credits Analysis', 'TAX'),
              tags: [{ type: 'document_type', value: 'CIR' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022-2024' }],
            },
            { id: 'doc-tax-4-2', code: '02.4.2', name: 'Dossiers justificatifs (3 ans)', status: 'pending', domain: 'TAX' },
          ],
        },
        {
          id: 'cat-tax-5',
          code: '02.5',
          name: 'Comptabilité',
          status: 'received',
          domain: 'TAX',
          children: [
            { id: 'doc-tax-5-1', code: '02.5.1', name: 'Balances & FEC (3 ans)', status: 'received', domain: 'TAX', pages: 48, tags: [{ type: 'document_type', value: 'FEC' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022-2024' }] },
            { id: 'doc-tax-5-2', code: '02.5.2', name: 'Correspondances Administration', status: 'received', domain: 'TAX', pages: 8, tags: [{ type: 'document_type', value: 'Correspondance' }, { type: 'entity', value: 'TechVision SAS' }] },
          ],
        },
      ],
    },
    {
      id: 'cat-social',
      code: '03',
      name: 'SOCIAL (LABOR)',
      status: 'pending',
      domain: 'Social',
      children: [
        {
          id: 'cat-social-1',
          code: '03.1',
          name: 'Effectifs',
          status: 'received',
          domain: 'Social',
          children: [
            {
              id: 'doc-social-1-1',
              code: '03.1.1',
              name: 'Organigramme Fonctionnel',
              status: 'received',
              domain: 'Social',
              pages: 4,
              highlights: createHighlights('doc-social-1-1', 'report-social-workforce', 'Workforce Overview', 'Social'),
              tags: [{ type: 'document_type', value: 'Organigramme' }, { type: 'entity', value: 'TechVision SAS' }],
            },
            {
              id: 'doc-social-1-2',
              code: '03.1.2',
              name: 'Fichier personnel',
              status: 'received',
              domain: 'Social',
              pages: 12,
              highlights: createHighlights('doc-social-1-2', 'report-social-workforce', 'Workforce Overview', 'Social'),
              tags: [{ type: 'document_type', value: 'Registre personnel' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2024' }],
            },
            { id: 'doc-social-1-3', code: '03.1.3', name: 'Registre Unique', status: 'received', domain: 'Social', pages: 8, tags: [{ type: 'document_type', value: 'Registre' }, { type: 'entity', value: 'TechVision SAS' }] },
          ],
        },
        {
          id: 'cat-social-2',
          code: '03.2',
          name: 'Contrats Travail',
          status: 'pending',
          domain: 'Social',
          children: [
            { id: 'doc-social-2-1', code: '03.2.1', name: 'Modèles Types', status: 'received', domain: 'Social', pages: 15 },
            {
              id: 'doc-social-2-2',
              code: '03.2.2',
              name: 'Contrats Top Management',
              status: 'pending',
              domain: 'Social',
              highlights: createHighlights('doc-social-2-2', 'report-social-contracts', 'Contract Review', 'Social'),
            },
            { id: 'doc-social-2-3', code: '03.2.3', name: 'Travailleurs externes', status: 'partiel', domain: 'Social', missingElements: ['Contrats des 2 prestataires IT manquants'] },
          ],
        },
        {
          id: 'cat-social-3',
          code: '03.3',
          name: 'Paie',
          status: 'pending',
          domain: 'Social',
          children: [
            { id: 'doc-social-3-1', code: '03.3.1', name: 'Livres Paie (3 ans)', status: 'received', domain: 'Social', pages: 36, tags: [{ type: 'document_type', value: 'Livre de paie' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022-2024' }] },
            { id: 'doc-social-3-2', code: '03.3.2', name: 'États charges sociales (3 ans)', status: 'received', domain: 'Social', pages: 18, tags: [{ type: 'document_type', value: 'Charges sociales' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2022-2024' }] },
            { id: 'doc-social-3-3', code: '03.3.3', name: 'Contrôles URSSAF', status: 'missing', domain: 'Social' },
          ],
        },
        {
          id: 'cat-social-4',
          code: '03.4',
          name: 'Relations Collectives',
          status: 'pending',
          domain: 'Social',
          children: [
            { id: 'doc-social-4-1', code: '03.4.1', name: 'Accords entreprise', status: 'received', domain: 'Social', pages: 22 },
            { id: 'doc-social-4-2', code: '03.4.2', name: 'PV CSE (3 ans)', status: 'pending', domain: 'Social' },
          ],
        },
        {
          id: 'cat-social-5',
          code: '03.5',
          name: 'Contentieux',
          status: 'pending',
          domain: 'Social',
          children: [
            {
              id: 'doc-social-5-1',
              code: '03.5.1',
              name: 'Liste litiges',
              status: 'received',
              domain: 'Social',
              pages: 3,
              highlights: createHighlights('doc-social-5-1', 'report-social-risks', 'Social Risks', 'Social'),
              tags: [{ type: 'document_type', value: 'Contentieux' }, { type: 'entity', value: 'TechVision SAS' }],
            },
            { id: 'doc-social-5-2', code: '03.5.2', name: 'Documents afférents', status: 'missing', domain: 'Social' },
          ],
        },
      ],
    },
    {
      id: 'cat-ipit',
      code: '04',
      name: 'IP - IT - DATA',
      status: 'pending',
      domain: 'IP/IT',
      children: [
        {
          id: 'cat-ipit-1',
          code: '04.1',
          name: 'Propriété Intellectuelle',
          status: 'pending',
          domain: 'IP/IT',
          children: [
            {
              id: 'doc-ipit-1-1',
              code: '04.1.1',
              name: 'Marques INPI/EUIPO',
              status: 'received',
              domain: 'IP/IT',
              pages: 8,
              highlights: createHighlights('doc-ipit-1-1', 'report-ipit-trademarks', 'Trademark Portfolio', 'IP/IT'),
              tags: [{ type: 'document_type', value: 'Marques' }, { type: 'entity', value: 'TechVision Holding' }],
            },
            { id: 'doc-ipit-1-2', code: '04.1.2', name: 'Noms de domaine', status: 'received', domain: 'IP/IT', pages: 2, tags: [{ type: 'document_type', value: 'Noms de domaine' }, { type: 'entity', value: 'TechVision SAS' }] },
            { id: 'doc-ipit-1-3', code: '04.1.3', name: 'Brevets & Dessins', status: 'na', domain: 'IP/IT' },
          ],
        },
        {
          id: 'cat-ipit-2',
          code: '04.2',
          name: 'Cessions Droits',
          status: 'pending',
          domain: 'IP/IT',
          children: [
            { id: 'doc-ipit-2-1', code: '04.2.1', name: 'Clauses cession IP Salariés', status: 'received', domain: 'IP/IT', pages: 6, tags: [{ type: 'document_type', value: 'Cession IP' }, { type: 'entity', value: 'TechVision SAS' }] },
            { id: 'doc-ipit-2-2', code: '04.2.2', name: 'Contrats cession Tiers', status: 'pending', domain: 'IP/IT' },
          ],
        },
        {
          id: 'cat-ipit-3',
          code: '04.3',
          name: 'IT',
          status: 'received',
          domain: 'IP/IT',
          children: [
            { id: 'doc-ipit-3-1', code: '04.3.1', name: 'Licences logicielles', status: 'received', domain: 'IP/IT', pages: 12, tags: [{ type: 'document_type', value: 'Licences' }, { type: 'entity', value: 'TechVision SAS' }] },
            { id: 'doc-ipit-3-2', code: '04.3.2', name: 'Liste Open Source', status: 'received', domain: 'IP/IT', pages: 4, tags: [{ type: 'document_type', value: 'Open Source' }, { type: 'entity', value: 'TechVision SAS' }] },
          ],
        },
        {
          id: 'cat-ipit-4',
          code: '04.4',
          name: 'RGPD',
          status: 'pending',
          domain: 'IP/IT',
          children: [
            {
              id: 'doc-ipit-4-1',
              code: '04.4.1',
              name: 'Registre traitements',
              status: 'received',
              domain: 'IP/IT',
              pages: 10,
              highlights: createHighlights('doc-ipit-4-1', 'report-ipit-gdpr', 'GDPR Compliance', 'IP/IT'),
              tags: [{ type: 'document_type', value: 'Registre RGPD' }, { type: 'entity', value: 'TechVision SAS' }, { type: 'period', value: '2024' }],
            },
            {
              id: 'doc-ipit-4-2',
              code: '04.4.2',
              name: 'Politique confidentialité',
              status: 'received',
              domain: 'IP/IT',
              pages: 8,
              highlights: createHighlights('doc-ipit-4-2', 'report-ipit-gdpr', 'GDPR Compliance', 'IP/IT'),
              tags: [{ type: 'document_type', value: 'Politique RGPD' }, { type: 'entity', value: 'TechVision SAS' }],
            },
            { id: 'doc-ipit-4-3', code: '04.4.3', name: 'Contrats DPA', status: 'pending', domain: 'IP/IT' },
          ],
        },
      ],
    },
  ],
};

// Helper functions
export const getDocumentsForProject = (projectId: string): DocumentItem[] => {
  return projectDocuments[projectId] || [];
};

export const flattenDocuments = (docs: DocumentItem[]): DocumentItem[] => {
  const result: DocumentItem[] = [];
  const flatten = (items: DocumentItem[]) => {
    items.forEach(item => {
      result.push(item);
      if (item.children) {
        flatten(item.children);
      }
    });
  };
  flatten(docs);
  return result;
};

export const getDocumentById = (projectId: string, docId: string): DocumentItem | undefined => {
  const allDocs = flattenDocuments(getDocumentsForProject(projectId));
  return allDocs.find(d => d.id === docId);
};

export const countDocumentsByStatus = (docs: DocumentItem[]): { received: number; pending: number; missing: number; partiel: number; na: number; total: number } => {
  const flattened = flattenDocuments(docs).filter(d => !d.children); // Only count leaf nodes
  return {
    received: flattened.filter(d => d.status === 'received').length,
    pending: flattened.filter(d => d.status === 'pending').length,
    missing: flattened.filter(d => d.status === 'missing').length,
    partiel: flattened.filter(d => d.status === 'partiel').length,
    na: flattened.filter(d => d.status === 'na').length,
    total: flattened.length,
  };
};

export const countDocumentsByDomain = (docs: DocumentItem[], domain: DomainType): { received: number; total: number } => {
  const flattened = flattenDocuments(docs).filter(d => !d.children && d.domain === domain);
  return {
    received: flattened.filter(d => d.status === 'received').length,
    total: flattened.length,
  };
};
