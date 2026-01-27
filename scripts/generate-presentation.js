const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
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
};

const pptx = new PptxGenJS();

// Configuration générale
pptx.layout = 'LAYOUT_16x9';
pptx.title = 'TaxAIDD - Présentation Cofondateurs';
pptx.author = 'TaxAIDD';
pptx.company = 'TaxAIDD';

// Définir le master slide
pptx.defineSlideMaster({
  title: 'TAXAIDD_MASTER',
  background: { color: COLORS.white },
  objects: [
    // Barre jaune en bas
    { rect: { x: 0, y: 5.1, w: '100%', h: 0.4, fill: { color: COLORS.yellow } } },
    // Logo placeholder en haut à droite
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
slide.addText('Due Diligence augmentée par l\'IA', {
  x: 0.5, y: 2.5, w: 9, h: 0.6,
  fontSize: 28, color: COLORS.black,
});
slide.addText('Présentation Cofondateurs', {
  x: 0.5, y: 3.3, w: 9, h: 0.5,
  fontSize: 18, color: COLORS.purple,
});
slide.addText('Janvier 2025', {
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
  { num: '01', title: 'Le constat', desc: 'Problématique marché' },
  { num: '02', title: 'TaxAIDD', desc: 'Notre solution' },
  { num: '03', title: 'Démo', desc: 'Mock-up de la plateforme' },
  { num: '04', title: 'Workflow IA', desc: 'Automatisation du process DD' },
  { num: '05', title: 'Besoins IA', desc: 'Technologies et intégrations' },
  { num: '06', title: 'Coûts', desc: 'Budget et investissements' },
  { num: '07', title: 'Roadmap', desc: 'Prochaines étapes' },
];

agendaItems.forEach((item, i) => {
  const y = 1.1 + i * 0.55;
  slide.addText(item.num, { x: 0.5, y, w: 0.6, h: 0.45, fontSize: 18, bold: true, color: COLORS.yellow });
  slide.addText(item.title, { x: 1.2, y, w: 2.5, h: 0.45, fontSize: 16, bold: true, color: COLORS.black });
  slide.addText(item.desc, { x: 3.8, y, w: 5, h: 0.45, fontSize: 14, color: '666666' });
});

// ============================================
// SLIDE 3: Le Constat
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Le constat', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('La Due Diligence aujourd\'hui', {
  x: 0.5, y: 1.0, w: 9, h: 0.5,
  fontSize: 20, bold: true, color: COLORS.black,
});

const problems = [
  { icon: '⏱️', text: 'Process chronophage : collecte manuelle, analyse document par document' },
  { icon: '⚠️', text: 'Risque d\'erreur : volumes importants, délais serrés, pression client' },
  { icon: '🔄', text: 'Manque de standardisation : chaque équipe, ses méthodes' },
  { icon: '📊', text: 'Traçabilité limitée : difficile de retrouver la source d\'une information' },
];

problems.forEach((p, i) => {
  slide.addText(p.icon + '  ' + p.text, {
    x: 0.7, y: 1.7 + i * 0.6, w: 8.5, h: 0.5,
    fontSize: 16, color: COLORS.black,
  });
});

slide.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 4.0, w: 9, h: 0.8,
  fill: { color: COLORS.purple },
});
slide.addText('Objectif : Automatiser, standardiser, sécuriser', {
  x: 0.5, y: 4.0, w: 9, h: 0.8,
  fontSize: 18, bold: true, color: COLORS.white, align: 'center', valign: 'middle',
});

// ============================================
// SLIDE 4: Notre Solution
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('TaxAIDD : Notre solution', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Une plateforme de Due Diligence augmentée par l\'IA', {
  x: 0.5, y: 1.0, w: 9, h: 0.5,
  fontSize: 18, color: COLORS.black,
});

const features = [
  { title: 'Classification automatique', desc: 'Les documents sont triés par l\'IA dans l\'arborescence standard', color: COLORS.purple },
  { title: 'Génération de rapport', desc: 'Tableaux, listes de risques, synthèses générés automatiquement', color: COLORS.mint },
  { title: 'Q&A intelligent', desc: 'Réponses extraites des documents, questions manquantes identifiées', color: COLORS.blue },
  { title: 'Contrôle qualité', desc: 'Vérification de cohérence et conformité avant livraison', color: COLORS.magenta },
];

features.forEach((f, i) => {
  const x = (i % 2) * 4.5 + 0.5;
  const y = Math.floor(i / 2) * 1.5 + 1.6;

  slide.addShape(pptx.shapes.RECTANGLE, {
    x, y, w: 4.2, h: 1.3,
    fill: { color: COLORS.gray },
    line: { color: f.color, width: 2 },
  });
  slide.addText(f.title, { x: x + 0.2, y: y + 0.1, w: 3.8, h: 0.5, fontSize: 14, bold: true, color: f.color });
  slide.addText(f.desc, { x: x + 0.2, y: y + 0.6, w: 3.8, h: 0.6, fontSize: 12, color: COLORS.black });
});

// ============================================
// SLIDE 5: Démo - Screenshot placeholder
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Démo : Vue Opérationnelle', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

// Placeholder pour screenshot
slide.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 1.0, w: 9, h: 4,
  fill: { color: COLORS.gray },
  line: { color: COLORS.purple, width: 1, dashType: 'dash' },
});
slide.addText('[ DÉMO LIVE ]\n\nInterface 3 colonnes :\n• Index documentaire\n• Visualisation PDF\n• Éléments du rapport', {
  x: 0.5, y: 1.0, w: 9, h: 4,
  fontSize: 18, color: '666666', align: 'center', valign: 'middle',
});

