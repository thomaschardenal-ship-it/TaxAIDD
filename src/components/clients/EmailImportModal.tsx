'use client';

import React, { useState } from 'react';
import { Search, Mail, User, Star, Trash2, Building2 } from 'lucide-react';
import { Client, ClientContact } from '@/types';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface EmailImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (client: Omit<Client, 'id' | 'initials' | 'color'>) => void;
}

interface ParsedData {
  companyName: string;
  companyDomain: string;
  contacts: Partial<ClientContact>[];
}

function parseEmailContent(rawText: string): ParsedData {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const emails = Array.from(new Set(rawText.match(emailRegex) || []));

  if (emails.length === 0) {
    return { companyName: '', companyDomain: '', contacts: [] };
  }

  const domain = emails[0].split('@')[1];
  const companyDomain = domain;

  // Infer company name from domain
  const companyName = domain
    .split('.')[0]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const contacts: Partial<ClientContact>[] = emails.map((email, i) => {
    const localPart = email.split('@')[0];
    const nameParts = localPart.split(/[._-]/);
    const name = nameParts
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');

    return {
      name,
      email,
      role: '',
      isPrimary: i === 0,
    };
  });

  return { companyName, companyDomain, contacts };
}

export default function EmailImportModal({ isOpen, onClose, onImport }: EmailImportModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [rawInput, setRawInput] = useState('');
  const [parsed, setParsed] = useState<ParsedData | null>(null);

  // Review form state
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [contacts, setContacts] = useState<Partial<ClientContact>[]>([]);

  const handleParse = () => {
    const result = parseEmailContent(rawInput);
    if (result.contacts.length === 0) return;
    setParsed(result);
    setClientName(result.companyName);
    setWebsite(`https://${result.companyDomain}`);
    setContacts(result.contacts);
    setStep(2);
  };

  const handleImport = () => {
    const validContacts: ClientContact[] = contacts
      .filter(c => c.name && c.email)
      .map((c, i) => ({
        id: `contact-import-${Date.now()}-${i}`,
        name: c.name!,
        email: c.email!,
        phone: c.phone,
        role: c.role || 'Contact',
        isPrimary: c.isPrimary,
      }));

    onImport({
      name: clientName,
      industry: industry || 'Autre',
      website,
      contacts: validContacts,
    });
    handleReset();
  };

  const handleReset = () => {
    setStep(1);
    setRawInput('');
    setParsed(null);
    setClientName('');
    setIndustry('');
    setWebsite('');
    setContacts([]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const updateContact = (index: number, field: string, value: string | boolean) => {
    setContacts(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const removeContact = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const togglePrimary = (index: number) => {
    setContacts(prev => prev.map((c, i) => ({ ...c, isPrimary: i === index })));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import par email" size="lg">
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Collez le contenu d&apos;un email ou une liste d&apos;adresses email. Le système extraira automatiquement les contacts et le nom de la société.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenu email ou adresses
            </label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              rows={8}
              placeholder={"Collez ici le contenu d'un email ou une liste d'adresses...\n\nExemples :\njean.dupont@societe.fr\nmarie.martin@societe.fr\n\nOu un texte contenant des adresses email..."}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint text-sm font-mono"
            />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              onClick={handleParse}
              disabled={!rawInput.trim()}
              icon={<Search className="w-4 h-4" />}
            >
              Analyser
            </Button>
          </ModalFooter>
        </div>
      )}

      {step === 2 && parsed && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-wedd-mint/10 rounded-lg text-sm">
            <Mail className="w-4 h-4 text-wedd-mint" />
            <span>{contacts.length} contact{contacts.length > 1 ? 's' : ''} détecté{contacts.length > 1 ? 's' : ''} depuis <strong>{parsed.companyDomain}</strong></span>
          </div>

          {/* Company info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
              >
                <option value="">Sélectionner un secteur</option>
                {['Technologies', 'Services', 'Industrie', 'Finance', 'Santé / Pharma', 'Commerce', 'Immobilier', 'Énergie', 'Autre'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
            />
          </div>

          {/* Contacts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contacts ({contacts.length})
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {contacts.map((contact, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePrimary(index)}
                        className={`p-1 rounded ${contact.isPrimary ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                        title="Contact principal"
                      >
                        <Star className={`w-4 h-4 ${contact.isPrimary ? 'fill-yellow-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => removeContact(index)}
                        className="p-1 text-red-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={contact.name || ''}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      placeholder="Nom *"
                      className="px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-wedd-mint"
                    />
                    <input
                      type="text"
                      value={contact.role || ''}
                      onChange={(e) => updateContact(index, 'role', e.target.value)}
                      placeholder="Fonction"
                      className="px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-wedd-mint"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              onClick={handleImport}
              disabled={!clientName}
              icon={<Building2 className="w-4 h-4" />}
            >
              Créer le client
            </Button>
          </ModalFooter>
        </div>
      )}
    </Modal>
  );
}
