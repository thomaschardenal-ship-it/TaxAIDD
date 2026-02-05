'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plus, Building2 } from 'lucide-react';
import { DomainType } from '@/types';
import { users } from '@/data';
import { useClients } from '@/context/ClientsContext';
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
  { id: 1, title: 'Infos generales' },
  { id: 2, title: 'Perimetre' },
  { id: 3, title: 'Equipe' },
];

const domainOptions: { value: DomainType; label: string; color: string }[] = [
  { value: 'TAX', label: 'Fiscal', color: '#6B00E0' },
  { value: 'Social', label: 'Social', color: '#00D4AA' },
  { value: 'Corporate', label: 'Corporate', color: '#0033A0' },
  { value: 'IP/IT', label: 'IP/IT', color: '#E91E8C' },
];

const industries = [
  'Technologies',
  'Services',
  'Industrie',
  'Finance',
  'Sante',
  'Commerce',
  'Immobilier',
  'Autre',
];

const missionTypes = [
  'Due Diligence Acquisition',
  'Due Diligence Cession',
  'Audit Fiscal',
  'Audit Social',
  'Restructuration',
];

export default function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const { clients, addClient } = useClients();
  const [currentStep, setCurrentStep] = useState(1);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientData, setNewClientData] = useState({ name: '', industry: '' });
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

  const handleCreateClient = () => {
    if (newClientData.name && newClientData.industry) {
      const createdClient = addClient({
        name: newClientData.name,
        industry: newClientData.industry,
      });
      setFormData(prev => ({ ...prev, clientId: createdClient.id }));
      setNewClientData({ name: '', industry: '' });
      setShowNewClientForm(false);
    }
  };

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
                    ? 'bg-taxaidd-mint text-white'
                    : currentStep === step.id
                    ? 'bg-taxaidd-yellow text-taxaidd-black'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className={`ml-2 text-sm ${currentStep === step.id ? 'font-medium text-taxaidd-black' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-3 ${currentStep > step.id ? 'bg-taxaidd-mint' : 'bg-gray-200'}`} />
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
            {!showNewClientForm ? (
              <>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
                  {clients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => handleChange('clientId', client.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                        formData.clientId === client.id
                          ? 'border-taxaidd-yellow bg-taxaidd-yellow/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: client.color }}
                      >
                        {client.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.industry}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowNewClientForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-taxaidd-purple hover:text-taxaidd-purple transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Creer un nouveau client</span>
                </button>
              </>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>Nouveau client</span>
                </div>
                <input
                  type="text"
                  value={newClientData.name}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du client"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                />
                <select
                  value={newClientData.industry}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
                >
                  <option value="">Selectionner un secteur</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewClientForm(false)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateClient}
                    disabled={!newClientData.name || !newClientData.industry}
                    className="flex-1 px-3 py-2 text-sm bg-taxaidd-yellow text-taxaidd-black rounded-lg hover:bg-taxaidd-yellow-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Creer
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de mission *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            >
              <option value="">Selectionner un type</option>
              {missionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de debut *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
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
                      ? 'border-taxaidd-yellow bg-taxaidd-yellow/10'
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            >
              <option value="">Selectionner un responsable</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} - {user.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Membres de l&apos;equipe</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {users.filter(u => u.id !== formData.responsibleId).map(user => (
                <label
                  key={user.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                    ${formData.teamIds.includes(user.id) ? 'bg-taxaidd-yellow/10' : 'hover:bg-gray-50'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.teamIds.includes(user.id)}
                    onChange={() => toggleTeamMember(user.id)}
                    className="w-4 h-4 accent-taxaidd-yellow"
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
            Creer
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