// ============================================
// SLIDE 6: Workflow - Vue d'ensemble
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Workflow : Vue d\'ensemble', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const workflowSteps = [
  { num: '1', text: 'Upload documents', ai: true },
  { num: '2', text: 'Classification IA', ai: true },
  { num: '3', text: 'Génération IRL', ai: false },
  { num: '4', text: 'Génération Rapport', ai: true },
  { num: '5', text: 'Revue manuelle', ai: false },
  { num: '6', text: 'Q&A automatique', ai: true },
];

const workflowSteps2 = [
  { num: '7', text: 'Envoi Q&A client', ai: false },
  { num: '8', text: 'Import réponses', ai: true },
  { num: '9', text: 'Validation', ai: false },
  { num: '10', text: 'Export PPT', ai: false },
  { num: '11', text: 'Revue cohérence', ai: true },
  { num: '12', text: 'Rapport final', ai: false },
];

// Première ligne
workflowSteps.forEach((s, i) => {
  const x = 0.3 + i * 1.6;
  slide.addShape(pptx.shapes.OVAL, {
    x, y: 1.3, w: 1.4, h: 0.7,
    fill: { color: s.ai ? COLORS.purple : COLORS.gray },
    line: { color: s.ai ? COLORS.purple : '999999', width: 1 },
  });
  slide.addText(s.num, { x, y: 1.3, w: 1.4, h: 0.7, fontSize: 14, bold: true, color: s.ai ? COLORS.white : COLORS.black, align: 'center', valign: 'middle' });
  slide.addText(s.text, { x: x - 0.2, y: 2.1, w: 1.8, h: 0.6, fontSize: 9, color: COLORS.black, align: 'center' });
});

// Flèche
slide.addText('→', { x: 4.5, y: 2.7, w: 1, h: 0.5, fontSize: 24, color: COLORS.yellow, align: 'center' });

// Deuxième ligne
workflowSteps2.forEach((s, i) => {
  const x = 0.3 + i * 1.6;
  slide.addShape(pptx.shapes.OVAL, {
    x, y: 3.3, w: 1.4, h: 0.7,
    fill: { color: s.ai ? COLORS.purple : COLORS.gray },
    line: { color: s.ai ? COLORS.purple : '999999', width: 1 },
  });
  slide.addText(s.num, { x, y: 3.3, w: 1.4, h: 0.7, fontSize: 14, bold: true, color: s.ai ? COLORS.white : COLORS.black, align: 'center', valign: 'middle' });
  slide.addText(s.text, { x: x - 0.2, y: 4.1, w: 1.8, h: 0.6, fontSize: 9, color: COLORS.black, align: 'center' });
});

// Légende
slide.addShape(pptx.shapes.OVAL, { x: 7.5, y: 4.6, w: 0.3, h: 0.3, fill: { color: COLORS.purple } });
slide.addText('= IA', { x: 7.9, y: 4.55, w: 1, h: 0.4, fontSize: 11, color: COLORS.black });
slide.addShape(pptx.shapes.OVAL, { x: 8.7, y: 4.6, w: 0.3, h: 0.3, fill: { color: COLORS.gray }, line: { color: '999999' } });
slide.addText('= Manuel', { x: 9.1, y: 4.55, w: 1, h: 0.4, fontSize: 11, color: COLORS.black });

// ============================================
// SLIDE 7: Workflow Détail - Collecte
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Workflow : Phase Collecte', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Étapes 1-3 : De l\'upload à l\'IRL', { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 16, color: '666666' });

const collecteSteps = [
  { title: '1. Upload batch', desc: '• L\'utilisateur charge 100-200 documents\n• Formats supportés : PDF, Word, Excel\n• Upload par drag & drop ou import', type: 'user' },
  { title: '2. Classification IA', desc: '• L\'IA analyse chaque document\n• Attribution automatique : TAX, Social, Corporate, IP/IT\n• Classement dans l\'arborescence standard', type: 'ai' },
  { title: '3. Génération IRL', desc: '• Liste des documents manquants générée\n• Priorisation par criticité\n• Export PDF/Word + envoi email client', type: 'user' },
];

