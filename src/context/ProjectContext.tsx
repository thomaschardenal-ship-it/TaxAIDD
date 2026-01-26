'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DocumentItem, DomainType } from '@/types';

interface ProjectContextState {
  // Selected states
  selectedDocumentId: string | null;
  selectedReportElementId: string | null;
  selectedDomain: DomainType | null;

  // Filtered documents (when selecting report element)
  filteredDocumentIds: string[] | null;

  // Highlights to show in PDF viewer
  activeHighlights: string[];

  // Current project
  currentProjectId: string | null;

  // PDF viewer state
  currentPage: number;
  zoomLevel: number;
}

interface ProjectContextActions {
  setSelectedDocument: (docId: string | null) => void;
  setSelectedReportElement: (elementId: string | null, sourceDocIds?: string[]) => void;
  setSelectedDomain: (domain: DomainType | null) => void;
  setFilteredDocuments: (docIds: string[] | null) => void;
  setActiveHighlights: (highlightIds: string[]) => void;
  setCurrentProject: (projectId: string | null) => void;
  setCurrentPage: (page: number) => void;
  setZoomLevel: (zoom: number) => void;
  clearSelection: () => void;
}

type ProjectContextType = ProjectContextState & ProjectContextActions;

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const initialState: ProjectContextState = {
  selectedDocumentId: null,
  selectedReportElementId: null,
  selectedDomain: null,
  filteredDocumentIds: null,
  activeHighlights: [],
  currentProjectId: null,
  currentPage: 1,
  zoomLevel: 100,
};

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectContextState>(initialState);

  const setSelectedDocument = useCallback((docId: string | null) => {
    console.log('[Context] Selected document:', docId);
    setState(prev => ({
      ...prev,
      selectedDocumentId: docId,
      // Clear report element selection when selecting a document
      selectedReportElementId: null,
      filteredDocumentIds: null,
      currentPage: 1,
    }));
  }, []);

  const setSelectedReportElement = useCallback((elementId: string | null, sourceDocIds?: string[]) => {
    console.log('[Context] Selected report element:', elementId, 'Sources:', sourceDocIds);
    setState(prev => ({
      ...prev,
      selectedReportElementId: elementId,
      filteredDocumentIds: sourceDocIds || null,
      // Auto-select first source document
      selectedDocumentId: sourceDocIds && sourceDocIds.length > 0 ? sourceDocIds[0] : prev.selectedDocumentId,
      currentPage: 1,
    }));
  }, []);

  const setSelectedDomain = useCallback((domain: DomainType | null) => {
    console.log('[Context] Selected domain:', domain);
    setState(prev => ({
      ...prev,
      selectedDomain: domain,
    }));
  }, []);

  const setFilteredDocuments = useCallback((docIds: string[] | null) => {
    setState(prev => ({
      ...prev,
      filteredDocumentIds: docIds,
    }));
  }, []);

  const setActiveHighlights = useCallback((highlightIds: string[]) => {
    setState(prev => ({
      ...prev,
      activeHighlights: highlightIds,
    }));
  }, []);

  const setCurrentProject = useCallback((projectId: string | null) => {
    setState(prev => ({
      ...prev,
      currentProjectId: projectId,
    }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  const setZoomLevel = useCallback((zoom: number) => {
    setState(prev => ({
      ...prev,
      zoomLevel: Math.min(200, Math.max(50, zoom)),
    }));
  }, []);

  const clearSelection = useCallback(() => {
    console.log('[Context] Clearing all selections');
    setState(prev => ({
      ...prev,
      selectedDocumentId: null,
      selectedReportElementId: null,
      filteredDocumentIds: null,
      activeHighlights: [],
      currentPage: 1,
    }));
  }, []);

  const value: ProjectContextType = {
    ...state,
    setSelectedDocument,
    setSelectedReportElement,
    setSelectedDomain,
    setFilteredDocuments,
    setActiveHighlights,
    setCurrentProject,
    setCurrentPage,
    setZoomLevel,
    clearSelection,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}

export default ProjectContext;
