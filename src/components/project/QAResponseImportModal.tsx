'use client';

import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface QAResponseImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

interface ImportedResponse {
  questionId: string;
  question: string;
  previousAnswer: string | null;
  newAnswer: string;
  status: 'new' | 'updated' | 'unchanged';
  impactedElements: string[];
}

const mockImportedResponses: ImportedResponse[] = [
  {
    questionId: 'Q-TAX-001',
    question: 'Confirmer l\'absence de contrôle fiscal en cours',
    previousAnswer: null,
    newAnswer: 'Aucun contrôle fiscal en cours. Le dernier contrôle date de 2021 et n\'a donné lieu à aucun redressement.',
    status: 'new',
    impactedElements: ['Risques fiscaux', 'Synthèse TAX'],
  },
  {
    questionId: 'Q-TAX-002',
    question: 'Justifier les écarts de TEI',
    previousAnswer: 'Information partielle reçue',
    newAnswer: 'Les écarts de TEI s\'expliquent par l\'activation du CIR (450k€ en N) et les déficits reportables utilisés.',
    status: 'updated',
    impactedElements: ['Tableau IS', 'Analyse TEI'],
  },
  {
    questionId: 'Q-SOC-001',
    question: 'Statut des contentieux sociaux',
    previousAnswer: null,
    newAnswer: '2 contentieux en cours : 1 licenciement contesté (provision 25k€), 1 harcèlement (provision 50k€).',
    status: 'new',
    impactedElements: ['Risques sociaux', 'Provisions'],
  },
];

export default function QAResponseImportModal({ isOpen, onClose, projectName }: QAResponseImportModalProps) {
  const [step, setStep] = useState<'upload' | 'review' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState<ImportedResponse[]>([]);
  const [selectedResponses, setSelectedResponses] = useState<Set<string>>(new Set());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setIsProcessing(true);
    // Simulation du traitement
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResponses(mockImportedResponses);
    setSelectedResponses(new Set(mockImportedResponses.map(r => r.questionId)));
    setIsProcessing(false);
    setStep('review');
  };

  const toggleResponse = (id: string) => {
    const newSelected = new Set(selectedResponses);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedResponses(newSelected);
  };

  const handleApply = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setStep('complete');
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setResponses([]);
    setSelectedResponses(new Set());
    onClose();
  };

  const getStatusBadge = (status: ImportedResponse['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Nouvelle</span>;
      case 'updated':
        return <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Mise à jour</span>;
      case 'unchanged':
        return <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Inchangée</span>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Réponses Q&A" size="lg">
      {step === 'upload' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Format attendu</p>
                <p className="text-sm text-blue-700 mt-1">
                  Fichier Excel ou CSV avec les colonnes : Code Question, Réponse
                </p>
              </div>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              file ? 'border-taxaidd-mint bg-taxaidd-mint/5' : 'border-gray-300 hover:border-taxaidd-purple'
            }`}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="qa-file-upload"
            />
            <label htmlFor="qa-file-upload" className="cursor-pointer">
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-taxaidd-mint/20 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-taxaidd-mint" />
                  </div>
                  <div>
                    <p className="font-medium text-taxaidd-black">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-taxaidd-black">Glissez votre fichier ici</p>
                    <p className="text-sm text-gray-500">ou cliquez pour sélectionner</p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {responses.length} réponses importées • {selectedResponses.size} sélectionnées
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-taxaidd-purple" />
              <span className="text-taxaidd-purple font-medium">Analyse IA des impacts</span>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3">
            {responses.map((response) => (
              <div
                key={response.questionId}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedResponses.has(response.questionId)
                    ? 'border-taxaidd-yellow bg-taxaidd-yellow/5'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedResponses.has(response.questionId)}
                    onChange={() => toggleResponse(response.questionId)}
                    className="mt-1 w-4 h-4 accent-taxaidd-yellow"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-500">{response.questionId}</span>
                      {getStatusBadge(response.status)}
                    </div>
                    <p className="font-medium text-sm text-taxaidd-black mb-2">{response.question}</p>

                    {response.previousAnswer && (
                      <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                        <p className="text-xs text-gray-500 mb-1">Réponse précédente :</p>
                        <p className="text-gray-600">{response.previousAnswer}</p>
                      </div>
                    )}

                    <div className="p-2 bg-green-50 rounded text-sm">
                      <p className="text-xs text-green-600 mb-1">Nouvelle réponse :</p>
                      <p className="text-green-800">{response.newAnswer}</p>
                    </div>

                    {response.impactedElements.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Éléments impactés :</span>
                        {response.impactedElements.map((el, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-taxaidd-purple/10 text-taxaidd-purple rounded">
                            {el}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Les éléments du rapport impactés seront mis à jour. Vous pourrez revoir et valider chaque modification.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-taxaidd-black mb-2">Import terminé</h3>
          <p className="text-gray-600 mb-4">
            {selectedResponses.size} réponses ont été intégrées au projet.
          </p>
          <p className="text-sm text-taxaidd-purple">
            Les modifications proposées sont disponibles dans la Vue Opérationnelle.
          </p>
        </div>
      )}

      <ModalFooter>
        {step === 'upload' && (
          <>
            <Button variant="outline" onClick={handleClose}>Annuler</Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isProcessing}
              icon={isProcessing ? undefined : <ArrowRight className="w-4 h-4" />}
            >
              {isProcessing ? 'Analyse en cours...' : 'Analyser'}
            </Button>
          </>
        )}
        {step === 'review' && (
          <>
            <Button variant="outline" onClick={() => setStep('upload')}>Retour</Button>
            <Button
              onClick={handleApply}
              disabled={selectedResponses.size === 0 || isProcessing}
              icon={<Check className="w-4 h-4" />}
            >
              {isProcessing ? 'Application...' : `Appliquer ${selectedResponses.size} réponses`}
            </Button>
          </>
        )}
        {step === 'complete' && (
          <Button onClick={handleClose}>Fermer</Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