collecteSteps.forEach((s, i) => {
  const x = 0.5 + i * 3.1;
  slide.addShape(pptx.shapes.RECTANGLE, {
    x, y: 1.4, w: 2.9, h: 3.2,
    fill: { color: s.type === 'ai' ? 'F3E8FF' : COLORS.gray },
    line: { color: s.type === 'ai' ? COLORS.purple : 'CCCCCC', width: 1 },
  });
  slide.addText(s.title, { x: x + 0.1, y: 1.5, w: 2.7, h: 0.5, fontSize: 14, bold: true, color: s.type === 'ai' ? COLORS.purple : COLORS.black });
  slide.addText(s.desc, { x: x + 0.1, y: 2.0, w: 2.7, h: 2.5, fontSize: 11, color: COLORS.black, valign: 'top' });
});

// ============================================
// SLIDE 8: Workflow Détail - Analyse
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Workflow : Phase Analyse', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Étapes 4-6 : Génération et Q&A', { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 16, color: '666666' });

const analyseSteps = [
  { title: '4. Génération Rapport', desc: '• Clic sur "Générer avec IA"\n• Création des tableaux (résultat fiscal, effectifs...)\n• Listes de risques avec niveaux\n• Synthèses par domaine', type: 'ai' },
  { title: '5. Revue manuelle', desc: '• L\'utilisateur valide chaque élément\n• Modification possible\n• Liaison avec documents sources\n• Traçabilité complète', type: 'user' },
  { title: '6. Q&A automatique', desc: '• Questions standards par domaine\n• L\'IA cherche les réponses dans les docs\n• Identification des informations manquantes\n• Score de confiance', type: 'ai' },
];

analyseSteps.forEach((s, i) => {
  const x = 0.5 + i * 3.1;
  slide.addShape(pptx.shapes.RECTANGLE, {
    x, y: 1.4, w: 2.9, h: 3.2,
    fill: { color: s.type === 'ai' ? 'F3E8FF' : COLORS.gray },
    line: { color: s.type === 'ai' ? COLORS.purple : 'CCCCCC', width: 1 },
  });
  slide.addText(s.title, { x: x + 0.1, y: 1.5, w: 2.7, h: 0.5, fontSize: 14, bold: true, color: s.type === 'ai' ? COLORS.purple : COLORS.black });
  slide.addText(s.desc, { x: x + 0.1, y: 2.0, w: 2.7, h: 2.5, fontSize: 11, color: COLORS.black, valign: 'top' });
});

// ============================================
// SLIDE 9: Workflow Détail - Finalisation
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Workflow : Phase Finalisation', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Étapes 7-12 : Du Q&A au rapport final', { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 16, color: '666666' });

const finSteps = [
  { num: '7-8', title: 'Échanges Q&A', desc: 'Envoi questions au client → Réception réponses → Mise à jour automatique du rapport' },
  { num: '9-10', title: 'Validation & Export', desc: 'Revue finale des modifications → Export PowerPoint structuré' },
  { num: '11-12', title: 'Contrôle & Livraison', desc: 'Vérification cohérence IA → Validation des risques → Rapport final' },
];

finSteps.forEach((s, i) => {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5, y: 1.5 + i * 1.1, w: 9, h: 0.95,
    fill: { color: i % 2 === 0 ? 'F3E8FF' : COLORS.gray },
  });
  slide.addText(s.num, { x: 0.7, y: 1.55 + i * 1.1, w: 0.8, h: 0.85, fontSize: 18, bold: true, color: COLORS.purple, valign: 'middle' });
  slide.addText(s.title, { x: 1.6, y: 1.55 + i * 1.1, w: 2.2, h: 0.85, fontSize: 14, bold: true, color: COLORS.black, valign: 'middle' });
  slide.addText(s.desc, { x: 4.0, y: 1.55 + i * 1.1, w: 5.3, h: 0.85, fontSize: 12, color: COLORS.black, valign: 'middle' });
});

// ============================================
// SLIDE 10: Besoins IA - Vue d'ensemble
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Besoins IA : Vue d\'ensemble', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const aiNeeds = [
  { task: 'Classification documents', model: 'GPT-4o-mini', complexity: '⭐⭐', quality: 'Moyenne' },
  { task: 'Génération rapport', model: 'GPT-4o / Claude', complexity: '⭐⭐⭐⭐', quality: 'Haute' },
  { task: 'Extraction Q&A', model: 'GPT-4o / Claude', complexity: '⭐⭐⭐', quality: 'Haute' },
  { task: 'Propositions modifications', model: 'GPT-4o', complexity: '⭐⭐⭐', quality: 'Haute' },
  { task: 'Revue cohérence', model: 'GPT-4o (long context)', complexity: '⭐⭐⭐⭐', quality: 'Critique' },
];

