'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { DomainType } from '@/types';
import { clients, users } from '@/data';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

export interface ProjectFormData {
  name: string;
  clientId: string;
  type: string;
  startDate: string;
  endDate: string;
  domains: DomainType[];
  responsibleId: string;
  teamIds: string[];
}

const steps = [
  { id: 1, title: 'Infos générales' },
  { id: 2, title: 'Périmètre' },
  { id: 3, title: 'Équipe' },
];

const domainOptions: { value: DomainType; label: string; color: string }[] = [
  { value: 'TAX', label: 'TAX (Fiscalité)', color: '#6B00E0' },
  { value: 'Social', label: 'Social', color: '#00D4AA' },
  { value: 'Corporate', label: 'Corporate', color: '#0033A0' },
  { value: 'IP/IT', label: 'IP/IT', color: '#E91E8C' },
];

const missionTypes = [
  'Due Diligence Acquisition',
  'Due Diligence Cession',
  'Audit Fiscal',
  'Audit Social',
  'Restructuration',
];

export default function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    clientId: '',
    type: '',
    startDate: '',
    endDate: '',
    domains: [],
    responsibleId: '',
    teamIds: [],
  });

  const handleChange = (field: keyof ProjectFormData, value: string | string[] | DomainType[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDomain = (domain: DomainType) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  const toggleTeamMember = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      teamIds: prev.teamIds.includes(userId)
        ? prev.teamIds.filter(id => id !== userId)
        : [...prev.teamIds, userId],
    }));
  };

  const handleSubmit = () => {
    console.log('[NewProjectModal] Submitting:', formData);
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      name: '',
      clientId: '',
      type: '',
      startDate: '',
      endDate: '',
      domains: [],
      responsibleId: '',
      teamIds: [],
    });
    setCurrentStep(1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.clientId && formData.type && formData.startDate && formData.endDate;
      case 2:
        return formData.domains.length > 0;
      case 3:
        return formData.responsibleId;
      default:
        return false;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau Dossier" size="lg">
      {/* Steps indicator */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep > step.id
                    ? 'bg-omni-mint text-white'
                    : currentStep === step.id
                    ? 'bg-omni-yellow text-omni-black'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className={`ml-2 text-sm ${currentStep === step.id ? 'font-medium text-omni-black' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-3 ${currentStep > step.id ? 'bg-omni-mint' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: General Info */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du dossier *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Acquisition TechVision SAS"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-omni-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <select
              value={formData.clientId}
              onChange={(e) => handleChange('clientId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-omni-purple"
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de mission *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-omni-purple"
            >
              <option value="">Sélectionner un type</option>
              {missionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-omni-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-omni-purple"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Scope */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Domaines d&apos;intervention *</label>
            <div className="grid grid-cols-2 gap-3">
              {domainOptions.map(domain => (
                <button
                  key={domain.value}
                  onClick={() => toggleDomain(domain.value)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${formData.domains.includes(domain.value)
                      ? 'border-omni-yellow bg-omni-yellow/10'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: domain.color }}
                    />
                    <span className="font-medium">{domain.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Team */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
            <select
              value={formData.responsibleId}
              onChange={(e) => handleChange('responsibleId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-omni-purple"
            >
              <option value="">Sélectionner un responsable</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} - {user.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Membres de l&apos;équipe</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.filter(u => u.id !== formData.responsibleId).map(user => (
                <label
                  key={user.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                    ${formData.teamIds.includes(user.id) ? 'bg-omni-yellow/10' : 'hover:bg-gray-50'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.teamIds.includes(user.id)}
                    onChange={() => toggleTeamMember(user.id)}
                    className="w-4 h-4 accent-omni-yellow"
                  />
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.title}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <ModalFooter>
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            icon={<Check className="w-4 h-4" />}
          >
            Créer
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
