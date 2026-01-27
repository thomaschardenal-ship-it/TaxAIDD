# TaxAIDD Platform

Plateforme de gestion de dossiers de Due Diligence fiscale, sociale, corporate et IP/IT.

## Technologies

- **Next.js 14+** avec App Router
- **TypeScript**
- **Tailwind CSS** avec configuration custom (couleurs OMNI)
- **Lucide React** pour les icônes
- **React Context** pour la gestion d'état global

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Lancer en production
npm start
```

## Structure du projet

```
src/
├── app/                          # App Router Next.js 14
│   ├── layout.tsx               # Layout global avec sidebar
│   ├── page.tsx                 # Page 1 - Dashboard
│   ├── globals.css              # Styles globaux + Tailwind
│   └── project/
│       └── [id]/
│           ├── page.tsx         # Page 2 - Vue projet
│           └── folder/
│               └── page.tsx     # Page 3 - Vue dossier (3 colonnes)
├── components/
│   ├── layout/                  # Sidebar, Header, Breadcrumb
│   ├── ui/                      # Composants réutilisables
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx
│   │   └── TreeView.tsx
│   ├── dashboard/               # Composants Page 1
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectTable.tsx
│   │   ├── FilterBar.tsx
│   │   └── NewProjectModal.tsx
│   ├── project/                 # Composants Page 2
│   │   ├── OrgChart.tsx
│   │   ├── CollectionProgress.tsx
│   │   ├── ActionButtons.tsx
│   │   ├── IRLModal.tsx
│   │   ├── QAModal.tsx
│   │   └── ImportModal.tsx
│   └── folder/                  # Composants Page 3
│       ├── DocumentIndex.tsx
│       ├── MockPDFViewer.tsx
│       └── ReportContent.tsx
├── context/
│   └── ProjectContext.tsx       # Context React global
├── data/                        # Mock data
│   ├── users.ts
│   ├── clients.ts
│   ├── projects.ts
│   ├── documents.ts
│   └── reportContent.ts
└── types/
    └── index.ts                 # Types TypeScript
```

## Pages

### Page 1 - Dashboard (`/`)
- Liste des projets en vue cartes ou tableau
- Filtres par client, statut, responsable, domaine
- Modale de création de nouveau projet (admin)

### Page 2 - Vue Projet (`/project/[id]`)
- Informations du projet (client, responsable, deadline, progression)
- Organigramme juridique interactif
- Avancée de la collecte par domaine
- Actions : Générer IRL, Générer Q&A, Importer documents

### Page 3 - Vue Dossier (`/project/[id]/folder`)
**3 colonnes interconnectées :**
1. **Document Index** (20%) : Arborescence navigable des documents
2. **PDF Preview** (45%) : MockPDFViewer avec highlights cliquables
3. **Report Content** (35%) : Rapport structuré par domaine

## Interactivité 3 colonnes

- **Click document (col 1)** → Affiche le PDF, montre les highlights, scroll vers éléments du rapport utilisant ce document
- **Click cellule/élément (col 3)** → Filtre les documents sources (col 1), affiche le 1er document source (col 2)
- **Click highlight (col 2)** → Scroll vers l'élément du rapport correspondant

## Couleurs TAXAIDD

| Couleur | Hex | Usage |
|---------|-----|-------|
| Yellow | #FFB800 | CTA, accents |
| Purple | #6B00E0 | TAX, liens |
| Mint | #00D4AA | Social, succès |
| Blue | #0033A0 | Corporate |
| Magenta | #E91E8C | IP/IT, urgent |

## Mock Data

- **6 utilisateurs** avec rôles différents
- **2 clients** (Groupe TechVision, Holding Innovate)
- **2 projets** complets avec organigrammes juridiques
- **Arborescence documentaire** complète (Corporate, TAX, Social, IP/IT)
- **Contenu de rapport** réaliste avec tableaux et listes

## Responsive

Optimisé pour desktop (1920px, 1440px, 1280px).

## License

Propriétaire - OMNI Advisory
