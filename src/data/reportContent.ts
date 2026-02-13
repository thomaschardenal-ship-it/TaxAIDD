import { ReportElement, IRLItem, QAItem, DocumentStatus } from '@/types';

export const reportElements: Record<string, ReportElement[]> = {
  'project-1': [
    // TAX ANALYSIS
    {
      id: 'report-tax-determination',
      type: 'table',
      title: 'Tableau de Détermination du Résultat Fiscal',
      domain: 'TAX',
      content: {
        headers: ['TechVision SAS', 'FY22', 'FY23', 'FY24'],
        rows: [
          { label: 'Turnover', values: ["€'000", "€'000", "€'000"], isEditable: false },
          { label: 'Net income', values: [245, 312, 387], isEditable: true, sourceDocId: 'doc-tax-1-1-1' },
          { label: 'Recaptures taxable inc.', values: ['-', '-', '-'], isEditable: false },
          { label: 'Tax on company car', values: [12, 15, 18], isEditable: true, sourceDocId: 'doc-tax-1-2-1' },
          { label: 'Excess amortization', values: [8, 6, 4], isEditable: true, sourceDocId: 'doc-tax-1-3-1' },
          { label: 'CIT charge', values: [58, 74, 91], isEditable: true },
          { label: 'Tax deductions', values: ['-', '-', '-'], isEditable: false },
          { label: 'Taxable income', values: [315, 407, 500], isEditable: true },
        ],
      },
      sourceDocumentIds: ['doc-tax-1-1-1', 'doc-tax-1-2-1', 'doc-tax-1-3-1'],
    },
    {
      id: 'report-tax-positions',
      type: 'list',
      title: 'Tax Positions & Risks',
      domain: 'TAX',
      content: [
        {
          id: 'tax-risk-1',
          text: 'Transfer pricing documentation incomplete for intercompany services (estimated exposure: €45k)',
          risk: 'medium',
          attention: 'modere',
          sourceDocId: 'doc-tax-5-2',
        },
        {
          id: 'tax-risk-2',
          text: 'CIR claims for FY22-23 not yet audited by tax authorities - potential adjustment risk',
          risk: 'low',
          attention: 'information',
          sourceDocId: 'doc-tax-4-1',
        },
        {
          id: 'tax-risk-3',
          text: 'TVS declarations missing - estimated liability €8k + penalties',
          risk: 'high',
          attention: 'critique',
          sourceDocId: 'doc-tax-3-4',
        },
      ],
      sourceDocumentIds: ['doc-tax-5-2', 'doc-tax-4-1', 'doc-tax-3-4'],
    },
    {
      id: 'report-tax-credits',
      type: 'table',
      title: 'Tax Credits Analysis (CIR/CII)',
      domain: 'TAX',
      content: {
        headers: ['Credit Type', 'FY22', 'FY23', 'FY24'],
        rows: [
          { label: 'CIR (Crédit Impôt Recherche)', values: ['€125k', '€148k', '€172k'], isEditable: true, sourceDocId: 'doc-tax-4-1' },
          { label: 'CII (Crédit Impôt Innovation)', values: ['€0', '€22k', '€35k'], isEditable: true, sourceDocId: 'doc-tax-4-1' },
          { label: 'JEI Status', values: ['Yes', 'Yes', 'No'], isEditable: false },
          { label: 'Total Credits', values: ['€125k', '€170k', '€207k'], isEditable: false },
        ],
      },
      sourceDocumentIds: ['doc-tax-4-1', 'doc-tax-4-2'],
    },
    // SOCIAL ANALYSIS
    {
      id: 'report-social-workforce',
      type: 'table',
      title: 'Workforce Overview',
      domain: 'Social',
      content: {
        headers: ['Category', 'Dec 2022', 'Dec 2023', 'Dec 2024'],
        rows: [
          { label: 'Total Headcount', values: [42, 58, 73], isEditable: true, sourceDocId: 'doc-social-1-2' },
          { label: 'CDI', values: [38, 52, 67], isEditable: true, sourceDocId: 'doc-social-1-2' },
          { label: 'CDD', values: [4, 6, 6], isEditable: true, sourceDocId: 'doc-social-1-2' },
          { label: 'Managers', values: [8, 12, 15], isEditable: true, sourceDocId: 'doc-social-1-1' },
          { label: 'Average Age', values: [32, 33, 34], isEditable: false },
          { label: 'Turnover Rate', values: ['12%', '15%', '18%'], isEditable: true },
        ],
      },
      sourceDocumentIds: ['doc-social-1-1', 'doc-social-1-2', 'doc-social-1-3'],
    },
    {
      id: 'report-social-contracts',
      type: 'list',
      title: 'Contract Review',
      domain: 'Social',
      content: [
        {
          id: 'social-contract-1',
          text: 'Standard CDI templates compliant with current labor regulations',
          risk: 'low',
          attention: 'information',
          sourceDocId: 'doc-social-2-1',
        },
        {
          id: 'social-contract-2',
          text: 'Top management contracts include non-compete clauses (2 years) - validity to be confirmed',
          risk: 'medium',
          attention: 'modere',
          sourceDocId: 'doc-social-2-2',
        },
        {
          id: 'social-contract-3',
          text: 'External contractors documentation incomplete - 3 consultants without proper contracts',
          risk: 'high',
          attention: 'critique',
          sourceDocId: 'doc-social-2-3',
        },
      ],
      sourceDocumentIds: ['doc-social-2-1', 'doc-social-2-2', 'doc-social-2-3'],
    },
    {
      id: 'report-social-risks',
      type: 'list',
      title: 'Social Risks',
      domain: 'Social',
      content: [
        {
          id: 'social-risk-1',
          text: 'Pending litigation: Former employee claiming wrongful termination (€35k exposure)',
          risk: 'medium',
          attention: 'modere',
          sourceDocId: 'doc-social-5-1',
        },
        {
          id: 'social-risk-2',
          text: 'No URSSAF audit documentation found - last audit status unknown',
          risk: 'high',
          attention: 'critique',
          sourceDocId: 'doc-social-3-3',
        },
        {
          id: 'social-risk-3',
          text: 'CSE elections overdue - compliance risk',
          risk: 'low',
          attention: 'information',
          sourceDocId: 'doc-social-4-2',
        },
      ],
      sourceDocumentIds: ['doc-social-5-1', 'doc-social-3-3', 'doc-social-4-2'],
    },
    // CORPORATE ANALYSIS
    {
      id: 'report-corp-structure',
      type: 'text',
      title: 'Legal Structure',
      domain: 'Corporate',
      content: `TechVision group comprises 4 legal entities:

**TechVision Holding SAS** (Head company)
- SIREN: 123 456 789
- Share capital: €500,000
- President: Jean-Marc Dupont

**TechVision SAS** (100% subsidiary)
- SIREN: 234 567 890
- Main operating entity
- 73 employees

**TechVision Services SARL** (75% subsidiary)
- SIREN: 345 678 901
- B2B services division
- Minority shareholder: Management team (25%)

**InnoLab SAS** (51% subsidiary)
- SIREN: 456 789 012
- R&D entity
- Joint venture with University partner (49%)`,
      sourceDocumentIds: ['doc-corp-1-1', 'doc-corp-1-2'],
    },
    {
      id: 'report-corp-governance',
      type: 'list',
      title: 'Governance',
      domain: 'Corporate',
      content: [
        {
          id: 'corp-gov-1',
          text: 'Shareholders agreement includes drag-along and tag-along provisions',
          risk: 'low',
          attention: 'information',
          sourceDocId: 'doc-corp-2-3',
        },
        {
          id: 'corp-gov-2',
          text: 'Board composition: 5 members (2 executives, 2 investors, 1 independent)',
          risk: 'low',
          attention: 'information',
          sourceDocId: 'doc-corp-2-1',
        },
        {
          id: 'corp-gov-3',
          text: 'Share register movements not fully documented for 2023',
          risk: 'medium',
          attention: 'modere',
          sourceDocId: 'doc-corp-2-2',
        },
      ],
      sourceDocumentIds: ['doc-corp-2-1', 'doc-corp-2-3'],
    },
    // IP/IT ANALYSIS
    {
      id: 'report-ipit-trademarks',
      type: 'table',
      title: 'Trademark Portfolio',
      domain: 'IP/IT',
      content: {
        headers: ['Trademark', 'Registration', 'Territory', 'Expiry'],
        rows: [
          { label: 'TECHVISION', values: ['FR3456789', 'France', '2028-06-15'], isEditable: false, sourceDocId: 'doc-ipit-1-1' },
          { label: 'TECHVISION (fig)', values: ['EU018234567', 'EU', '2029-03-22'], isEditable: false, sourceDocId: 'doc-ipit-1-1' },
          { label: 'INNOLAB', values: ['FR3567890', 'France', '2027-11-08'], isEditable: false, sourceDocId: 'doc-ipit-1-1' },
          { label: 'techvision.fr', values: ['Domain', 'France', '2025-12-01'], isEditable: false, sourceDocId: 'doc-ipit-1-2' },
        ],
      },
      sourceDocumentIds: ['doc-ipit-1-1', 'doc-ipit-1-2'],
    },
    {
      id: 'report-ipit-gdpr',
      type: 'list',
      title: 'GDPR Compliance',
      domain: 'IP/IT',
      content: [
        {
          id: 'gdpr-1',
          text: 'Data processing register maintained and up to date (last update: Nov 2024)',
          risk: 'low',
          attention: 'information',
          sourceDocId: 'doc-ipit-4-1',
        },
        {
          id: 'gdpr-2',
          text: 'Privacy policy compliant with GDPR requirements',
          risk: 'low',
          attention: 'information',
          sourceDocId: 'doc-ipit-4-2',
        },
        {
          id: 'gdpr-3',
          text: 'DPA with cloud providers (AWS, Google) pending signature',
          risk: 'medium',
          attention: 'modere',
          sourceDocId: 'doc-ipit-4-3',
        },
        {
          id: 'gdpr-4',
          text: 'No formal data breach procedure documented',
          risk: 'high',
          attention: 'critique',
        },
      ],
      sourceDocumentIds: ['doc-ipit-4-1', 'doc-ipit-4-2', 'doc-ipit-4-3'],
    },
  ],
};

