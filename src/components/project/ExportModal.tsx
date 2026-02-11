'use client';

import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Presentation, Check, Download, Settings2 } from 'lucide-react';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { DomainType } from '@/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

type ExportFormat = 'pdf' | 'word' | 'powerpoint';

interface ExportConfig {
  format: ExportFormat;
  domains: DomainType[];
  includeExecutiveSummary: boolean;
  includeAppendices: boolean;
  includeSourceReferences: boolean;
}

const formatOptions: { value: ExportFormat; label: string; icon: React.ElementType; description: string }[] = [
  { value: 'pdf', label: 'PDF', icon: FileText, description: 'Document PDF haute qualité' },
  { value: 'word', label: 'Word', icon: FileSpreadsheet, description: 'Document éditable (.docx)' },
  { value: 'powerpoint', label: 'PowerPoint', icon: Presentation, description: 'Présentation (.pptx)' },
];

const domainOptions: { value: DomainType; label: string; color: string }[] = [
  { value: 'TAX', label: 'Fiscal', color: '#6B00E0' },
  { value: 'Social', label: 'Social', color: '#00D4AA' },
  { value: 'Corporate', label: 'Corporate', color: '#0033A0' },
  { value: 'IP/IT', label: 'IP/IT', color: '#E91E8C' },
];

export default function ExportModal({ isOpen, onClose, projectName }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [config, setConfig] = useState<ExportConfig>({
    format: 'powerpoint',
    domains: ['TAX', 'Social', 'Corporate', 'IP/IT'],
    includeExecutiveSummary: true,
    includeAppendices: true,
    includeSourceReferences: true,
  });

  const toggleDomain = (domain: DomainType) => {
    setConfig(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulation de l'export
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsExporting(false);
    setExportComplete(true);
  };

  const handleClose = () => {
    setExportComplete(false);
    onClose();
  };

  const handleDownload = () => {
    // Simulation du téléchargement
    const filename = `${projectName.replace(/\s+/g, '_')}_Rapport.${
      config.format === 'powerpoint' ? 'pptx' : config.format === 'word' ? 'docx' : 'pdf'
    }`;
    alert(`Téléchargement de ${filename}`);
    handleClose();
  };

  if (exportComplete) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Export terminé" size="md">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-wedd-black mb-2">Rapport généré avec succès</h3>
          <p className="text-gray-600 mb-6">
            Votre rapport {formatOptions.find(f => f.value === config.format)?.label} est prêt.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Contenu exporté :</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {config.domains.map(domain => {
                const opt = domainOptions.find(d => d.value === domain);
                return (
                  <span
                    key={domain}
                    className="px-3 py-1 text-sm rounded-full text-white"
                    style={{ backgroundColor: opt?.color }}
                  >
                    {opt?.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={handleClose}>Fermer</Button>
          <Button onClick={handleDownload} icon={<Download className="w-4 h-4" />}>
            Télécharger
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Exporter le Rapport" size="lg">
      <div className="space-y-6">
        {/* Format selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Format d&apos;export</label>
          <div className="grid grid-cols-3 gap-3">
            {formatOptions.map(format => {
              const Icon = format.icon;
              return (
                <button
                  key={format.value}
                  onClick={() => setConfig(prev => ({ ...prev, format: format.value }))}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    config.format === format.value
                      ? 'border-wedd-mint bg-wedd-mint/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    config.format === format.value ? 'text-wedd-mint-dark' : 'text-gray-400'
                  }`} />
                  <p className="font-medium text-sm">{format.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{format.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Domain selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Domaines à inclure</label>
          <div className="grid grid-cols-2 gap-3">
            {domainOptions.map(domain => (
              <button
                key={domain.value}
                onClick={() => toggleDomain(domain.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  config.domains.includes(domain.value)
                    ? 'border-wedd-mint bg-wedd-mint/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: domain.color }}
                  />
                  <span className="font-medium">{domain.label}</span>
                  {config.domains.includes(domain.value) && (
                    <Check className="w-4 h-4 text-wedd-mint ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Options</label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={config.includeExecutiveSummary}
                onChange={(e) => setConfig(prev => ({ ...prev, includeExecutiveSummary: e.target.checked }))}
                className="w-4 h-4 accent-wedd-mint"
              />
              <div>
                <p className="font-medium text-sm">Executive Summary</p>
                <p className="text-xs text-gray-500">Résumé exécutif en début de document</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={config.includeAppendices}
                onChange={(e) => setConfig(prev => ({ ...prev, includeAppendices: e.target.checked }))}
                className="w-4 h-4 accent-wedd-mint"
              />
              <div>
                <p className="font-medium text-sm">Annexes</p>
                <p className="text-xs text-gray-500">Tableaux détaillés et données complémentaires</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={config.includeSourceReferences}
                onChange={(e) => setConfig(prev => ({ ...prev, includeSourceReferences: e.target.checked }))}
                className="w-4 h-4 accent-wedd-mint"
              />
              <div>
                <p className="font-medium text-sm">Références sources</p>
                <p className="text-xs text-gray-500">Lien vers les documents sources pour chaque élément</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>Annuler</Button>
        <Button
          onClick={handleExport}
          disabled={config.domains.length === 0 || isExporting}
          icon={isExporting ? undefined : <Download className="w-4 h-4" />}
        >
          {isExporting ? 'Génération en cours...' : 'Générer le rapport'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
