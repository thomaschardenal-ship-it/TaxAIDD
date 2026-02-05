const PptxGenJS = require('pptxgenjs');
const path = require('path');

// Couleurs TaxAIDD
const COLORS = {
  yellow: 'FFB800',
  yellowDark: 'F5A623',
  purple: '6B00E0',
  mint: '00D4AA',
  blue: '0033A0',
  magenta: 'E91E8C',
  black: '2D2D2D',
  gray: 'F3F3F3',
  white: 'FFFFFF',
  lightPurple: 'F3E8FF',
  lightGreen: 'E8F5E9',
};

const pptx = new PptxGenJS();

// Configuration
pptx.layout = 'LAYOUT_16x9';
pptx.title = 'TaxAIDD - Synthese Coactionnaires';
pptx.author = 'TaxAIDD';
pptx.company = 'TaxAIDD';

// Master slide
pptx.defineSlideMaster({
  title: 'TAXAIDD_MASTER',
  background: { color: COLORS.white },
  objects: [
    { rect: { x: 0, y: 5.1, w: '100%', h: 0.4, fill: { color: COLORS.yellow } } },
    { text: { text: 'TaxAIDD', options: { x: 8.5, y: 0.2, w: 1.5, h: 0.4, fontSize: 14, bold: true, color: COLORS.purple } } },
  ],
});

// ============================================
// SLIDE 1: Titre
// ============================================
let slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('TaxAIDD', {
  x: 0.5, y: 1.5, w: 9, h: 1,
  fontSize: 54, bold: true, color: COLORS.purple,
});
slide.addText('Point d\'avancement', {
  x: 0.5, y: 2.5, w: 9, h: 0.6,
  fontSize: 28, color: COLORS.black,
});
slide.addText('Synthese pour les coactionnaires', {
  x: 0.5, y: 3.3, w: 9, h: 0.5,
  fontSize: 18, color: COLORS.purple,
});
slide.addText('Fevrier 2026', {
  x: 0.5, y: 4.2, w: 9, h: 0.4,
  fontSize: 14, color: '666666',
});

// ============================================
// SLIDE 2: Agenda
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Agenda', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const agendaItems = [
  { num: '01', title: 'Etat actuel', desc: 'Ce qui est construit et deploye' },
  { num: '02', title: 'Roadmap', desc: '6 phases de developpement' },
  { num: '03', title: 'Decisions', desc: 'Choix techniques a valider' },
  { num: '04', title: 'Elements a fournir', desc: 'Documents juridiques et fiscaux' },
  { num: '05', title: 'Budget', desc: 'Couts previsionnels' },
  { num: '06', title: 'Prochaines etapes', desc: 'Actions immediates' },
];

agendaItems.forEach((item, i) => {
  const y = 1.1 + i * 0.6;
  slide.addText(item.num, { x: 0.5, y, w: 0.6, h: 0.5, fontSize: 20, bold: true, color: COLORS.yellow });
  slide.addText(item.title, { x: 1.2, y, w: 2.8, h: 0.5, fontSize: 16, bold: true, color: COLORS.black });
  slide.addText(item.desc, { x: 4.2, y, w: 5, h: 0.5, fontSize: 14, color: '666666' });
});

// ============================================
// SLIDE 3: Etat actuel
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Etat actuel du projet', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const statusItems = [
  { item: 'Frontend complet', status: 'OK', desc: '8 pages, 30+ composants, interface 3 colonnes' },
  { item: 'Dashboard', status: 'OK', desc: 'Liste projets, filtres, creation projet' },
  { item: 'Gestion clients', status: 'OK', desc: 'CRUD clients avec contexte partage' },
  { item: 'Vue operationnelle', status: 'OK', desc: 'Index documents / Apercu PDF / Contenu rapport' },
  { item: 'Upload documents', status: 'OK', desc: 'Supabase Storage (50MB/fichier, 1GB gratuit)' },
  { item: 'Deploiement', status: 'OK', desc: 'GitHub Pages automatique' },
  { item: 'Classification IA', status: 'TODO', desc: 'Simule - regles basiques' },
  { item: 'Generation rapport', status: 'TODO', desc: 'Simule - donnees statiques' },
];

