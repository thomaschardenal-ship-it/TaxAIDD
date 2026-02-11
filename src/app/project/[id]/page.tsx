'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, Target, FolderOpen } from 'lucide-react';
import { DomainType } from '@/types';
import { getProjectById, getClientById, getUserById, getDocumentsForProject, countDocumentsByDomain, getIRLItemsForProject, getQAItemsForProject } from '@/data';
import { Header } from '@/components/layout';
import { StatusBadge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { OrgChart, CollectionProgress, ActionButtons, IRLModal, QAModal, ImportModal, QAResponseImportModal, ExportModal, CoherenceReviewModal } from '@/components/project';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [showIRLModal, setShowIRLModal] = useState(false);
  const [showQAModal, setShowQAModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showQAResponseImportModal, setShowQAResponseImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCoherenceModal, setShowCoherenceModal] = useState(false);
  const [irlFilterDomain, setIrlFilterDomain] = useState<DomainType | null>(null);

  const handleDomainClick = (domain: DomainType) => {
    setIrlFilterDomain(domain);
    setShowIRLModal(true);
  };

  const handleOpenIRLAll = () => {
    setIrlFilterDomain(null);
    setShowIRLModal(true);
  };

  const handleCloseIRLModal = () => {
    setShowIRLModal(false);
    setIrlFilterDomain(null);
  };

  const project = getProjectById(projectId);
  const client = project ? getClientById(project.clientId) : null;
  const responsible = project ? getUserById(project.responsibleId) : null;

  const documents = project ? getDocumentsForProject(projectId) : [];
  const irlItems = project ? getIRLItemsForProject(projectId) : [];
  const qaItems = project ? getQAItemsForProject(projectId) : [];

  const documentStats = useMemo(() => {
    const domains: DomainType[] = ['TAX', 'Social', 'Corporate', 'IP/IT'];
    return domains.reduce((acc, domain) => {
      acc[domain] = countDocumentsByDomain(documents, domain);
      return acc;
    }, {} as Record<DomainType, { received: number; total: number }>);
  }, [documents]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-wedd-black mb-2">Projet non trouvé</h2>
          <p className="text-gray-500 mb-4">Le projet demandé n&apos;existe pas.</p>
          <Link href="/">
            <Button>Retour au dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const endDate = new Date(project.endDate);
  const today = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen pb-8">
      <Header
        title={project.name}
        breadcrumbs={[{ label: project.name }]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <Link href={`/project/${projectId}/folder`}>
              <Button icon={<FolderOpen className="w-4 h-4" />}>
                Ouvrir le dossier
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Client Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {client && (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.initials}
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Client</p>
                  <p className="font-semibold text-wedd-black">{client?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{client?.industry}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsible Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {responsible && (
                  <Avatar
                    name={responsible.name}
                    initials={responsible.initials}
                    color={responsible.color}
                    size="lg"
                  />
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Responsable</p>
                  <p className="font-semibold text-wedd-black">{responsible?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{responsible?.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deadline Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${daysRemaining <= 7 ? 'bg-pink-100' : 'bg-blue-100'}`}>
                  <Calendar className={`w-6 h-6 ${daysRemaining <= 7 ? 'text-wedd-mint' : 'text-wedd-black'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Deadline</p>
                  <p className="font-semibold text-wedd-black">{formatDate(project.endDate)}</p>
                  <p className={`text-xs ${daysRemaining <= 7 ? 'text-wedd-mint font-medium' : 'text-gray-500'}`}>
                    {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Dépassé'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-wedd-mint/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-wedd-mint-dark" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Progression</p>
                  <p className="font-semibold text-wedd-black text-lg">{project.progress}%</p>
                  <ProgressBar value={project.progress} size="sm" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Org Chart */}
        <OrgChart companies={project.companies} />

        {/* Collection Progress */}
        <CollectionProgress documentStats={documentStats} onDomainClick={handleDomainClick} />

        {/* Action Buttons */}
        <ActionButtons
          onGenerateIRL={handleOpenIRLAll}
          onGenerateQA={() => setShowQAModal(true)}
          onImportDocuments={() => setShowImportModal(true)}
          onImportQAResponses={() => setShowQAResponseImportModal(true)}
          onExportReport={() => setShowExportModal(true)}
          onCoherenceReview={() => setShowCoherenceModal(true)}
        />
      </div>

      {/* Modals */}
      <IRLModal
        isOpen={showIRLModal}
        onClose={handleCloseIRLModal}
        items={irlItems}
        projectName={project.name}
        projectId={projectId}
        filterDomain={irlFilterDomain}
      />

      <QAModal
        isOpen={showQAModal}
        onClose={() => setShowQAModal(false)}
        items={qaItems}
        projectName={project.name}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <QAResponseImportModal
        isOpen={showQAResponseImportModal}
        onClose={() => setShowQAResponseImportModal(false)}
        projectName={project.name}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        projectName={project.name}
      />

      <CoherenceReviewModal
        isOpen={showCoherenceModal}
        onClose={() => setShowCoherenceModal(false)}
        projectName={project.name}
      />
    </div>
  );
}