// Header
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 9, h: 0.5, fill: { color: COLORS.purple } });
slide.addText('Tâche', { x: 0.6, y: 1.1, w: 3, h: 0.5, fontSize: 12, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Modèle', { x: 3.7, y: 1.1, w: 2.2, h: 0.5, fontSize: 12, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Complexité', { x: 6, y: 1.1, w: 1.5, h: 0.5, fontSize: 12, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Qualité req.', { x: 7.6, y: 1.1, w: 1.8, h: 0.5, fontSize: 12, bold: true, color: COLORS.white, valign: 'middle' });

aiNeeds.forEach((n, i) => {
  const y = 1.65 + i * 0.55;
  const bgColor = i % 2 === 0 ? COLORS.gray : COLORS.white;
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.5, fill: { color: bgColor } });
  slide.addText(n.task, { x: 0.6, y, w: 3, h: 0.5, fontSize: 11, color: COLORS.black, valign: 'middle' });
  slide.addText(n.model, { x: 3.7, y, w: 2.2, h: 0.5, fontSize: 11, color: COLORS.purple, valign: 'middle' });
  slide.addText(n.complexity, { x: 6, y, w: 1.5, h: 0.5, fontSize: 11, color: COLORS.black, valign: 'middle' });
  slide.addText(n.quality, { x: 7.6, y, w: 1.8, h: 0.5, fontSize: 11, color: COLORS.black, valign: 'middle' });
});

// Note
slide.addText('Stratégie recommandée : Mix de modèles pour optimiser coût/qualité', {
  x: 0.5, y: 4.5, w: 9, h: 0.4,
  fontSize: 12, italic: true, color: '666666',
});

// ============================================
// SLIDE 11: Besoins IA - Détail technique
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Besoins IA : Détail technique', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Volume estimé par projet (200 documents)', { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 16, color: '666666' });

// Tableau tokens
const tokenData = [
  { op: 'Classification', input: '400K', output: '20K', model: 'Mini/Haiku' },
  { op: 'Génération Rapport', input: '500K', output: '75K', model: 'GPT-4o' },
  { op: 'Extraction Q&A', input: '500K', output: '50K', model: 'GPT-4o' },
  { op: 'Modifications', input: '100K', output: '20K', model: 'GPT-4o' },
  { op: 'Revue Cohérence', input: '150K', output: '30K', model: 'GPT-4o' },
  { op: 'TOTAL', input: '~1.65M', output: '~195K', model: 'Mix' },
];

slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 9, h: 0.45, fill: { color: COLORS.purple } });
slide.addText('Opération', { x: 0.6, y: 1.4, w: 3.5, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Input Tokens', { x: 4.2, y: 1.4, w: 1.5, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Output Tokens', { x: 5.8, y: 1.4, w: 1.5, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Modèle', { x: 7.4, y: 1.4, w: 2, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });

tokenData.forEach((t, i) => {
  const y = 1.9 + i * 0.45;
  const isTotal = t.op === 'TOTAL';
  const bgColor = isTotal ? COLORS.yellow : (i % 2 === 0 ? COLORS.gray : COLORS.white);
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.45, fill: { color: bgColor } });
  slide.addText(t.op, { x: 0.6, y, w: 3.5, h: 0.45, fontSize: 11, bold: isTotal, color: COLORS.black, valign: 'middle' });
  slide.addText(t.input, { x: 4.2, y, w: 1.5, h: 0.45, fontSize: 11, bold: isTotal, color: COLORS.black, valign: 'middle' });
  slide.addText(t.output, { x: 5.8, y, w: 1.5, h: 0.45, fontSize: 11, bold: isTotal, color: COLORS.black, valign: 'middle' });
  slide.addText(t.model, { x: 7.4, y, w: 2, h: 0.45, fontSize: 11, color: COLORS.purple, valign: 'middle' });
});

// ============================================
// SLIDE 12: Coûts de fonctionnement
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Coûts de fonctionnement', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Base : 5 projets/mois • 200 documents/projet (100 longs + 100 courts)', {
  x: 0.5, y: 0.9, w: 9, h: 0.4,
  fontSize: 14, color: '666666',
});

// Tableau coûts
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 4.3, h: 2.8, fill: { color: COLORS.gray } });
slide.addText('Scénario Économique (MVP)', { x: 0.7, y: 1.5, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: COLORS.purple });