// Header
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9, h: 0.4, fill: { color: COLORS.purple } });
slide.addText('Element', { x: 0.6, y: 1.0, w: 2.5, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Statut', { x: 3.2, y: 1.0, w: 0.8, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Description', { x: 4.1, y: 1.0, w: 5.3, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });

statusItems.forEach((s, i) => {
  const y = 1.45 + i * 0.42;
  const bgColor = i % 2 === 0 ? COLORS.gray : COLORS.white;
  const statusColor = s.status === 'OK' ? COLORS.mint : COLORS.magenta;
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.42, fill: { color: bgColor } });
  slide.addText(s.item, { x: 0.6, y, w: 2.5, h: 0.42, fontSize: 10, color: COLORS.black, valign: 'middle' });
  slide.addText(s.status === 'OK' ? '✓' : '○', { x: 3.2, y, w: 0.8, h: 0.42, fontSize: 12, bold: true, color: statusColor, valign: 'middle' });
  slide.addText(s.desc, { x: 4.1, y, w: 5.3, h: 0.42, fontSize: 10, color: COLORS.black, valign: 'middle' });
});

// Stats
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 4.9, w: 9, h: 0.15, fill: { color: COLORS.yellow } });
slide.addText('~9 500 lignes de code TypeScript  |  Next.js 14 + React 18 + Tailwind CSS', {
  x: 0.5, y: 4.6, w: 9, h: 0.3, fontSize: 11, color: '666666', align: 'center',
});

// ============================================
// SLIDE 4: Architecture
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Architecture Mock / Production', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Meme codebase pour tout - Toggle via variable d\'environnement', {
  x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 14, color: '666666',
});

// Main box
slide.addShape(pptx.shapes.RECTANGLE, { x: 2.5, y: 1.5, w: 5, h: 0.8, fill: { color: COLORS.lightPurple }, line: { color: COLORS.purple, width: 2 } });
slide.addText('NEXT_PUBLIC_USE_MOCK = true / false', { x: 2.5, y: 1.5, w: 5, h: 0.8, fontSize: 14, bold: true, color: COLORS.purple, align: 'center', valign: 'middle' });

// Left branch - Mock
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 4, h: 1.5, fill: { color: COLORS.gray }, line: { color: COLORS.mint, width: 2 } });
slide.addText('USE_MOCK = true', { x: 0.5, y: 3.0, w: 4, h: 0.5, fontSize: 14, bold: true, color: COLORS.mint, align: 'center' });
slide.addText('GitHub Pages\nDonnees mock\nDemos clients', { x: 0.5, y: 3.5, w: 4, h: 1, fontSize: 12, color: COLORS.black, align: 'center', valign: 'middle' });

// Right branch - Production
slide.addShape(pptx.shapes.RECTANGLE, { x: 5.5, y: 3.0, w: 4, h: 1.5, fill: { color: COLORS.lightPurple }, line: { color: COLORS.purple, width: 2 } });
slide.addText('USE_MOCK = false', { x: 5.5, y: 3.0, w: 4, h: 0.5, fontSize: 14, bold: true, color: COLORS.purple, align: 'center' });
slide.addText('Vercel / Azure\nAPI reelle + Supabase\nProduction', { x: 5.5, y: 3.5, w: 4, h: 1, fontSize: 12, color: COLORS.black, align: 'center', valign: 'middle' });

// Arrows
slide.addText('↓', { x: 3.0, y: 2.4, w: 1, h: 0.5, fontSize: 24, color: COLORS.mint, align: 'center' });
slide.addText('↓', { x: 6.0, y: 2.4, w: 1, h: 0.5, fontSize: 24, color: COLORS.purple, align: 'center' });

// ============================================
// SLIDE 5: Roadmap
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Roadmap : 6 Phases', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const phases = [
  { phase: '0', name: 'Data Access Layer', effort: '1 jour', value: 'Fondation', color: COLORS.gray },
  { phase: '1', name: 'Backend fondations', effort: '2-3 jours', value: 'Infrastructure', color: COLORS.mint },
  { phase: '2', name: 'Extraction texte PDF', effort: '1-2 jours', value: 'Technique', color: COLORS.mint },
  { phase: '3', name: 'Classification IA', effort: '2-3 jours', value: '⭐⭐ Differenciation', color: COLORS.purple },
  { phase: '4', name: 'Generation rapport', effort: '3-4 jours', value: '⭐⭐⭐ Valeur metier', color: COLORS.purple },
  { phase: '5', name: 'IRL & Q&A automatises', effort: '2-3 jours', value: '⭐⭐ Productivite', color: COLORS.blue },
  { phase: '6', name: 'Export & revue', effort: '2-3 jours', value: '⭐ Finition', color: COLORS.blue },
];

