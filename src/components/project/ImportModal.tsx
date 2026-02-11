'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Sparkles, FileText, Check, Loader2, AlertCircle, X } from 'lucide-react';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  uploadFiles,
  UploadFile,
  UploadSession,
  UploadProgress,
  validateFile,
  formatBytes,
  UPLOAD_CONFIG,
} from '@/lib/upload';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onUploadComplete?: () => void;
}

type ImportTab = 'manual' | 'ai';

// Category mapping for manual upload
const CATEGORIES = [
  { value: '', label: 'Selectionner une categorie', code: '' },
  { value: 'corporate-constitution', label: '01.1 - Constitution & Kbis', code: '01.1' },
  { value: 'corporate-actionnariat', label: '01.2 - Actionnariat', code: '01.2' },
  { value: 'corporate-vie-sociale', label: '01.3 - Vie Sociale', code: '01.3' },
  { value: 'corporate-contrats', label: '01.4 - Contrats Materiels', code: '01.4' },
  { value: 'tax-cit', label: '02.1 - CIT (IS)', code: '02.1' },
  { value: 'tax-vat', label: '02.2 - VAT (TVA)', code: '02.2' },
  { value: 'tax-autres', label: '02.3 - Autres Taxes', code: '02.3' },
  { value: 'social-effectifs', label: '03.1 - Effectifs', code: '03.1' },
  { value: 'social-contrats', label: '03.2 - Contrats Travail', code: '03.2' },
  { value: 'social-paie', label: '03.3 - Paie', code: '03.3' },
  { value: 'ipit-ip', label: '04.1 - Propriete Intellectuelle', code: '04.1' },
  { value: 'ipit-domaines', label: '04.2 - Noms de Domaine', code: '04.2' },
  { value: 'ipit-it', label: '04.3 - IT', code: '04.3' },
  { value: 'ipit-rgpd', label: '04.4 - RGPD', code: '04.4' },
];