const costsMvp = [
  { item: 'LLM (mix GPT-4o-mini + GPT-4o)', cost: '~20€' },
  { item: 'Hébergement Vercel Pro', cost: '~20€' },
  { item: 'Storage & DB', cost: '~5€' },
  { item: 'Email (SendGrid free)', cost: '0€' },
];
costsMvp.forEach((c, i) => {
  slide.addText(c.item, { x: 0.7, y: 2.0 + i * 0.4, w: 3, h: 0.35, fontSize: 11, color: COLORS.black });
  slide.addText(c.cost, { x: 3.8, y: 2.0 + i * 0.4, w: 0.9, h: 0.35, fontSize: 11, color: COLORS.black, align: 'right' });
});
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 3.6, w: 3.9, h: 0.45, fill: { color: COLORS.yellow } });
slide.addText('TOTAL : ~45€/mois', { x: 0.7, y: 3.6, w: 3.9, h: 0.45, fontSize: 14, bold: true, color: COLORS.black, align: 'center', valign: 'middle' });
slide.addText('~9€/projet', { x: 0.7, y: 4.1, w: 3.9, h: 0.3, fontSize: 12, color: COLORS.purple, align: 'center' });

// Scénario Production
slide.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: 1.4, w: 4.3, h: 2.8, fill: { color: 'F3E8FF' } });
slide.addText('Scénario Production', { x: 5.4, y: 1.5, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: COLORS.purple });

const costsProd = [
  { item: 'LLM (GPT-4o / Claude Sonnet)', cost: '~40€' },
  { item: 'Azure App Service', cost: '~25€' },
  { item: 'Storage & DB', cost: '~10€' },
  { item: 'OCR (si scans)', cost: '~60€' },
  { item: 'Monitoring & backup', cost: '~15€' },
];
costsProd.forEach((c, i) => {
  slide.addText(c.item, { x: 5.4, y: 2.0 + i * 0.35, w: 3, h: 0.3, fontSize: 10, color: COLORS.black });
  slide.addText(c.cost, { x: 8.5, y: 2.0 + i * 0.35, w: 0.9, h: 0.3, fontSize: 10, color: COLORS.black, align: 'right' });
});
slide.addShape(pptx.shapes.RECTANGLE, { x: 5.4, y: 3.6, w: 3.9, h: 0.45, fill: { color: COLORS.purple } });
slide.addText('TOTAL : ~150€/mois', { x: 5.4, y: 3.6, w: 3.9, h: 0.45, fontSize: 14, bold: true, color: COLORS.white, align: 'center', valign: 'middle' });
slide.addText('~30€/projet', { x: 5.4, y: 4.1, w: 3.9, h: 0.3, fontSize: 12, color: COLORS.purple, align: 'center' });

// ============================================
// SLIDE 13: Coûts de développement
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Investissements initiaux', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Estimation développement backend IA', { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 16, color: '666666' });

const devCosts = [
  { phase: 'Phase 1 : Fondations (API, DB, Storage)', days: '2-3j', cost: '1 000 - 1 500€' },
  { phase: 'Phase 2 : Extraction texte PDF', days: '1-2j', cost: '500 - 1 000€' },
  { phase: 'Phase 3 : Classification IA', days: '2-3j', cost: '1 000 - 1 500€' },
  { phase: 'Phase 4 : Génération Rapport', days: '3-4j', cost: '1 500 - 2 000€' },
  { phase: 'Phase 5 : IRL & Q&A', days: '2-3j', cost: '1 000 - 1 500€' },
  { phase: 'Phase 6 : Export & Revue', days: '2-3j', cost: '1 000 - 1 500€' },
];

slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 9, h: 0.45, fill: { color: COLORS.purple } });
slide.addText('Phase', { x: 0.6, y: 1.4, w: 5.5, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Durée', { x: 6.2, y: 1.4, w: 1.2, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Coût estimé*', { x: 7.5, y: 1.4, w: 1.9, h: 0.45, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });

devCosts.forEach((d, i) => {
  const y = 1.9 + i * 0.45;
  const bgColor = i % 2 === 0 ? COLORS.gray : COLORS.white;
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.45, fill: { color: bgColor } });
  slide.addText(d.phase, { x: 0.6, y, w: 5.5, h: 0.45, fontSize: 11, color: COLORS.black, valign: 'middle' });
  slide.addText(d.days, { x: 6.2, y, w: 1.2, h: 0.45, fontSize: 11, color: COLORS.black, valign: 'middle' });
  slide.addText(d.cost, { x: 7.5, y, w: 1.9, h: 0.45, fontSize: 11, color: COLORS.black, valign: 'middle' });
});

slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 4.6, w: 9, h: 0.5, fill: { color: COLORS.yellow } });
slide.addText('TOTAL estimé : 12-18 jours • 6 000 - 9 000€', { x: 0.5, y: 4.6, w: 9, h: 0.5, fontSize: 14, bold: true, color: COLORS.black, align: 'center', valign: 'middle' });

