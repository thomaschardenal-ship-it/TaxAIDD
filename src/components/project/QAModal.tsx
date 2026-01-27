'use client';

import React, { useState, useMemo } from 'react';
import { Download, Mail, FileText, FileIcon, CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react';
import { QAItem } from '@/types';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

type ResponseStatus = 'answered' | 'partial' | 'unanswered';

interface QAModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QAItem[];
  projectName: string;
}

const statusConfig: Record<ResponseStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  answered: { label: 'Répondu', color: 'text-green-700', bgColor: 'bg-green-100', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  partial: { label: 'Partiel', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  unanswered: { label: 'En attente', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: <Clock className="w-3.5 h-3.5" /> },
};

export default function QAModal({ isOpen, onClose, items, projectName }: QAModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set(items.map((_, i) => i)));
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResponseStatus | 'all'>('all');

  // Determine item status based on partialAnswer field
  const getItemStatus = (item: QAItem): ResponseStatus => {
    if (!item.partialAnswer) return 'unanswered';
    if (item.partialAnswer.length > 50) return 'answered';
    return 'partial';
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const answered = items.filter(i => getItemStatus(i) === 'answered').length;
    const partial = items.filter(i => getItemStatus(i) === 'partial').length;
    const unanswered = items.filter(i => getItemStatus(i) === 'unanswered').length;
    return { answered, partial, unanswered };
  }, [items]);

  // Filter items based on status
  const filteredItems = useMemo(() => {
    if (statusFilter === 'all') return items;
    return items.filter(item => getItemStatus(item) === statusFilter);
  }, [items, statusFilter]);

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
              value={`[TaxAIDD] Questions & Réponses - ${projectName}`}
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
L'équipe TaxAIDD Advisory`}
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
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.answered}</div>
              <div className="text-xs text-green-600">Répondus</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-700">{stats.partial}</div>
              <div className="text-xs text-amber-600">Partiels</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-700">{stats.unanswered}</div>
              <div className="text-xs text-gray-600">En attente</div>
            </div>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex gap-1">
              {(['all', 'answered', 'partial', 'unanswered'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === status
                      ? 'bg-taxaidd-purple text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tous' : statusConfig[status].label}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <span className="text-sm text-gray-600">
              {selectedItems.size} / {items.length} sélectionnés
            </span>
            <button onClick={selectAll} className="text-sm text-taxaidd-purple hover:underline">
              Tout
            </button>
            <button onClick={selectNone} className="text-sm text-taxaidd-purple hover:underline">
              Aucun
            </button>
          </div>

          {/* Items table */}
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-taxaidd-gray-light sticky top-0">
                <tr>
                  <th className="w-10 px-3 py-2"></th>
                  <th className="text-left px-3 py-2 text-sm font-semibold">Question</th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-24">Source</th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-24">Statut</th>
                  <th className="text-left px-3 py-2 text-sm font-semibold w-40">Réponse</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => {
                  const originalIndex = items.indexOf(item);
                  const status = getItemStatus(item);
                  const config = statusConfig[status];
                  return (
                    <tr
                      key={originalIndex}
                      className={`border-b border-gray-50 ${
                        selectedItems.has(originalIndex) ? 'bg-taxaidd-yellow/5' : ''
                      }`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(originalIndex)}
                          onChange={() => toggleItem(originalIndex)}
                          className="w-4 h-4 accent-taxaidd-yellow"
                        />
                      </td>
                      <td className="px-3 py-3 text-sm">{item.question}</td>
                      <td className="px-3 py-3 text-sm text-gray-500">{item.source}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-500 italic truncate max-w-[160px]" title={item.partialAnswer || ''}>
                        {item.partialAnswer || '-'}
                      </td>
                    </tr>
                  );
                })}
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