export default function ImportModal({ isOpen, onClose, projectId = 'project-1', onUploadComplete }: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<ImportTab>('manual');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadSession, setUploadSession] = useState<UploadSession | null>(null);
  const [fileStatuses, setFileStatuses] = useState<Map<string, UploadFile>>(new Map());
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);

  // Get category details from value
  const getCategory = (value: string) => CATEGORIES.find(c => c.value === value);

  // Progress callback
  const handleProgress = useCallback((progress: UploadProgress) => {
    setFileStatuses(prev => {
      const next = new Map(prev);
      next.set(progress.file.id, progress.file);
      return next;
    });
    setOverallProgress(progress.overallProgress);
  }, []);

  // File complete callback
  const handleFileComplete = useCallback((file: UploadFile) => {
    setFileStatuses(prev => {
      const next = new Map(prev);
      next.set(file.id, file);
      return next;
    });
  }, []);

  // Error callback
  const handleError = useCallback((file: UploadFile, error: Error) => {
    console.error(`[Upload] File error: ${file.name}`, error);
    setFileStatuses(prev => {
      const next = new Map(prev);
      next.set(file.id, { ...file, status: 'failed', error: error.message });
      return next;
    });
  }, []);

  // Handle file selection
  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const invalidFiles: { name: string; error: string }[] = [];

    Array.from(files).forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ name: file.name, error: validation.error || 'Invalid file' });
      }
    });

    if (invalidFiles.length > 0) {
      console.warn('[Upload] Invalid files:', invalidFiles);
      alert(`Fichiers invalides:\n${invalidFiles.map(f => `- ${f.name}: ${f.error}`).join('\n')}`);
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFilesSelected(e.dataTransfer.files);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelected(e.target.files);
    e.target.value = ''; // Reset input for re-selection
  };

  // Remove a file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Start upload
  const startUpload = async () => {
    if (selectedFiles.length === 0) return;
    if (activeTab === 'manual' && !selectedCategory) {
      alert('Veuillez selectionner une categorie');
      return;
    }

    setIsUploading(true);
    setOverallProgress(0);
    setFileStatuses(new Map());

    const category = getCategory(selectedCategory);

    try {
      const session = await uploadFiles({
        projectId,
        files: selectedFiles,
        mode: activeTab,
        category: activeTab === 'manual' ? category?.label : undefined,
        categoryCode: activeTab === 'manual' ? category?.code : undefined,
        onProgress: handleProgress,
        onFileComplete: handleFileComplete,
        onError: handleError,
      });

      setUploadSession(session);

      if (session.failedFiles === 0) {
        onUploadComplete?.();
      }
    } catch (error) {
      console.error('[Upload] Session error:', error);
      alert('Erreur lors de l\'upload. Veuillez reessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (isUploading) {
      if (!confirm('Upload en cours. Voulez-vous vraiment fermer?')) {
        return;
      }
    }
    // Reset state
    setSelectedFiles([]);
    setUploadSession(null);
    setFileStatuses(new Map());
    setOverallProgress(0);
    setSelectedCategory('');
    onClose();
  };

  // Render file status
  const renderFileStatus = (file: File, index: number) => {
    // Find corresponding upload file status
    const uploadFile = Array.from(fileStatuses.values()).find(
      uf => uf.name === file.name && uf.size === file.size
    );

    return (
      <div
        key={index}
        className="flex items-center gap-3 p-3 bg-wedd-cream rounded-lg"
      >
        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-wedd-black truncate">{file.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{formatBytes(file.size)}</span>
            {uploadFile?.category && (
              <span className="text-xs text-wedd-black">→ {uploadFile.category}</span>
            )}
            {uploadFile?.error && (
              <span className="text-xs text-red-500">{uploadFile.error}</span>
            )}
          </div>
          {uploadFile && uploadFile.status === 'uploading' && (
            <div className="mt-1">
              <ProgressBar value={uploadFile.progress} size="sm" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isUploading && !uploadSession && (
            <button
              onClick={() => removeFile(index)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          {uploadFile?.status === 'uploading' && (
            <Loader2 className="w-5 h-5 text-wedd-mint animate-spin" />
          )}
          {uploadFile?.status === 'processing' && (
            <Loader2 className="w-5 h-5 text-wedd-black animate-spin" />
          )}
          {uploadFile?.status === 'completed' && (
            <Check className="w-5 h-5 text-wedd-mint" />
          )}
          {uploadFile?.status === 'failed' && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
    );
  };

  // Calculate totals
  const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importer des Documents" size="lg">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-wedd-cream rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('manual')}
          disabled={isUploading}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-white text-wedd-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="w-4 h-4" />
          Manuel
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          disabled={isUploading}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'ai'
              ? 'bg-white text-wedd-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              Categorie de destination
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isUploading}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-black disabled:opacity-50"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-wedd-mint transition-colors ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Glissez-deposez vos fichiers ici
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Max {formatBytes(UPLOAD_CONFIG.maxSingleFileSize)} par fichier
            </p>
            <label className="btn-primary px-4 py-2 rounded-lg cursor-pointer text-sm">
              Parcourir
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                accept={UPLOAD_CONFIG.allowedExtensions.join(',')}
              />
            </label>
          </div>
        </div>
      )}

      {/* AI tab content */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-wedd-mint/10 border border-wedd-mint/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-wedd-mint-dark flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-wedd-black">Classement automatique par IA</p>
                <p className="text-xs text-gray-600 mt-1">
                  L&apos;IA analysera vos documents et les classera automatiquement dans les bonnes categories.
                </p>
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-wedd-black transition-colors ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <Sparkles className="w-12 h-12 mx-auto text-wedd-black mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Deposez plusieurs fichiers pour un classement automatique
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Max {formatBytes(UPLOAD_CONFIG.maxSingleFileSize)} par fichier
            </p>
            <label className="bg-wedd-black text-white px-4 py-2 rounded-lg cursor-pointer text-sm inline-block hover:bg-purple-700 transition-colors">
              Selectionner des fichiers
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                accept={UPLOAD_CONFIG.allowedExtensions.join(',')}
              />
            </label>
          </div>
        </div>
      )}

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">
              Fichiers ({selectedFiles.length}) - {formatBytes(totalSize)}
            </h4>
          </div>

          {/* Overall progress during upload */}
          {isUploading && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span>Progression totale</span>
                <span>{overallProgress}%</span>
              </div>
              <ProgressBar value={overallProgress} size="md" />
            </div>
          )}

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => renderFileStatus(file, index))}
          </div>
        </div>
      )}

      {/* Upload summary */}
      {uploadSession && !isUploading && (
        <div className={`mt-4 p-4 rounded-lg ${
          uploadSession.failedFiles > 0 ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <div className="flex items-center gap-2">
            {uploadSession.failedFiles > 0 ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <Check className="w-5 h-5 text-green-500" />
            )}
            <span className="font-medium">
              {uploadSession.completedFiles} fichier(s) importe(s) avec succes
              {uploadSession.failedFiles > 0 && `, ${uploadSession.failedFiles} echec(s)`}
            </span>
          </div>
        </div>
      )}

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          {uploadSession ? 'Fermer' : 'Annuler'}
        </Button>
        {!uploadSession && (
          <Button
            onClick={startUpload}
            disabled={selectedFiles.length === 0 || isUploading || (activeTab === 'manual' && !selectedCategory)}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              `Importer ${selectedFiles.length} fichier(s)`
            )}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