slide.addText('*Base TJM freelance dev senior : ~500€/jour', { x: 0.5, y: 5.15, w: 9, h: 0.3, fontSize: 10, italic: true, color: '666666' });

// ============================================
// SLIDE 14: Roadmap
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Roadmap', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Approche itérative : livraison continue de valeur', { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 16, color: '666666' });

// Timeline
const timeline = [
  { week: 'S1-S2', phase: 'Fondations', desc: 'API, DB, Upload', color: COLORS.mint },
  { week: 'S3', phase: 'Extraction', desc: 'PDF → Texte', color: COLORS.mint },
  { week: 'S4-S5', phase: 'Classification', desc: 'IA TAX first', color: COLORS.purple },
  { week: 'S6-S7', phase: 'Rapport', desc: 'Génération IA', color: COLORS.purple },
  { week: 'S8', phase: 'IRL/Q&A', desc: 'Automatisation', color: COLORS.blue },
  { week: 'S9', phase: 'Export', desc: 'PPT + Revue', color: COLORS.blue },
];

// Barre de timeline
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 2.3, w: 9, h: 0.15, fill: { color: COLORS.gray } });

timeline.forEach((t, i) => {
  const x = 0.5 + i * 1.5;
  slide.addShape(pptx.shapes.OVAL, { x: x + 0.5, y: 2.15, w: 0.45, h: 0.45, fill: { color: t.color } });
  slide.addText(t.week, { x, y: 1.6, w: 1.5, h: 0.4, fontSize: 11, bold: true, color: t.color, align: 'center' });
  slide.addText(t.phase, { x, y: 2.7, w: 1.5, h: 0.35, fontSize: 11, bold: true, color: COLORS.black, align: 'center' });
  slide.addText(t.desc, { x, y: 3.0, w: 1.5, h: 0.35, fontSize: 10, color: '666666', align: 'center' });
});

// MVP marker
slide.addShape(pptx.shapes.RECTANGLE, { x: 4.8, y: 3.5, w: 0.05, h: 1, fill: { color: COLORS.yellow } });
slide.addText('MVP\nDomaine TAX', { x: 4.0, y: 4.0, w: 1.8, h: 0.6, fontSize: 10, bold: true, color: COLORS.yellow, align: 'center' });

// Légende
slide.addShape(pptx.shapes.OVAL, { x: 0.5, y: 4.6, w: 0.25, h: 0.25, fill: { color: COLORS.mint } });
slide.addText('Infrastructure', { x: 0.85, y: 4.55, w: 1.5, h: 0.35, fontSize: 10, color: COLORS.black });
slide.addShape(pptx.shapes.OVAL, { x: 2.5, y: 4.6, w: 0.25, h: 0.25, fill: { color: COLORS.purple } });
slide.addText('IA Core', { x: 2.85, y: 4.55, w: 1.2, h: 0.35, fontSize: 10, color: COLORS.black });
slide.addShape(pptx.shapes.OVAL, { x: 4.2, y: 4.6, w: 0.25, h: 0.25, fill: { color: COLORS.blue } });
slide.addText('Features', { x: 4.55, y: 4.55, w: 1.2, h: 0.35, fontSize: 10, color: COLORS.black });

// ============================================
// SLIDE 15: Stratégie Go-to-Market
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Stratégie : TAX First', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Pourquoi commencer par le domaine fiscal ?', { x: 0.5, y: 1.0, w: 9, h: 0.4, fontSize: 18, color: COLORS.black });

const reasons = [
  { icon: '📊', title: 'Volume de données structurées', desc: 'Liasses fiscales, déclarations → Format prévisible, extraction fiable' },
  { icon: '🎯', title: 'Expertise interne', desc: 'Équipe cofondatrice = fiscalistes → Prompts précis, validation rapide' },
  { icon: '⚡', title: 'Quick win', desc: 'Tableaux IS, TEI, CIR → Valeur immédiate et démontrable' },
  { icon: '🔄', title: 'Réplicabilité', desc: 'Une fois le modèle validé → Extension Social, Corporate, IP/IT' },
];

reasons.forEach((r, i) => {
  const y = 1.5 + i * 0.85;
  slide.addText(r.icon, { x: 0.5, y, w: 0.6, h: 0.7, fontSize: 24 });
  slide.addText(r.title, { x: 1.2, y, w: 3, h: 0.35, fontSize: 14, bold: true, color: COLORS.purple });
  slide.addText(r.desc, { x: 1.2, y: y + 0.35, w: 7.5, h: 0.4, fontSize: 12, color: COLORS.black });
});

// ============================================
// SLIDE 16: Éléments métier à fournir
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Éléments métier à fournir', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

slide.addText('Pour paramétrer l\'IA avec notre expertise métier', { x: 0.5, y: 0.9, w: 9, h: 0.4, fontSize: 16, color: '666666' });