// Header
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9, h: 0.4, fill: { color: COLORS.purple } });
slide.addText('Phase', { x: 0.6, y: 1.0, w: 0.7, h: 0.4, fontSize: 10, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Objectif', { x: 1.4, y: 1.0, w: 3, h: 0.4, fontSize: 10, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Effort', { x: 4.5, y: 1.0, w: 1.5, h: 0.4, fontSize: 10, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Valeur', { x: 6.1, y: 1.0, w: 3.3, h: 0.4, fontSize: 10, bold: true, color: COLORS.white, valign: 'middle' });

phases.forEach((p, i) => {
  const y = 1.45 + i * 0.45;
  const bgColor = i % 2 === 0 ? COLORS.gray : COLORS.white;
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.45, fill: { color: bgColor } });
  slide.addShape(pptx.shapes.OVAL, { x: 0.65, y: y + 0.08, w: 0.3, h: 0.3, fill: { color: p.color } });
  slide.addText(p.phase, { x: 0.65, y: y + 0.08, w: 0.3, h: 0.3, fontSize: 9, bold: true, color: COLORS.white, align: 'center', valign: 'middle' });
  slide.addText(p.name, { x: 1.4, y, w: 3, h: 0.45, fontSize: 11, color: COLORS.black, valign: 'middle' });
  slide.addText(p.effort, { x: 4.5, y, w: 1.5, h: 0.45, fontSize: 11, color: COLORS.black, valign: 'middle' });
  slide.addText(p.value, { x: 6.1, y, w: 3.3, h: 0.45, fontSize: 10, color: p.color, valign: 'middle' });
});

// Total
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 4.6, w: 9, h: 0.5, fill: { color: COLORS.yellow } });
slide.addText('Total estime : 13-19 jours de developpement (~7 semaines)', {
  x: 0.5, y: 4.6, w: 9, h: 0.5, fontSize: 14, bold: true, color: COLORS.black, align: 'center', valign: 'middle',
});

// ============================================
// SLIDE 6: Workflow 12 etapes
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Workflow automatise : 12 etapes', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const workflow1 = [
  { num: '1', text: 'Upload docs', ai: false },
  { num: '2', text: 'Classif. IA', ai: true },
  { num: '3', text: 'Gen. IRL', ai: false },
  { num: '4', text: 'Gen. Rapport', ai: true },
  { num: '5', text: 'Revue', ai: false },
  { num: '6', text: 'Q&A auto', ai: true },
];

const workflow2 = [
  { num: '7', text: 'Q&A manqu.', ai: true },
  { num: '8', text: 'Import rep.', ai: false },
  { num: '9', text: 'Modifs prop.', ai: true },
  { num: '10', text: 'Export PPT', ai: false },
  { num: '11', text: 'Rev. coher.', ai: true },
  { num: '12', text: 'Rapport final', ai: false },
];

// First row
workflow1.forEach((w, i) => {
  const x = 0.3 + i * 1.6;
  slide.addShape(pptx.shapes.OVAL, { x, y: 1.2, w: 1.4, h: 0.7, fill: { color: w.ai ? COLORS.purple : COLORS.gray }, line: { color: w.ai ? COLORS.purple : '999999', width: 1 } });
  slide.addText(w.num, { x, y: 1.2, w: 1.4, h: 0.7, fontSize: 14, bold: true, color: w.ai ? COLORS.white : COLORS.black, align: 'center', valign: 'middle' });
  slide.addText(w.text, { x: x - 0.2, y: 2.0, w: 1.8, h: 0.5, fontSize: 9, color: COLORS.black, align: 'center' });
});

// Arrow
slide.addText('→', { x: 4.5, y: 2.5, w: 1, h: 0.5, fontSize: 24, color: COLORS.yellow, align: 'center' });

// Second row
workflow2.forEach((w, i) => {
  const x = 0.3 + i * 1.6;
  slide.addShape(pptx.shapes.OVAL, { x, y: 3.0, w: 1.4, h: 0.7, fill: { color: w.ai ? COLORS.purple : COLORS.gray }, line: { color: w.ai ? COLORS.purple : '999999', width: 1 } });
  slide.addText(w.num, { x, y: 3.0, w: 1.4, h: 0.7, fontSize: 14, bold: true, color: w.ai ? COLORS.white : COLORS.black, align: 'center', valign: 'middle' });
  slide.addText(w.text, { x: x - 0.2, y: 3.8, w: 1.8, h: 0.5, fontSize: 9, color: COLORS.black, align: 'center' });
});

