'use client';

import React from 'react';
import { ClipboardList, HelpCircle, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ActionButtonsProps {
  onGenerateIRL: () => void;
  onGenerateQA: () => void;
  onImportDocuments: () => void;
}

export default function ActionButtons({ onGenerateIRL, onGenerateQA, onImportDocuments }: ActionButtonsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-omni-black mb-6">Actions</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onGenerateIRL}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-omni-yellow hover:bg-omni-yellow/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-omni-purple/10 flex items-center justify-center group-hover:bg-omni-yellow/20 transition-colors">
            <ClipboardList className="w-7 h-7 text-omni-purple" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-omni-black">Générer IRL</p>
            <p className="text-sm text-gray-500 mt-1">Information Request List</p>
          </div>
        </button>

        <button
          onClick={onGenerateQA}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-omni-yellow hover:bg-omni-yellow/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-omni-mint/10 flex items-center justify-center group-hover:bg-omni-yellow/20 transition-colors">
            <HelpCircle className="w-7 h-7 text-omni-mint" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-omni-black">Générer Q&A</p>
            <p className="text-sm text-gray-500 mt-1">Questions & Réponses</p>
          </div>
        </button>

        <button
          onClick={onImportDocuments}
          className="group flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-omni-yellow hover:bg-omni-yellow/5 transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-omni-blue/10 flex items-center justify-center group-hover:bg-omni-yellow/20 transition-colors">
            <Upload className="w-7 h-7 text-omni-blue" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-omni-black">Importer Documents</p>
            <p className="text-sm text-gray-500 mt-1">Upload manuel ou IA</p>
          </div>
        </button>
      </div>
    </div>
  );
}