const inputs = [
  { item: 'Arborescence documentaire standard', priority: 'HAUTE', format: 'Excel' },
  { item: 'IRL type par domaine', priority: 'HAUTE', format: 'Excel' },
  { item: 'Q&A standard par domaine', priority: 'HAUTE', format: 'Excel' },
  { item: 'Templates tableaux rapport (IS, effectifs...)', priority: 'HAUTE', format: 'Excel' },
  { item: 'Guide de style rédactionnel', priority: 'MOYENNE', format: 'Word' },
  { item: 'Matrice d\'évaluation des risques', priority: 'MOYENNE', format: 'Excel' },
  { item: 'Template PowerPoint rapport', priority: 'MOYENNE', format: 'PPTX' },
];

slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 9, h: 0.4, fill: { color: COLORS.purple } });
slide.addText('Document', { x: 0.6, y: 1.4, w: 5, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Priorité', { x: 5.7, y: 1.4, w: 1.5, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });
slide.addText('Format', { x: 7.3, y: 1.4, w: 2, h: 0.4, fontSize: 11, bold: true, color: COLORS.white, valign: 'middle' });

inputs.forEach((inp, i) => {
  const y = 1.85 + i * 0.42;
  const bgColor = i % 2 === 0 ? COLORS.gray : COLORS.white;
  const prioColor = inp.priority === 'HAUTE' ? COLORS.magenta : COLORS.blue;
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.42, fill: { color: bgColor } });
  slide.addText(inp.item, { x: 0.6, y, w: 5, h: 0.42, fontSize: 11, color: COLORS.black, valign: 'middle' });
  slide.addText(inp.priority, { x: 5.7, y, w: 1.5, h: 0.42, fontSize: 10, bold: true, color: prioColor, valign: 'middle' });
  slide.addText(inp.format, { x: 7.3, y, w: 2, h: 0.42, fontSize: 11, color: '666666', valign: 'middle' });
});

// ============================================
// SLIDE 17: Avantage concurrentiel
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Avantage concurrentiel', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

// Comparaison
slide.addText('Approche traditionnelle', { x: 0.5, y: 1.1, w: 4.2, h: 0.4, fontSize: 16, bold: true, color: '999999' });
slide.addText('TaxAIDD', { x: 5.3, y: 1.1, w: 4.2, h: 0.4, fontSize: 16, bold: true, color: COLORS.purple });

const comparisons = [
  { trad: 'Classification manuelle', taxaidd: 'Classification IA automatique' },
  { trad: 'Saisie des données à la main', taxaidd: 'Extraction et structuration IA' },
  { trad: 'Recherche d\'info document par document', taxaidd: 'Q&A intelligent sur tout le corpus' },
  { trad: 'Contrôle qualité manuel', taxaidd: 'Vérification de cohérence IA' },
  { trad: 'Process variable selon l\'équipe', taxaidd: 'Workflow standardisé et traçable' },
];

comparisons.forEach((c, i) => {
  const y = 1.6 + i * 0.6;
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y, w: 4.2, h: 0.5, fill: { color: COLORS.gray } });
  slide.addText('❌ ' + c.trad, { x: 0.6, y, w: 4, h: 0.5, fontSize: 11, color: '666666', valign: 'middle' });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y, w: 4.2, h: 0.5, fill: { color: 'E8F5E9' } });
  slide.addText('✓ ' + c.taxaidd, { x: 5.4, y, w: 4, h: 0.5, fontSize: 11, color: COLORS.mint, valign: 'middle' });
});

// ============================================
// SLIDE 18: Call to Action
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Prochaines étapes', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

const actions = [
  { num: '1', title: 'Validation de la vision', desc: 'Alignement sur le périmètre et les priorités', deadline: 'Aujourd\'hui' },
  { num: '2', title: 'Fourniture éléments métier', desc: 'IRL, Q&A, templates rapport (domaine TAX)', deadline: 'Semaine prochaine' },
  { num: '3', title: 'Lancement développement', desc: 'Phase 1-3 : Fondations + Classification', deadline: 'Sous 2 semaines' },
  { num: '4', title: 'MVP TAX opérationnel', desc: 'Test sur un vrai dossier client', deadline: '~6 semaines' },
];

actions.forEach((a, i) => {
  const y = 1.1 + i * 0.95;
  slide.addShape(pptx.shapes.OVAL, { x: 0.5, y: y + 0.1, w: 0.6, h: 0.6, fill: { color: COLORS.yellow } });
  slide.addText(a.num, { x: 0.5, y: y + 0.1, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: COLORS.black, align: 'center', valign: 'middle' });
  slide.addText(a.title, { x: 1.3, y, w: 5, h: 0.4, fontSize: 16, bold: true, color: COLORS.purple });
  slide.addText(a.desc, { x: 1.3, y: y + 0.4, w: 5, h: 0.35, fontSize: 12, color: COLORS.black });
  slide.addText(a.deadline, { x: 7.5, y: y + 0.15, w: 2, h: 0.5, fontSize: 12, bold: true, color: COLORS.mint, align: 'right' });
});

