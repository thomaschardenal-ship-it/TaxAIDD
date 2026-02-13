'use client';

import React from 'react';
import { FileSignature, Calendar, Euro, Shield, Download } from 'lucide-react';
import { SubcontractingContract, ContractStatus, DomainType } from '@/types';
import { contractArticles } from '@/data/contracts';
import { useContracts } from '@/context/ContractsContext';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ContractPreviewModalProps {
  contract: SubcontractingContract | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions: { value: ContractStatus; label: string; color: string }[] = [
  { value: 'brouillon', label: 'Brouillon', color: 'text-gray-600 bg-gray-100' },
  { value: 'en-revision', label: 'En révision', color: 'text-amber-600 bg-amber-50' },
  { value: 'valide', label: 'Validé', color: 'text-emerald-600 bg-emerald-50' },
  { value: 'signe', label: 'Signé', color: 'text-blue-600 bg-blue-50' },
];

const domainColors: Record<DomainType, string> = {
  'TAX': '#6B00E0',
  'Social': '#00D4AA',
  'Corporate': '#0033A0',
  'IP/IT': '#E91E8C',
};

export default function ContractPreviewModal({ contract, isOpen, onClose }: ContractPreviewModalProps) {
  const { updateContractStatus } = useContracts();

  if (!contract) return null;

  const domainColor = domainColors[contract.domain];

  const getArticleContent = (articleId: string): string => {
    const article = contractArticles.find(a => a.id === articleId);
    if (!article) return '';

    switch (articleId) {
      case 'art-2':
        return `Le Sous-Traitant intervient sur le domaine ${contract.domain} dans le cadre de la mission "${contract.opportunityName}". Le périmètre détaillé comprend :\n${contract.scope.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}`;
      case 'art-3':
        return `La mission débute le ${contract.timeline.startDate} pour une durée estimée de ${contract.timeline.estimatedDays} jours ouvrés.${contract.timeline.endDate ? ` La date de fin prévisionnelle est le ${contract.timeline.endDate}.` : ''}`;
      case 'art-4':
        return `Le Sous-Traitant percevra une rémunération de ${contract.budget.dailyRate.toLocaleString('fr-FR')} € HT par jour, soit un montant total estimé de ${contract.budget.totalAmount.toLocaleString('fr-FR')} € HT pour ${contract.budget.totalDays} jours d'intervention.`;
      default:
        return article.content;
    }
  };

  const handleStatusChange = (newStatus: ContractStatus) => {
    updateContractStatus(contract.id, newStatus);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contrat de sous-traitance" size="xl">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6">
          <div className="w-12 h-12 bg-wedd-mint rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="font-bold text-wedd-black text-lg font-display">W</span>
          </div>
          <h2 className="text-xl font-bold text-wedd-black">CONTRAT DE SOUS-TRAITANCE</h2>
          <p className="text-sm text-gray-500 mt-1">Réf: {contract.id.toUpperCase()}</p>
          <div className="mt-3">
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${domainColor}15`, color: domainColor }}
            >
              {contract.domain}
            </span>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Donneur d&apos;ordre</h4>
            <p className="font-medium text-sm">{contract.parties.wedd.name}</p>
            <p className="text-xs text-gray-500">{contract.parties.wedd.address}</p>
            <p className="text-xs text-gray-500">SIREN : {contract.parties.wedd.siren}</p>
            <p className="text-xs text-gray-500 mt-1">Représenté par : {contract.parties.wedd.representedBy}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Sous-traitant</h4>
            <p className="font-medium text-sm">{contract.parties.specialist.name}</p>
            <p className="text-xs text-gray-500">{contract.parties.specialist.title}</p>
            <p className="text-xs text-gray-500">{contract.parties.specialist.email}</p>
            <p className="text-xs text-gray-500 mt-1">Spécialité : {contract.parties.specialist.specialty}</p>
          </div>
        </div>

        {/* Mission reference */}
        <div className="flex items-center gap-4 p-3 bg-wedd-mint/5 border border-wedd-mint/20 rounded-lg text-sm">
          <FileSignature className="w-5 h-5 text-wedd-mint flex-shrink-0" />
          <div>
            <span className="text-gray-500">Mission :</span>{' '}
            <span className="font-medium">{contract.opportunityName}</span>
          </div>
        </div>

        {/* Key info summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Durée</p>
              <p className="text-sm font-medium">{contract.timeline.estimatedDays} jours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <Euro className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="text-sm font-medium">{contract.budget.totalAmount.toLocaleString('fr-FR')} €</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
            <Shield className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Confidentialité</p>
              <p className="text-sm font-medium">{contract.confidentiality.duration}</p>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {contractArticles.map(article => (
            <div key={article.id} className="border-b border-gray-100 pb-4">
              <h4 className="font-medium text-sm text-wedd-black mb-2">
                {article.id.replace('art-', 'Article ')} — {article.title}
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {getArticleContent(article.id)}
              </p>
            </div>
          ))}
        </div>

        {/* Status change */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Modifier le statut</label>
          <div className="flex gap-2">
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  contract.status === opt.value
                    ? `${opt.color} ring-2 ring-offset-1 ring-current`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Fermer</Button>
        <Button
          variant="outline"
          onClick={() => alert('Téléchargement du contrat (fonctionnalité à venir)')}
          icon={<Download className="w-4 h-4" />}
        >
          Télécharger PDF
        </Button>
      </ModalFooter>
    </Modal>
  );
}
