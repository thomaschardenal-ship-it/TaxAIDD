'use client';

import React, { useState, useMemo } from 'react';
import { Download, Mail, FileText, FileIcon, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { IRLItem, DocumentStatus, DomainType } from '@/types';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { DocumentStatusBadge } from '@/components/ui/Badge';

interface IRLModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: IRLItem[];
  projectName: string;
  projectId?: string;
  filterDomain?: DomainType | null;
}

export default function IRLModal({ isOpen, onClose, items, projectName, projectId, filterDomain }: IRLModalProps) {
  // Filter items by domain if specified
  const filteredItems = useMemo(() => {
    if (!filterDomain) return items;
    return items.filter(item => item.category === filterDomain);
  }, [items, filterDomain]);

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(filteredItems.map((_, i) => `${i}`)));
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');

  // Reset selection when items change
  React.useEffect(() => {
    setSelectedItems(new Set(filteredItems.map((_, i) => `${i}`)));
  }, [filteredItems]);

  const groupedItems = filteredItems.reduce((acc, item, index) => {
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
    setSelectedItems(new Set(filteredItems.map((_, i) => `${i}`)));
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

  const modalTitle = filterDomain
    ? `IRL - ${filterDomain}`
    : 'Information Request List (IRL)';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="xl">
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
            <input
              type="text"
              value={`[WeDD] Information Request List${filterDomain ? ` - ${filterDomain}` : ''} - ${projectName}`}
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
L'équipe WeDD Advisory`}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-mint"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>PJ: IRL_{projectName.replace(/\s+/g, '_')}{filterDomain ? `_${filterDomain}` : ''}.pdf</span>
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
          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedItems.size} / {filteredItems.length} sélectionnés
              </span>
              <button onClick={selectAll} className="text-sm text-wedd-mint hover:underline">
                Tout sélectionner
              </button>
              <button onClick={selectNone} className="text-sm text-wedd-mint hover:underline">
                Désélectionner
              </button>
            </div>
            {projectId && (
              <Link href={`/project/${projectId}/folder`}>
                <Button variant="outline" size="sm" icon={<FolderOpen className="w-4 h-4" />}>
                  Ouvrir dans Dossier
                </Button>
              </Link>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun document manquant ou en attente{filterDomain ? ` pour ${filterDomain}` : ''}
            </div>
          ) : (
            <>
              {/* Items table */}
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-wedd-cream sticky top-0">
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
                              selectedItems.has(`${item.index}`) ? 'bg-wedd-mint/5' : ''
                            }`}
                          >
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={selectedItems.has(`${item.index}`)}
                                onChange={() => toggleItem(`${item.index}`)}
                                className="w-4 h-4 accent-wedd-mint"
                              />
                            </td>
                            <td className="px-3 py-2 text-sm">
                              {idx === 0 && (
                                <span className="font-medium text-wedd-black">{category}</span>
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
                  Fermer
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
        </>
      )}
    </Modal>
  );
}