// ============================================
// SLIDE 19: Synthèse budget
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });
slide.addText('Synthèse financière', {
  x: 0.5, y: 0.3, w: 9, h: 0.6,
  fontSize: 32, bold: true, color: COLORS.purple,
});

// Investissement initial
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 4.2, h: 2.2, fill: { color: 'F3E8FF' }, line: { color: COLORS.purple, width: 2 } });
slide.addText('Investissement initial', { x: 0.7, y: 1.2, w: 3.8, h: 0.4, fontSize: 14, bold: true, color: COLORS.purple });
slide.addText('Développement backend IA', { x: 0.7, y: 1.7, w: 2.8, h: 0.35, fontSize: 12, color: COLORS.black });
slide.addText('6-9 k€', { x: 3.5, y: 1.7, w: 1, h: 0.35, fontSize: 12, color: COLORS.black, align: 'right' });
slide.addText('Paramétrage & tests', { x: 0.7, y: 2.1, w: 2.8, h: 0.35, fontSize: 12, color: COLORS.black });
slide.addText('~2 k€', { x: 3.5, y: 2.1, w: 1, h: 0.35, fontSize: 12, color: COLORS.black, align: 'right' });
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 2.6, w: 3.8, h: 0.5, fill: { color: COLORS.purple } });
slide.addText('Total : 8-11 k€', { x: 0.7, y: 2.6, w: 3.8, h: 0.5, fontSize: 14, bold: true, color: COLORS.white, align: 'center', valign: 'middle' });

// Coûts récurrents
slide.addShape(pptx.shapes.RECTANGLE, { x: 5.3, y: 1.1, w: 4.2, h: 2.2, fill: { color: COLORS.gray }, line: { color: COLORS.mint, width: 2 } });
slide.addText('Coûts récurrents', { x: 5.5, y: 1.2, w: 3.8, h: 0.4, fontSize: 14, bold: true, color: COLORS.mint });
slide.addText('Phase MVP', { x: 5.5, y: 1.7, w: 2.8, h: 0.35, fontSize: 12, color: COLORS.black });
slide.addText('~45€/mois', { x: 8.3, y: 1.7, w: 1, h: 0.35, fontSize: 12, color: COLORS.black, align: 'right' });
slide.addText('Phase Production', { x: 5.5, y: 2.1, w: 2.8, h: 0.35, fontSize: 12, color: COLORS.black });
slide.addText('~150€/mois', { x: 8.3, y: 2.1, w: 1, h: 0.35, fontSize: 12, color: COLORS.black, align: 'right' });
slide.addShape(pptx.shapes.RECTANGLE, { x: 5.5, y: 2.6, w: 3.8, h: 0.5, fill: { color: COLORS.mint } });
slide.addText('~9-30€/projet', { x: 5.5, y: 2.6, w: 3.8, h: 0.5, fontSize: 14, bold: true, color: COLORS.white, align: 'center', valign: 'middle' });

// ROI
slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.6, w: 9, h: 1.2, fill: { color: COLORS.yellow } });
slide.addText('Retour sur investissement', { x: 0.7, y: 3.7, w: 8.6, h: 0.4, fontSize: 16, bold: true, color: COLORS.black });
slide.addText('Si gain de 1 jour/dossier à 800€/jour • 5 dossiers/mois = 4 000€/mois d\'économie\n→ ROI < 3 mois', {
  x: 0.7, y: 4.1, w: 8.6, h: 0.6, fontSize: 13, color: COLORS.black,
});

// ============================================
// SLIDE 20: Merci / Questions
// ============================================
slide = pptx.addSlide({ masterName: 'TAXAIDD_MASTER' });

slide.addText('TaxAIDD', {
  x: 0.5, y: 1.8, w: 9, h: 0.8,
  fontSize: 48, bold: true, color: COLORS.purple, align: 'center',
});
slide.addText('Due Diligence augmentée par l\'IA', {
  x: 0.5, y: 2.6, w: 9, h: 0.5,
  fontSize: 24, color: COLORS.black, align: 'center',
});
slide.addText('Questions & Discussion', {
  x: 0.5, y: 3.5, w: 9, h: 0.5,
  fontSize: 18, color: '666666', align: 'center',
});

// Sauvegarder le fichier
const outputPath = path.join(__dirname, '..', 'TaxAIDD_Presentation_Cofondateurs.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log('✅ Présentation créée avec succès !');
    console.log('📁 Fichier :', outputPath);
  })
  .catch(err => {
    console.error('❌ Erreur :', err);
  });
