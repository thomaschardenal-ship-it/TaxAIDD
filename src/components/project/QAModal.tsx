'use client';

import React, { useState } from 'react';
import { Download, Mail, FileText, FileIcon } from 'lucide-react';
import { QAItem } from '@/types';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface QAModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QAItem[];
  projectName: string;
}

export default function QAModal({ isOpen, onClose, items, projectName }: QAModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set(items.map((_, i) => i)));
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');

  const toggleItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    setSelectedItems(new Set(items.map((_, i) => i)));
  };

  const selectNone = () => {
    setSelectedItems(new Set());
  };

  const handleDownload = (format: 'pdf' | 'word') => {
    console.log(`[Q&A] Downloading as ${format}:`, selectedItems.size, 'items');
    alert(`Q&A téléchargé en format ${format.toUpperCase()} (${selectedItems.size} questions)`);
  };

  const handleSendEmail = () => {
    console.log('[Q&A] Sending email to:', email);
    alert(`Q&A envoyé à ${email}`);
    setShowEmailForm(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Questions & Réponses (Q&A)" size="xl">
      {showEmailForm ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Envoyer les {selectedItems.size} questions au client.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">À</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
            <input
              type="text"
              value={`[OMNI] Questions & Réponses - ${projectName}`}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows={6}
              defaultValue={`Madame, Monsieur,

Suite à notre analyse préliminaire, nous aurions besoin de clarifications sur certains points. Vous trouverez ci-joint la liste de nos questions.

Merci de nous faire parvenir vos réponses dans les meilleurs délais.

Bien cordialement,
L'équipe OMNI Advisory`}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>PJ: QA_{projectName.replace(/\s+/g, '_')}.pdf</span>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setShowEmailForm(false)}>
              Retour
            </Button>
            <Button onClick={handleSendEmail} disabled={!email} icon={<Mail className="w-4 h-4" />}>
              Envoyer
            </Button>
          </ModalFooter>
        </div>
      ) : (
        <>
          {/* Selection controls */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-600">
              {selectedItems.size} / {items.length} sélectionnés
            </span>
            <button onClick={selectAll} className="text-sm text-taxaidd-purple hover:underline">
              Tout sélectionner
            </button>
            <button onClick={selectNone} className="text-sm text-taxaidd-purple hover:underline">
              Désélectionner
            </button>
          </div>

          {/* Items table */}
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-taxaidd-gray-light sticky top-0">
                <tr>
                  <th className="w-10 px-3 py-2"></th>
                  <th className="text-left px-3 py-2 text-sm font-semibold">Question</th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-32">Source</th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-48">Réponse partielle</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-50 ${
                      selectedItems.has(index) ? 'bg-taxaidd-yellow/5' : ''
                    }`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(index)}
                        onChange={() => toggleItem(index)}
                        className="w-4 h-4 accent-taxaidd-yellow"
                      />
                    </td>
                    <td className="px-3 py-3 text-sm">{item.question}</td>
                    <td className="px-3 py-3 text-sm text-gray-500">{item.source}</td>
                    <td className="px-3 py-3 text-sm text-gray-500 italic">
                      {item.partialAnswer || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownload('pdf')}
              icon={<Download className="w-4 h-4" />}
              disabled={selectedItems.size === 0}
            >
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownload('word')}
              icon={<FileIcon className="w-4 h-4" />}
              disabled={selectedItems.size === 0}
            >
              Word
            </Button>
            <Button
              onClick={() => setShowEmailForm(true)}
              icon={<Mail className="w-4 h-4" />}
              disabled={selectedItems.size === 0}
            >
              Envoyer par email
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