export const irlItems: Record<string, IRLItem[]> = {
  'project-1': [
    // ── TAX — Impôt sur les sociétés ──────────────────────────────────────
    { category: 'Impôt sur les sociétés', document: 'Liasses fiscales individuelles au titre des 3 derniers exercices', status: 'pending' },
    { category: 'Impôt sur les sociétés', document: 'Liasses fiscales groupe au titre des 3 derniers exercices', status: 'missing' },
    { category: 'Impôt sur les sociétés', document: 'Formulaires 2571/2572 et 2573 (si applicable)', status: 'pending' },
    { category: 'Impôt sur les sociétés', document: "Tout document relatif à la mise en place d'un groupe d'intégration fiscale, le cas échéant", status: 'missing' },
    // ── TAX — Rapports des commissaires aux comptes ──────────────────────
    { category: 'Rapports des commissaires aux comptes', document: 'Rapports des commissaires aux comptes au titre des 3 derniers exercices', status: 'pending' },
    // ── TAX — Balances Générales ─────────────────────────────────────────
    { category: 'Balances Générales', document: 'Balances générales au titre des 5 derniers exercices', status: 'partiel' as DocumentStatus },
    // ── TAX — CIR & CII ─────────────────────────────────────────────────
    { category: 'CIR & CII', document: "Déclarations de crédit d'impôts (CIR, CII) au titre des 3 derniers exercices", status: 'pending' },
    { category: 'CIR & CII', document: 'Rescrits fiscaux obtenus en matière de CIR/CII', status: 'missing' },
    { category: 'CIR & CII', document: 'Dossiers supports établis en matière de CIR/CII au titre des 3 dernières années', status: 'pending' },
    // ── TAX — Contrats intragroupe ───────────────────────────────────────
    { category: 'Contrats intragroupe', document: "Tout document relatif aux conventions conclues directement ou indirectement entre la société et les dirigeants ou le cas échéant entre la société et les autres sociétés du groupe — description et justification de la méthode de rémunération", status: 'pending' },
    // ── TAX — Restructurations ───────────────────────────────────────────
    { category: 'Restructurations', document: "Tout document relatif à des opérations de réorganisation / opérations exceptionnelles (acquisitions, cessions, apports, fusions, abandons de créances, etc) réalisées au titre des 5 dernières années", status: 'missing' },
    // ── TAX — TVA ────────────────────────────────────────────────────────
    { category: 'TVA', document: 'Déclarations de TVA au titre des 3 derniers exercices', status: 'pending' },
    { category: 'TVA', document: 'Fichier Cadre CA / CA-3 au titre des 3 derniers exercices', status: 'partiel' as DocumentStatus },
    { category: 'TVA', document: 'Fichier de calcul du coefficient de déduction de la TVA au titre des 3 derniers exercices', status: 'missing' },
    { category: 'TVA', document: "Documentation d'une piste d'audit fiable", status: 'pending' },
    { category: 'TVA', document: '3 exemples de factures selon les parties (France, UE, hors UE le cas échéant)', status: 'pending' },
    // ── TAX — Taxe sur les salaires ──────────────────────────────────────
    { category: 'Taxe sur les salaires', document: 'Déclarations annuelles de liquidation de la taxe sur les salaires au titre des 3 derniers exercices', status: 'pending' },
    { category: 'Taxe sur les salaires', document: 'Fichier de calcul du coefficient de taxe sur les salaires (si applicable)', status: 'missing' },
    // ── TAX — Formalités ─────────────────────────────────────────────────
    { category: 'Formalités', document: 'Déclarations DAS2 au titre des 4 dernières années', status: 'pending' },
    { category: 'Formalités', document: 'Formulaires IFU au titre des 4 dernières années', status: 'pending' },
    { category: 'Formalités', document: 'Formulaires 2777 au titre des 4 dernières années', status: 'missing' },
    { category: 'Formalités', document: "Certificat de conformité Fichier d'écritures comptables délivré par l'éditeur du logiciel comptable", status: 'pending' },
    // ── TAX — Contrôles fiscaux ──────────────────────────────────────────
    { category: 'Contrôles fiscaux', document: "Tout document relatif à un contrôle fiscal ou contentieux fiscal au cours des 5 dernières années", status: 'missing' },
    // ── TAX — Toutes impositions ─────────────────────────────────────────
    { category: 'Toutes impositions', document: 'Attestation de régularité fiscale (à télécharger sur impôt.gouv.fr)', status: 'pending' },
    // ── Corporate ────────────────────────────────────────────────────────
    { category: 'Corporate', document: 'Organigramme Juridique', status: 'pending' },
    { category: 'Corporate', document: 'Registres mouvements titres', status: 'missing' },
    { category: 'Corporate', document: 'Management Packages', status: 'partiel' as DocumentStatus },
    { category: 'Corporate', document: 'PV Conseil N-2', status: 'missing' },
    { category: 'Corporate', document: 'PV AG 2025', status: 'pending' },
    // ── Social ───────────────────────────────────────────────────────────
    { category: 'Social', document: 'Contrats Top Management', status: 'pending' },
    { category: 'Social', document: 'Travailleurs externes', status: 'partiel' as DocumentStatus },
    { category: 'Social', document: 'Contrôles URSSAF', status: 'missing' },
    { category: 'Social', document: 'PV CSE (3 ans)', status: 'pending' },
    { category: 'Social', document: 'Documents afférents litiges', status: 'missing' },
    // ── IP/IT ────────────────────────────────────────────────────────────
    { category: 'IP/IT', document: 'Brevets & Dessins', status: 'na' as DocumentStatus },
    { category: 'IP/IT', document: 'Contrats cession Tiers', status: 'pending' },
    { category: 'IP/IT', document: 'Contrats DPA', status: 'pending' },
  ],
};

