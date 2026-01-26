'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { getProjectById, getDocumentsForProject, getReportElementsForProject, getDocumentById, flattenDocuments } from '@/data';
import { useProjectContext } from '@/context/ProjectContext';
import { DocumentIndex, MockPDFViewer, ReportContent } from '@/components/folder';
import { ImportModal } from '@/components/project';
import Button from '@/components/ui/Button';

export default function FolderPage() {
  const params = useParams();
  const projectId = params.id as string;

  const {
    selectedDocumentId,
    selectedReportElementId,
    filteredDocumentIds,
    setSelectedDocument,
    setSelectedReportElement,
    setCurrentProject,
    clearSelection,
  } = useProjectContext();

  const [showImportModal, setShowImportModal] = useState(false);

  const project = getProjectById(projectId);
  const documents = useMemo(() => project ? getDocumentsForProject(projectId) : [], [projectId, project]);
  const reportElements = useMemo(() => project ? getReportElementsForProject(projectId) : [], [projectId, project]);

  // Flatten documents for easy lookup
  const flatDocs = useMemo(() => flattenDocuments(documents), [documents]);

  // Set current project in context
  useEffect(() => {
    setCurrentProject(projectId);
    return () => setCurrentProject(null);
  }, [projectId, setCurrentProject]);

  // Get the currently selected document object
  const selectedDocument = selectedDocumentId
    ? flatDocs.find(d => d.id === selectedDocumentId)
    : null;

  // Handle cell selection in report content
  const handleCellSelect = useCallback((elementId: string, sourceDocIds: string[]) => {
    console.log('[FolderPage] Cell selected:', elementId, 'Sources:', sourceDocIds);
    setSelectedReportElement(elementId, sourceDocIds);
  }, [setSelectedReportElement]);

  // Handle highlight click in PDF viewer
  const handleHighlightClick = useCallback((highlightId: string, elementId: string) => {
    console.log('[FolderPage] Highlight clicked:', highlightId, 'Element:', elementId);

    // Find the element and its source documents
    const element = reportElements.find(e => e.id === elementId);
    if (element) {
      setSelectedReportElement(elementId, element.sourceDocumentIds);
    }
  }, [reportElements, setSelectedReportElement]);

  // Clear filter button
  const handleClearFilter = () => {
    clearSelection();
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-omni-black mb-2">Projet non trouvé</h2>
          <Link href="/">
            <Button>Retour au dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/project/${projectId}`}>
            <button className="p-2 rounded-lg hover:bg-omni-gray-light transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="font-semibold text-omni-black">{project.name}</h1>
            <p className="text-sm text-gray-500">Vue opérationnelle</p>
          </div>
        </div>

        {/* Filter indicator */}
        {filteredDocumentIds && (
          <div className="flex items-center gap-2 bg-omni-yellow/20 px-3 py-1.5 rounded-full">
            <span className="text-sm text-omni-black">
              Mode filtré : {filteredDocumentIds.length} document{filteredDocumentIds.length > 1 ? 's' : ''} source
            </span>
            <button
              onClick={handleClearFilter}
              className="p-1 rounded-full hover:bg-omni-yellow/30 transition-colors"
              title="Effacer le filtre"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main 3-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Document Index (20%) */}
        <div className="w-1/5 min-w-[240px] max-w-[320px] flex-shrink-0">
          <DocumentIndex
            documents={documents}
            projectName={project.name}
            onImport={() => setShowImportModal(true)}
          />
        </div>

        {/* Column 2: PDF Preview (45%) */}
        <div className="flex-[45] min-w-[400px] border-l border-r border-gray-100">
          <MockPDFViewer
            document={selectedDocument || null}
            onHighlightClick={handleHighlightClick}
          />
        </div>

        {/* Column 3: Report Content (35%) */}
        <div className="flex-[35] min-w-[350px]">
          <ReportContent
            elements={reportElements}
            projectId={projectId}
            onCellSelect={handleCellSelect}
          />
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
}
