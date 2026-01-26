'use client';

import React, { useState } from 'react';
import { Upload, Sparkles, FileText, Check, Loader2 } from 'lucide-react';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportTab = 'manual' | 'ai';

interface UploadedFile {
  name: string;
  size: string;
  status: 'uploading' | 'processing' | 'done';
  category?: string;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<ImportTab>('manual');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: '', label: 'Sélectionner une catégorie' },
    { value: 'corporate-constitution', label: '01.1 - Constitution & Kbis' },
    { value: 'corporate-actionnariat', label: '01.2 - Actionnariat' },
    { value: 'corporate-vie-sociale', label: '01.3 - Vie Sociale' },
    { value: 'tax-cit', label: '02.1 - CIT (IS)' },
    { value: 'tax-vat', label: '02.2 - VAT (TVA)' },
    { value: 'tax-autres', label: '02.3 - Autres Taxes' },
    { value: 'social-effectifs', label: '03.1 - Effectifs' },
    { value: 'social-contrats', label: '03.2 - Contrats Travail' },
    { value: 'ipit-ip', label: '04.1 - Propriété Intellectuelle' },
    { value: 'ipit-rgpd', label: '04.4 - RGPD' },
  ];

  const simulateUpload = (files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      status: 'uploading' as const,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    setTimeout(() => {
      setUploadedFiles(prev =>
        prev.map(f => (f.status === 'uploading' ? { ...f, status: 'processing' as const } : f))
      );

      if (activeTab === 'ai') {
        // AI classification simulation
        setTimeout(() => {
          setUploadedFiles(prev =>
            prev.map(f => {
              if (f.status === 'processing') {
                const randomCategory = categories[Math.floor(Math.random() * (categories.length - 1)) + 1];
                return { ...f, status: 'done' as const, category: randomCategory.label };
              }
              return f;
            })
          );
          setIsUploading(false);
        }, 2000);
      } else {
        setTimeout(() => {
          setUploadedFiles(prev =>
            prev.map(f => (f.status === 'processing' ? { ...f, status: 'done' as const } : f))
          );
          setIsUploading(false);
        }, 1000);
      }
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    simulateUpload(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    simulateUpload(e.target.files);
  };

  const handleConfirm = () => {
    console.log('[Import] Confirmed files:', uploadedFiles);
    alert(`${uploadedFiles.length} fichier(s) importé(s) avec succès!`);
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Importer des Documents" size="lg">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-omni-gray-light rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-white text-omni-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-4 h-4" />
          Manuel
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'ai'
              ? 'bg-white text-omni-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Automatique IA
        </button>
      </div>

      {/* Manual tab content */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie de destination
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-omni-purple"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-omni-yellow transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Glissez-déposez vos fichiers ici
            </p>
            <p className="text-xs text-gray-400 mb-4">ou</p>
            <label className="btn-primary px-4 py-2 rounded-lg cursor-pointer text-sm">
              Parcourir
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* AI tab content */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-omni-yellow/10 border border-omni-yellow/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-omni-yellow-dark flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-omni-black">Classement automatique par IA</p>
                <p className="text-xs text-gray-600 mt-1">
                  L&apos;IA analysera vos documents et les classera automatiquement dans les bonnes catégories.
                </p>
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-omni-purple transition-colors"
          >
            <Sparkles className="w-12 h-12 mx-auto text-omni-purple mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Déposez plusieurs fichiers pour un classement automatique
            </p>
            <label className="bg-omni-purple text-white px-4 py-2 rounded-lg cursor-pointer text-sm inline-block hover:bg-purple-700 transition-colors">
              Sélectionner des fichiers
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Fichiers ({uploadedFiles.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-omni-gray-light rounded-lg"
              >
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-omni-black truncate">{file.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{file.size}</span>
                    {file.category && (
                      <span className="text-xs text-omni-purple">→ {file.category}</span>
                    )}
                  </div>
                </div>
                <div>
                  {file.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-omni-yellow animate-spin" />
                  )}
                  {file.status === 'processing' && (
                    <Loader2 className="w-5 h-5 text-omni-purple animate-spin" />
                  )}
                  {file.status === 'done' && (
                    <Check className="w-5 h-5 text-omni-mint" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={uploadedFiles.length === 0 || isUploading}
        >
          Confirmer l&apos;import
        </Button>
      </ModalFooter>
    </Modal>
  );
}