// Legend
slide.addShape(pptx.shapes.OVAL, { x: 6.5, y: 4.5, w: 0.3, h: 0.3, fill: { color: COLORS.purple } });
slide.addText('= IA', { x: 6.9, y: 4.45, w: 0.8, h: 0.4, fontSize: 11, color: COLORS.black });
slide.addShape(pptx.shapes.OVAL, { x: 7.8, y: 4.5, w: 0.3, h: 0.3, fill: { color: COLORS.gray }, line: { color: '999999' } });
slide.addText('= Manuel', { x: 8.2, y: 4.45, w: 1.2, h: 0.4, fontSize: 11, color: COLORS.black });

// ============================================
// SLIDE 7: Decisions techniques
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Decisions techniques a prendre', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const decisions = [
  { question: 'Fournisseur IA', options: 'OpenAI GPT-4 / Anthropic Claude', reco: 'Claude (meilleur sur docs longs)' },
  { question: 'Base de donnees', options: 'Supabase PostgreSQL / Azure', reco: 'Supabase (simplicite, gratuit)' },
  { question: 'OCR (scans)', options: 'Phase 2 ou plus tard', reco: 'Plus tard (priorite PDF natifs)' },
  { question: 'Scope Phase 4', options: 'Tous domaines ou TAX seul', reco: 'TAX d\'abord (valider puis etendre)' },
];

// Header
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 0.45, fill: { color: COLORS.purple } });
slide.addText('Question', { x: 0.6, y: 1.1, w: 2.2, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Options', { x: 2.9, y: 1.1, w: 3, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Recommandation', { x: 6, y: 1.1, w: 3.4, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });

decisions.forEach((d, i) => {
  const y = 1.6 + i * 0.65;
  const bgColor = i % 2 === 0 ? COLORS.gray : COLORS.white;
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.6, fill: { color: bgColor } });
  slide.addText(d.question, { x: 0.6, y, w: 2.2, h: 0.6, fontSize: 12, bold: true, color: COLORS.black, valign: 'middle' });
  slide.addText(d.options, { x: 2.9, y, w: 3, h: 0.6, fontSize: 11, color: '666666', valign: 'middle' });
  slide.addText(d.reco, { x: 6, y, w: 3.4, h: 0.6, fontSize: 11, color: COLORS.purple, valign: 'middle' });
});

// Risks box
slide.addText('Risques identifies', { x: 0.5, y: 4.2, w: 9, h: 0.4, fontSize: 14, bold: true, color: COLORS.magenta });
slide.addText('• Couts IA : ~$0.01-0.03/page  • Limite stockage : 1GB gratuit puis $25/mois  • Qualite classification : validation manuelle + feedback loop', {
  x: 0.5, y: 4.6, w: 9, h: 0.4, fontSize: 11, color: COLORS.black,
});

// ============================================
// SLIDE 8: Elements a fournir - Vue d'ensemble
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Elements a fournir', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Pour avancer sur la construction', { x: 0.5, y: 0.85, w: 9, h: 0.3, fontSize: 14, color: '666666' });

// Immediate
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.2, h: 1.6, fill: { color: COLORS.lightPurple }, line: { color: COLORS.purple, width: 2 } });
slide.addText('Immediat (cette semaine)', { x: 0.6, y: 1.35, w: 4, h: 0.35, fontSize: 12, bold: true, color: COLORS.purple });
slide.addText('1. Credentials Supabase\n   URL, anon key, service role key\n\n2. Choix fournisseur IA\n   OpenAI ou Anthropic ?', {
  x: 0.6, y: 1.75, w: 4, h: 1.1, fontSize: 10, color: COLORS.black, valign: 'top',
});

// Court terme
slide.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 1.3, w: 4.2, h: 1.6, fill: { color: COLORS.gray }, line: { color: COLORS.mint, width: 2 } });
slide.addText('Court terme (2 semaines)', { x: 5.4, y: 1.35, w: 4, h: 0.35, fontSize: 12, bold: true, color: COLORS.mint });
slide.addText('3. Documents de test\n   5-10 PDFs reels anonymises\n\n4. Templates de rapport\n   Exemples DD finaux', {
  x: 5.4, y: 1.75, w: 4, h: 1.1, fontSize: 10, color: COLORS.black, valign: 'top',
});

