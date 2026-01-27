'use client';

import React, { useState } from 'react';
import { Download, Mail, FileText, FileIcon, Check } from 'lucide-react';
import { IRLItem, DocumentStatus } from '@/types';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { DocumentStatusBadge } from '@/components/ui/Badge';

interface IRLModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: IRLItem[];
  projectName: string;
}

export default function IRLModal({ isOpen, onClose, items, projectName }: IRLModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map((_, i) => `${i}`)));
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');

  const groupedItems = items.reduce((acc, item, index) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push({ ...item, index });
    return acc;
  }, {} as Record<string, (IRLItem & { index: number })[]>);

  const toggleItem = (index: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    setSelectedItems(new Set(items.map((_, i) => `${i}`)));
  };

  const selectNone = () => {
    setSelectedItems(new Set());
  };

  const handleDownload = (format: 'pdf' | 'word') => {
    console.log(`[IRL] Downloading as ${format}:`, selectedItems.size, 'items');
    alert(`IRL téléchargée en format ${format.toUpperCase()} (${selectedItems.size} documents)`);
  };

  const handleSendEmail = () => {
    console.log('[IRL] Sending email to:', email);
    alert(`IRL envoyée à ${email}`);
    setShowEmailForm(false);
    onClose();
  };

  const statusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'received': return '✅';
      case 'pending': return '⏳';
      case 'missing': return '❌';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Information Request List (IRL)" size="xl">
      {showEmailForm ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Envoyer la liste des {selectedItems.size} documents manquants au client.
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
              value={`[OMNI] Information Request List - ${projectName}`}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows={6}
              defaultValue={`Madame, Monsieur,

Dans le cadre de notre mission de due diligence, nous vous prions de bien vouloir nous transmettre les documents listés en pièce jointe.

N'hésitez pas à revenir vers nous pour toute question.

Bien cordialement,
L'équipe OMNI Advisory`}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-taxaidd-purple"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>PJ: IRL_{projectName.replace(/\s+/g, '_')}.pdf</span>
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
                  <th className="text-left px-3 py-2 text-sm font-semibold">Catégorie</th>
                  <th className="text-left px-3 py-2 text-sm font-semibold">Document</th>
                  <th className="text-center px-3 py-2 text-sm font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <React.Fragment key={category}>
                    {categoryItems.map((item, idx) => (
                      <tr
                        key={item.index}
                        className={`border-b border-gray-50 ${
                          selectedItems.has(`${item.index}`) ? 'bg-taxaidd-yellow/5' : ''
                        }`}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(`${item.index}`)}
                            onChange={() => toggleItem(`${item.index}`)}
                            className="w-4 h-4 accent-taxaidd-yellow"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {idx === 0 && (
                            <span className="font-medium text-taxaidd-black">{category}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm">{item.document}</td>
                        <td className="px-3 py-2 text-center">
                          <DocumentStatusBadge status={item.status} showLabel />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
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
