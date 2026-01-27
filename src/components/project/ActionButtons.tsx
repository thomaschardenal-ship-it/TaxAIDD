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
      <h3 className="text-lg font-semibold text-taxaidd-black mb-6">Actions</h3>

      {/* Première ligne - Actions principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <button
          onClick={onGenerateIRL}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-taxaidd-yellow hover:bg-taxaidd-yellow/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-taxaidd-purple/10 flex items-center justify-center group-hover:bg-taxaidd-yellow/20 transition-colors">
            <ClipboardList className="w-7 h-7 text-taxaidd-purple" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-taxaidd-black">Générer IRL</p>
            <p className="text-sm text-gray-500 mt-1">Information Request List</p>
          </div>
        </button>

        <button
          onClick={onGenerateQA}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-taxaidd-yellow hover:bg-taxaidd-yellow/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-taxaidd-mint/10 flex items-center justify-center group-hover:bg-taxaidd-yellow/20 transition-colors">
            <HelpCircle className="w-7 h-7 text-taxaidd-mint" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-taxaidd-black">Générer Q&A</p>
            <p className="text-sm text-gray-500 mt-1">Questions & Réponses</p>
          </div>
        </button>

        <button
          onClick={onImportDocuments}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-taxaidd-yellow hover:bg-taxaidd-yellow/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-taxaidd-blue/10 flex items-center justify-center group-hover:bg-taxaidd-yellow/20 transition-colors">
            <Upload className="w-7 h-7 text-taxaidd-blue" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-taxaidd-black">Importer Documents</p>
            <p className="text-sm text-gray-500 mt-1">Upload manuel ou IA</p>
          </div>
        </button>
      </div>

      {/* Deuxième ligne - Actions secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onImportQAResponses}
          className="group flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-taxaidd-yellow hover:bg-taxaidd-yellow/5 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-taxaidd-magenta/10 flex items-center justify-center group-hover:bg-taxaidd-yellow/20 transition-colors">
            <FileInput className="w-6 h-6 text-taxaidd-magenta" />
          </div>
          <div className="text-center">
            <p className="font-medium text-taxaidd-black text-sm">Import Réponses Q&A</p>
            <p className="text-xs text-gray-500 mt-0.5">Fichier client</p>
          </div>
        </button>

        <button
          onClick={onExportReport}
          className="group flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-taxaidd-yellow hover:bg-taxaidd-yellow/5 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-taxaidd-yellow/20 flex items-center justify-center group-hover:bg-taxaidd-yellow/30 transition-colors">
            <FileDown className="w-6 h-6 text-taxaidd-yellow-dark" />
          </div>
          <div className="text-center">
            <p className="font-medium text-taxaidd-black text-sm">Exporter Rapport</p>
            <p className="text-xs text-gray-500 mt-0.5">PDF, Word, PowerPoint</p>
          </div>
        </button>

        <button
          onClick={onCoherenceReview}
          className="group flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-taxaidd-yellow hover:bg-taxaidd-yellow/5 transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-taxaidd-yellow/20 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-medium text-taxaidd-black text-sm">Revue Cohérence</p>
            <p className="text-xs text-gray-500 mt-0.5">Contrôle qualité IA</p>
          </div>
        </button>
      </div>
    </div>
  );
}