// Moyen terme
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.1, w: 9, h: 1.8, fill: { color: COLORS.gray }, line: { color: COLORS.blue, width: 2 } });
slide.addText('Moyen terme (1 mois) - Elements juridiques et fiscaux specifiques', { x: 0.6, y: 3.15, w: 8.8, h: 0.35, fontSize: 12, bold: true, color: COLORS.blue });
slide.addText('5. Pour la classification IA : Arborescence complete, mots-cles discriminants, regles metier\n6. Pour la generation rapport : Templates tableaux fiscaux, check-lists vigilance, formules calcul\n7. Pour le Q&A : Questions types par domaine, reponses attendues, red flags', {
  x: 0.6, y: 3.55, w: 8.8, h: 1.3, fontSize: 10, color: COLORS.black, valign: 'top',
});

// ============================================
// SLIDE 9: Documents par domaine
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Documents requis par domaine', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

// TAX
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 4.2, h: 1.8, fill: { color: COLORS.lightPurple } });
slide.addText('FISCAL (TAX)', { x: 0.6, y: 1.05, w: 4, h: 0.35, fontSize: 12, bold: true, color: COLORS.purple });
slide.addText('• Liasses fiscales (2050-2059)\n• Declarations TVA (CA3, CA12)\n• Avis d\'imposition IS\n• Doc. prix de transfert\n• Declarations CET/CFE/CVAE\n• Attestations regularite fiscale', {
  x: 0.6, y: 1.4, w: 4, h: 1.35, fontSize: 9, color: COLORS.black, valign: 'top',
});

// Corporate
slide.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 1.0, w: 4.2, h: 1.8, fill: { color: 'E3F2FD' } });
slide.addText('CORPORATE', { x: 5.4, y: 1.05, w: 4, h: 0.35, fontSize: 12, bold: true, color: COLORS.blue });
slide.addText('• Statuts a jour (SAS, SARL, SA)\n• K-bis recent\n• Pacte d\'associes/actionnaires\n• PV d\'AG et de Conseil\n• Delegations de pouvoirs\n• Organigramme juridique', {
  x: 5.4, y: 1.4, w: 4, h: 1.35, fontSize: 9, color: COLORS.black, valign: 'top',
});

// Social
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 4.2, h: 1.8, fill: { color: 'E8F5E9' } });
slide.addText('SOCIAL', { x: 0.6, y: 3.05, w: 4, h: 0.35, fontSize: 12, bold: true, color: COLORS.mint });
slide.addText('• Contrats de travail (CDI, dirigeants)\n• Convention collective applicable\n• Accords entreprise (interessement)\n• Bulletins de paie (echantillon)\n• Attestations URSSAF\n• Registre du personnel', {
  x: 0.6, y: 3.4, w: 4, h: 1.35, fontSize: 9, color: COLORS.black, valign: 'top',
});

// IP/IT
slide.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 3.0, w: 4.2, h: 1.8, fill: { color: 'FCE4EC' } });
slide.addText('IP/IT', { x: 5.4, y: 3.05, w: 4, h: 0.35, fontSize: 12, bold: true, color: COLORS.magenta });
slide.addText('• Certificats depot INPI (marques)\n• Contrats licence logicielle\n• Documentation RGPD\n• Contrats IT/hebergement\n• Politique de confidentialite\n• Brevets et propriete intellectuelle', {
  x: 5.4, y: 3.4, w: 4, h: 1.35, fontSize: 9, color: COLORS.black, valign: 'top',
});

// ============================================
// SLIDE 10: Budget
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Budget previsionnel', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

// Costs table header
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9, h: 0.4, fill: { color: COLORS.purple } });
slide.addText('Service', { x: 0.6, y: 1.0, w: 3.5, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Gratuit', { x: 4.2, y: 1.0, w: 2.5, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Payant (si besoin)', { x: 6.8, y: 1.0, w: 2.6, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });

const budgetItems = [
  { service: 'Supabase', free: '1GB storage, 50K auth', paid: '$25/mois (8GB, 100K)' },
  { service: 'Vercel', free: 'Hobby (suffisant)', paid: '$20/mois (Pro)' },
  { service: 'OpenAI API', free: '-', paid: '~$50-100/mois' },
  { service: 'Anthropic API', free: '-', paid: '~$50-100/mois' },
  { service: 'GitHub', free: 'Gratuit', paid: '-' },
];

budgetItems.forEach((b, i) => {
  const y = 1.45 + i * 0.4;
  const bgColor = i % 2 === 0 ? COLORS.gray : COLORS.white;
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.4, fill: { color: bgColor } });
  slide.addText(b.service, { x: 0.6, y, w: 3.5, h: 0.4, fontSize: 11, bold: true, color: COLORS.black, valign: 'middle' });
  slide.addText(b.free, { x: 4.2, y, w: 2.5, h: 0.4, fontSize: 10, color: COLORS.mint, valign: 'middle' });
  slide.addText(b.paid, { x: 6.8, y, w: 2.6, h: 0.4, fontSize: 10, color: COLORS.black, valign: 'middle' });
});

