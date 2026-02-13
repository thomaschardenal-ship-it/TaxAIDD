'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Check, FileSignature } from 'lucide-react';
import { DomainType } from '@/types';
import { opportunities } from '@/data/pipeline';
import { users } from '@/data';
import { cvProfiles, scopeTemplates } from '@/data/resources';
import { WEDD_COMPANY } from '@/data/contracts';
import { useContracts } from '@/context/ContractsContext';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ContractGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const domainOptions: { value: DomainType; label: string; color: string }[] = [
  { value: 'TAX', label: 'Fiscal', color: '#6B00E0' },
  { value: 'Social', label: 'Social', color: '#00D4AA' },
  { value: 'Corporate', label: 'Corporate', color: '#0033A0' },
  { value: 'IP/IT', label: 'IP/IT', color: '#E91E8C' },
];

const userDomainMap: Record<string, DomainType> = {
  'user-1': 'TAX',
  'user-2': 'TAX',
  'user-3': 'TAX',
  'user-4': 'Social',
  'user-5': 'Corporate',
  'user-6': 'IP/IT',
};

const domainInternalBudget: Record<DomainType, number> = {
  'TAX': 12000,
  'Social': 10000,
  'Corporate': 8000,
  'IP/IT': 6000,
};

export default function ContractGenerationModal({ isOpen, onClose }: ContractGenerationModalProps) {
  const { addContract } = useContracts();
  const [step, setStep] = useState(1);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState('');
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>([]);

  const activeOpportunities = useMemo(() =>
    opportunities.filter(o => o.stage !== 'terminee'),
    []
  );

  const selectedOpportunity = useMemo(() =>
    opportunities.find(o => o.id === selectedOpportunityId),
    [selectedOpportunityId]
  );

  const availableSpecialists = useMemo(() => {
    if (!selectedOpportunity) return [];
    const teamUserIds = selectedOpportunity.teamIds || [];
    const allIds = Array.from(new Set([selectedOpportunity.responsibleId, ...teamUserIds]));
    return allIds
      .map(id => {
        const user = users.find(u => u.id === id);
        const domain = userDomainMap[id];
        if (!user || !domain || !selectedOpportunity.domains.includes(domain)) return null;
        return { user, domain };
      })
      .filter(Boolean) as { user: typeof users[0]; domain: DomainType }[];
  }, [selectedOpportunity]);

  const toggleSpecialist = (userId: string) => {
    setSelectedSpecialists(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleGenerate = () => {
    if (!selectedOpportunity) return;

    selectedSpecialists.forEach(userId => {
      const user = users.find(u => u.id === userId);
      const domain = userDomainMap[userId];
      const cv = cvProfiles.find(c => c.userId === userId);
      const template = scopeTemplates.find(t => t.domain === domain);

      if (!user || !domain) return;

      const estimatedDays = template?.estimatedDays || 10;
      const totalAmount = domainInternalBudget[domain] || 8000;

      addContract({
        opportunityId: selectedOpportunity.id,
        opportunityName: selectedOpportunity.name,
        specialistId: userId,
        specialistName: user.name,
        domain,
        status: 'brouillon',
        parties: {
          wedd: WEDD_COMPANY,
          specialist: {
            name: user.name,
            title: user.title,
            email: user.email,
            specialty: cv?.specialty || domain,
          },
        },
        scope: template?.sections || [],
        timeline: {
          startDate: selectedOpportunity.expectedCloseDate,
          endDate: '',
          estimatedDays,
        },
        budget: {
          dailyRate: Math.round(totalAmount / estimatedDays),
          totalDays: estimatedDays,
          totalAmount,
        },
        confidentiality: {
          duration: '24 mois',
          penaltyClause: true,
        },
      });
    });

    handleReset();
    onClose();
  };

  const handleReset = () => {
    setStep(1);
    setSelectedOpportunityId('');
    setSelectedSpecialists([]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Générer des contrats de sous-traitance" size="lg">
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-6 gap-2">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
              step > s ? 'bg-wedd-mint text-white' : step === s ? 'bg-wedd-mint text-wedd-black' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s ? <Check className="w-3.5 h-3.5" /> : s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-wedd-mint' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select opportunity */}
      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Sélectionner une opportunité</label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activeOpportunities.map(opp => (
              <button
                key={opp.id}
                onClick={() => { setSelectedOpportunityId(opp.id); setSelectedSpecialists([]); }}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedOpportunityId === opp.id
                    ? 'border-wedd-mint bg-wedd-mint/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-sm">{opp.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {opp.clientName} — {opp.domains.join(', ')} — {opp.estimatedValue.toLocaleString('fr-FR')} €
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select specialists */}
      {step === 2 && selectedOpportunity && (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-sm">{selectedOpportunity.name}</p>
            <p className="text-xs text-gray-500">{selectedOpportunity.domains.join(', ')}</p>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Sélectionner les intervenants ({selectedSpecialists.length} sélectionné{selectedSpecialists.length > 1 ? 's' : ''})
          </label>

          {availableSpecialists.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucun intervenant disponible. Vérifiez que l&apos;équipe est assignée à l&apos;opportunité.</p>
          ) : (
            <div className="space-y-2">
              {availableSpecialists.map(({ user, domain }) => {
                const domainColor = domainOptions.find(d => d.value === domain)?.color;
                const domainLabel = domainOptions.find(d => d.value === domain)?.label;
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSpecialists.includes(user.id) ? 'bg-wedd-mint/10 border border-wedd-mint' : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSpecialists.includes(user.id)}
                      onChange={() => toggleSpecialist(user.id)}
                      className="w-4 h-4 accent-wedd-mint"
                    />
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.title}</p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${domainColor}15`, color: domainColor }}
                    >
                      {domainLabel}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Preview & confirm */}
      {step === 3 && selectedOpportunity && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {selectedSpecialists.length} contrat{selectedSpecialists.length > 1 ? 's' : ''} sera{selectedSpecialists.length > 1 ? 'ont' : ''} généré{selectedSpecialists.length > 1 ? 's' : ''} :
          </p>
          <div className="space-y-3">
            {selectedSpecialists.map(userId => {
              const user = users.find(u => u.id === userId);
              const domain = userDomainMap[userId];
              const domainColor = domainOptions.find(d => d.value === domain)?.color;
              const domainLabel = domainOptions.find(d => d.value === domain)?.label;
              const template = scopeTemplates.find(t => t.domain === domain);
              const totalAmount = domainInternalBudget[domain] || 8000;

              return (
                <div key={userId} className="p-4 border border-gray-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSignature className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-sm">{user?.name}</span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${domainColor}15`, color: domainColor }}
                    >
                      {domainLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-400">Durée :</span> {template?.estimatedDays || 10} jours
                    </div>
                    <div>
                      <span className="text-gray-400">Budget :</span> {totalAmount.toLocaleString('fr-FR')} €
                    </div>
                    <div>
                      <span className="text-gray-400">Confidentialité :</span> 24 mois
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">Scope :</span> {template?.sections.length || 0} sections
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ModalFooter>
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)} icon={<ArrowLeft className="w-4 h-4" />}>
            Retour
          </Button>
        )}
        <Button variant="outline" onClick={handleClose}>Annuler</Button>
        {step < 3 ? (
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 ? !selectedOpportunityId : selectedSpecialists.length === 0}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            icon={<FileSignature className="w-4 h-4" />}
          >
            Générer {selectedSpecialists.length} contrat{selectedSpecialists.length > 1 ? 's' : ''}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
