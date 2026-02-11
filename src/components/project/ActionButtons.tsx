'use client';

import React from 'react';
import { ClipboardList, HelpCircle, Upload, FileInput, FileDown, CheckCircle2 } from 'lucide-react';

interface ActionButtonsProps {
  onGenerateIRL: () => void;
  onGenerateQA: () => void;
  onImportDocuments: () => void;
  onImportQAResponses?: () => void;
  onExportReport?: () => void;
  onCoherenceReview?: () => void;
}

export default function ActionButtons({
  onGenerateIRL,
  onGenerateQA,
  onImportDocuments,
  onImportQAResponses,
  onExportReport,
  onCoherenceReview,
}: ActionButtonsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-wedd-black mb-6">Actions</h3>

      {/* Ligne 1: Importer document | Générer Q&A | Revue cohérence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <button
          onClick={onImportDocuments}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-wedd-mint hover:bg-wedd-mint/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-wedd-black/10 flex items-center justify-center group-hover:bg-wedd-mint/20 transition-colors">
            <Upload className="w-7 h-7 text-wedd-black" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-wedd-black">Importer Documents</p>
            <p className="text-sm text-gray-500 mt-1">Upload manuel ou IA</p>
          </div>
        </button>

        <button
          onClick={onGenerateQA}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-wedd-mint hover:bg-wedd-mint/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-wedd-mint/10 flex items-center justify-center group-hover:bg-wedd-mint/20 transition-colors">
            <HelpCircle className="w-7 h-7 text-wedd-mint" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-wedd-black">Générer Q&A</p>
            <p className="text-sm text-gray-500 mt-1">Questions & Réponses</p>
          </div>
        </button>

        <button
          onClick={onCoherenceReview}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-wedd-mint hover:bg-wedd-mint/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-wedd-mint/20 transition-colors">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-wedd-black">Revue Cohérence</p>
            <p className="text-sm text-gray-500 mt-1">Contrôle qualité IA</p>
          </div>
        </button>
      </div>

      {/* Ligne 2: Générer l'IRL | Import Réponse Q&A | Exporter Rapport */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onGenerateIRL}
          className="group flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-wedd-mint hover:bg-wedd-mint/5 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-wedd-black/10 flex items-center justify-center group-hover:bg-wedd-mint/20 transition-colors">
            <ClipboardList className="w-6 h-6 text-wedd-black" />
          </div>
          <div className="text-center">
            <p className="font-medium text-wedd-black text-sm">Générer l&apos;IRL</p>
            <p className="text-xs text-gray-500 mt-0.5">Information Request List</p>
          </div>
        </button>

        <button
          onClick={onImportQAResponses}
          className="group flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-wedd-mint hover:bg-wedd-mint/5 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-wedd-mint/10 flex items-center justify-center group-hover:bg-wedd-mint/20 transition-colors">
            <FileInput className="w-6 h-6 text-wedd-mint" />
          </div>
          <div className="text-center">
            <p className="font-medium text-wedd-black text-sm">Import Réponses Q&A</p>
            <p className="text-xs text-gray-500 mt-0.5">Fichier client</p>
          </div>
        </button>

        <button
          onClick={onExportReport}
          className="group flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-wedd-mint hover:bg-wedd-mint/5 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-wedd-mint/20 flex items-center justify-center group-hover:bg-wedd-mint/20 transition-colors">
            <FileDown className="w-6 h-6 text-wedd-mint-dark" />
          </div>
          <div className="text-center">
            <p className="font-medium text-wedd-black text-sm">Exporter Rapport</p>
            <p className="text-xs text-gray-500 mt-0.5">PDF, Word, PowerPoint</p>
          </div>
        </button>
      </div>
    </div>
  );
}
