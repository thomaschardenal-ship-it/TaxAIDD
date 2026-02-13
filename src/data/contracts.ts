import { SubcontractingContract } from '@/types';

export const WEDD_COMPANY = {
  name: 'WeDD Advisory SAS',
  siren: '800 100 200',
  address: '8 Rue de Berri, 75008 Paris',
  representedBy: 'Marc Dubois, Associé',
};

export const contractArticles = [
  { id: 'art-1', title: 'Objet du contrat', content: 'Le présent contrat a pour objet de définir les conditions dans lesquelles le Sous-Traitant intervient pour le compte de WeDD Advisory dans le cadre de la mission de due diligence désignée ci-dessus.' },
  { id: 'art-2', title: "Périmètre d'intervention", content: '' },
  { id: 'art-3', title: 'Durée et calendrier', content: '' },
  { id: 'art-4', title: 'Rémunération', content: '' },
  { id: 'art-5', title: 'Confidentialité', content: "Le Sous-Traitant s'engage à respecter une stricte confidentialité sur l'ensemble des informations portées à sa connaissance dans le cadre de la mission. Cette obligation de confidentialité subsiste après la fin du contrat pour la durée prévue ci-dessous." },
  { id: 'art-6', title: 'Propriété intellectuelle', content: "Les travaux réalisés dans le cadre de la mission sont la propriété exclusive de WeDD Advisory. Le Sous-Traitant cède l'intégralité des droits de propriété intellectuelle sur les livrables produits." },
  { id: 'art-7', title: 'Résiliation', content: "Le présent contrat peut être résilié par l'une ou l'autre des parties moyennant un préavis de 15 jours ouvrés. En cas de manquement grave, la résiliation peut être prononcée sans préavis." },
  { id: 'art-8', title: 'Juridiction compétente', content: 'Tout différend relatif au présent contrat sera soumis aux tribunaux compétents de Paris.' },
];

export const contracts: SubcontractingContract[] = [
  {
    id: 'contract-1',
    opportunityId: 'opp-5',
    opportunityName: 'Acquisition BioPharm Labs',
    specialistId: 'user-4',
    specialistName: 'Claire Martin',
    domain: 'Social',
    status: 'valide',
    createdAt: '2025-01-15',
    parties: {
      wedd: WEDD_COMPANY,
      specialist: {
        name: 'Claire Martin',
        title: 'Senior — Spécialiste Social',
        email: 'c.martin@wedd.fr',
        specialty: 'Social',
      },
    },
    scope: [
      'Effectifs et organisation — Organigramme et masse salariale',
      'Contrats de travail — Revue des contrats clés et clauses sensibles',
      'Rémunération et avantages — Politique salariale, intéressement, participation',
      'Relations collectives — Accords d\'entreprise, CSE, conventions collectives',
      'Contentieux social — Litiges prud\'homaux et contrôles URSSAF',
      'Restructuration — Impact social de l\'opération envisagée',
      'Synthèse des risques et recommandations',
    ],
    timeline: { startDate: '2025-01-20', endDate: '2025-02-20', estimatedDays: 10 },
    budget: { dailyRate: 1000, totalDays: 10, totalAmount: 10000 },
    confidentiality: { duration: '24 mois', penaltyClause: true },
  },
  {
    id: 'contract-2',
    opportunityId: 'opp-5',
    opportunityName: 'Acquisition BioPharm Labs',
    specialistId: 'user-5',
    specialistName: 'Pierre Durand',
    domain: 'Corporate',
    status: 'signe',
    createdAt: '2025-01-15',
    parties: {
      wedd: WEDD_COMPANY,
      specialist: {
        name: 'Pierre Durand',
        title: 'Senior — Spécialiste Corporate',
        email: 'p.durand@wedd.fr',
        specialty: 'Corporate',
      },
    },
    scope: [
      'Structure juridique — Organigramme, statuts, K-bis',
      'Gouvernance — Vie sociale, PV AG et Conseil',
      'Actionnariat — Cap table, pactes, management packages',
      'Contrats significatifs — Baux, assurances, conventions réglementées',
      'Contentieux — Litiges en cours et risques latents',
      'Synthèse des risques et recommandations',
    ],
    timeline: { startDate: '2025-01-20', endDate: '2025-02-15', estimatedDays: 8 },
    budget: { dailyRate: 1000, totalDays: 8, totalAmount: 8000 },
    confidentiality: { duration: '24 mois', penaltyClause: true },
  },
];
