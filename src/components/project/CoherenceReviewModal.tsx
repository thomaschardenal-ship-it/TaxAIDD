'use client';

import React, { useState } from 'react';
import { Upload, Sparkles, AlertTriangle, CheckCircle, XCircle, ArrowRight, FileText, RefreshCw } from 'lucide-react';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface CoherenceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

interface CoherenceIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'data' | 'style' | 'risk' | 'source';
  title: string;
  description: string;
  location: string;
  suggestion?: string;
}

const mockIssues: CoherenceIssue[] = [
  {
    id: '1',
    type: 'error',
    category: 'data',
    title: 'Incohérence chiffre d\'affaires',
    description: 'Le CA mentionné en section TAX (45.2 M€) diffère de celui en Corporate (44.8 M€).',
    location: 'Section 2.1 vs Section 1.3',
    suggestion: 'Vérifier la source et harmoniser les montants.',
  },
  {
    id: '2',
    type: 'warning',
    category: 'style',
    title: 'Format de date non conforme',
    description: 'Dates au format "15 janvier 2024" au lieu de "15/01/2024".',
    location: 'Section 3.2, paragraphe 2',
    suggestion: 'Utiliser le format JJ/MM/AAAA.',
  },
  {
    id: '3',
    type: 'warning',
    category: 'risk',
    title: 'Niveau de risque à revoir',
    description: 'Le risque fiscal est évalué "Low" mais 2 contrôles sont mentionnés en cours.',
    location: 'Section 2.4 - Risques fiscaux',
    suggestion: 'Réévaluer le niveau de risque à "Medium".',
  },
  {
    id: '4',
    type: 'info',
    category: 'source',
    title: 'Source manquante',
    description: 'L\'affirmation sur les provisions n\'est pas liée à un document source.',
    location: 'Section 3.1, tableau effectifs',
    suggestion: 'Ajouter la référence au document RH correspondant.',
  },
];

export default function CoherenceReviewModal({ isOpen, onClose, projectName }: CoherenceReviewModalProps) {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [issues, setIssues] = useState<CoherenceIssue[]>([]);
  const [resolvedIssues, setResolvedIssues] = useState<Set<string>>(new Set());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    setStep('analyzing');
    // Simulation de l'analyse
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIssues(mockIssues);
    setStep('results');
  };

  const toggleResolved = (id: string) => {
    const newResolved = new Set(resolvedIssues);
    if (newResolved.has(id)) {
      newResolved.delete(id);
    } else {
      newResolved.add(id);
    }
    setResolvedIssues(newResolved);
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setIssues([]);
    setResolvedIssues(new Set());
    onClose();
  };

  const getTypeIcon = (type: CoherenceIssue['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryLabel = (category: CoherenceIssue['category']) => {
    switch (category) {
      case 'data': return 'Données';
      case 'style': return 'Style';
      case 'risk': return 'Risques';
      case 'source': return 'Sources';
    }
  };

  const errorCount = issues.filter(i => i.type === 'error' && !resolvedIssues.has(i.id)).length;
  const warningCount = issues.filter(i => i.type === 'warning' && !resolvedIssues.has(i.id)).length;
  const infoCount = issues.filter(i => i.type === 'info' && !resolvedIssues.has(i.id)).length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Revue de Cohérence" size="lg">
      {step === 'upload' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-800">Analyse IA de cohérence</p>
                <p className="text-sm text-purple-700 mt-1">
                  L&apos;IA va vérifier la cohérence des données, le respect des règles de style,
                  l&apos;évaluation des risques et les références aux sources.
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
              accept=".pdf,.docx,.pptx"
              onChange={handleFileChange}
              className="hidden"
              id="coherence-file-upload"
            />
            <label htmlFor="coherence-file-upload" className="cursor-pointer">
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-taxaidd-mint/20 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-taxaidd-mint" />
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
                    <p className="font-medium text-taxaidd-black">Uploadez le rapport pré-final</p>
                    <p className="text-sm text-gray-500">PDF, Word ou PowerPoint</p>
                  </div>
                </div>
              )}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Vérifications effectuées</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Cohérence des chiffres entre sections</li>
                <li>• Format des dates et montants</li>
                <li>• Évaluation des niveaux de risque</li>
                <li>• Références aux documents sources</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Règles de style vérifiées</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Montants en k€ avec espace</li>
                <li>• Dates au format JJ/MM/AAAA</li>
                <li>• Terminologie standard</li>
                <li>• Structure des phrases</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === 'analyzing' && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-taxaidd-black mb-2">Analyse en cours...</h3>
          <p className="text-gray-600">
            L&apos;IA parcourt votre document et vérifie la cohérence.
          </p>
          <div className="mt-6 max-w-xs mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${errorCount > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <XCircle className={`w-5 h-5 ${errorCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                <span className={`text-2xl font-bold ${errorCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {errorCount}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Erreurs</p>
            </div>
            <div className={`p-4 rounded-lg ${warningCount > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${warningCount > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
                <span className={`text-2xl font-bold ${warningCount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {warningCount}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Avertissements</p>
            </div>
            <div className={`p-4 rounded-lg ${infoCount > 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${infoCount > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`text-2xl font-bold ${infoCount > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                  {infoCount}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Suggestions</p>
            </div>
          </div>

          {/* Issues list */}
          <div className="max-h-72 overflow-y-auto space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`border rounded-lg p-4 transition-all ${
                  resolvedIssues.has(issue.id)
                    ? 'border-green-200 bg-green-50 opacity-60'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {resolvedIssues.has(issue.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      getTypeIcon(issue.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-taxaidd-black">{issue.title}</span>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {getCategoryLabel(issue.category)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                    <p className="text-xs text-gray-500 mb-2">📍 {issue.location}</p>
                    {issue.suggestion && (
                      <div className="p-2 bg-taxaidd-purple/5 rounded text-sm">
                        <span className="text-taxaidd-purple font-medium">💡 Suggestion : </span>
                        <span className="text-gray-700">{issue.suggestion}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleResolved(issue.id)}
                    className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      resolvedIssues.has(issue.id)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {resolvedIssues.has(issue.id) ? 'Résolu' : 'Marquer résolu'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {resolvedIssues.size === issues.length && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-800">Tous les points ont été traités !</p>
              <p className="text-sm text-green-700">Le rapport est prêt pour la validation finale.</p>
            </div>
          )}
        </div>
      )}

      <ModalFooter>
        {step === 'upload' && (
          <>
            <Button variant="outline" onClick={handleClose}>Annuler</Button>
            <Button
              onClick={handleAnalyze}
              disabled={!file}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Lancer l&apos;analyse IA
            </Button>
          </>
        )}
        {step === 'results' && (
          <>
            <Button variant="outline" onClick={() => setStep('upload')}>
              Nouvelle analyse
            </Button>
            <Button onClick={handleClose}>
              Terminer ({resolvedIssues.size}/{issues.length} résolus)
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}