// Summary boxes
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.7, w: 4.2, h: 1.1, fill: { color: COLORS.lightPurple }, line: { color: COLORS.purple, width: 2 } });
slide.addText('Phase Test', { x: 0.6, y: 3.75, w: 4, h: 0.35, fontSize: 12, bold: true, color: COLORS.purple });
slide.addText('~$100-200/mois', { x: 0.6, y: 4.15, w: 4, h: 0.5, fontSize: 18, bold: true, color: COLORS.purple, align: 'center' });

slide.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 3.7, w: 4.2, h: 1.1, fill: { color: COLORS.yellow } });
slide.addText('Phase Production', { x: 5.4, y: 3.75, w: 4, h: 0.35, fontSize: 12, bold: true, color: COLORS.black });
slide.addText('~$200-400/mois', { x: 5.4, y: 4.15, w: 4, h: 0.5, fontSize: 18, bold: true, color: COLORS.black, align: 'center' });

// ============================================
// SLIDE 11: Prochaines etapes
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Prochaines etapes', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const actions = [
  { num: '1', title: 'Finaliser Supabase', desc: 'Recuperer credentials, creer bucket documents, tester upload reel', timing: 'Aujourd\'hui' },
  { num: '2', title: 'Merger la PR actuelle', desc: 'Branche claude/create-repo-RFrn8 - Upload Supabase + ClientsContext', timing: 'Aujourd\'hui' },
  { num: '3', title: 'Demarrer Phase 0-1', desc: 'Data Access Layer (1 jour) + Fondations backend Prisma (2 jours)', timing: 'Cette semaine' },
  { num: '4', title: 'Fournir documents test', desc: 'PDFs anonymises par domaine (TAX, Corporate, Social, IP/IT)', timing: '2 semaines' },
];

actions.forEach((a, i) => {
  const y = 1.1 + i * 0.95;
  slide.addShape(pptx.shapes.OVAL, { x: 0.5, y: y + 0.15, w: 0.6, h: 0.6, fill: { color: COLORS.yellow } });
  slide.addText(a.num, { x: 0.5, y: y + 0.15, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: COLORS.black, align: 'center', valign: 'middle' });
  slide.addText(a.title, { x: 1.3, y, w: 5.5, h: 0.4, fontSize: 16, bold: true, color: COLORS.purple });
  slide.addText(a.desc, { x: 1.3, y: y + 0.4, w: 5.5, h: 0.4, fontSize: 11, color: COLORS.black });
  slide.addText(a.timing, { x: 7.3, y: y + 0.15, w: 2.2, h: 0.6, fontSize: 12, bold: true, color: COLORS.mint, align: 'right', valign: 'middle' });
});

// ============================================
// SLIDE 12: Questions
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });

slide.addText('TaxAIDD', {
  x: 0.5, y: 1.8, w: 9, h: 0.8,
  fontSize: 48, bold: true, color: COLORS.purple, align: 'center',
});
slide.addText('Due Diligence augmentee par l\'IA', {
  x: 0.5, y: 2.6, w: 9, h: 0.5,
  fontSize: 24, color: COLORS.black, align: 'center',
});
slide.addText('Questions & Discussion', {
  x: 0.5, y: 3.5, w: 9, h: 0.5,
  fontSize: 18, color: '666666', align: 'center',
});

// Contact
slide.addText('thomaschardenal-ship-it.github.io/TaxAIDD', {
  x: 0.5, y: 4.3, w: 9, h: 0.4,
  fontSize: 12, color: COLORS.purple, align: 'center',
});

// Save
const outputPath = path.join(__dirname, '..', 'TaxAIDD_Synthese_Coactionnaires.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log('✅ Presentation creee avec succes !');
    console.log('📁 Fichier :', outputPath);
  })
  .catch(err => {
    console.error('❌ Erreur :', err);
  });