export const qaItems: Record<string, QAItem[]> = {
  'project-1': [
    {
      question: 'Confirmer le périmètre exact de consolidation fiscale',
      source: 'Direction Fiscale',
      partialAnswer: 'TechVision Holding + TechVision SAS uniquement',
    },
    {
      question: 'Justifier les ajustements de prix de transfert sur FY23',
      source: 'Comptabilité',
    },
    {
      question: 'Fournir le détail des dépenses R&D éligibles au CIR',
      source: 'Direction R&D',
      partialAnswer: 'Budget R&D 2024: €680k dont €520k éligibles',
    },
    {
      question: 'Confirmer le statut des contentieux sociaux en cours',
      source: 'Direction RH',
      partialAnswer: '1 contentieux prudhommal en cours',
    },
    {
      question: 'Fournir les contrats des 3 consultants externes identifiés',
      source: 'Direction RH',
    },
    {
      question: 'Confirmer la date du dernier contrôle URSSAF',
      source: 'Direction RH',
    },
    {
      question: 'Détailler les accords de cession IP avec les salariés',
      source: 'Direction Juridique',
      partialAnswer: 'Clauses standard dans contrats de travail',
    },
    {
      question: 'Fournir le mapping des données personnelles traitées',
      source: 'DPO / IT',
    },
  ],
};

export const getReportElementsForProject = (projectId: string): ReportElement[] => {
  return reportElements[projectId] || [];
};

export const getIRLItemsForProject = (projectId: string): IRLItem[] => {
  return irlItems[projectId] || [];
};

export const getQAItemsForProject = (projectId: string): QAItem[] => {
  return qaItems[projectId] || [];
};
