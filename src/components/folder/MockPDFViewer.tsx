'use client';

import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { DocumentItem, Highlight } from '@/types';
import { useProjectContext } from '@/context/ProjectContext';

interface MockPDFViewerProps {
  document: DocumentItem | null;
  onHighlightClick: (highlightId: string, elementId: string) => void;
}

export default function MockPDFViewer({ document, onHighlightClick }: MockPDFViewerProps) {
  const { currentPage, setCurrentPage, zoomLevel, setZoomLevel, selectedReportElementId } = useProjectContext();
  const [hoveredHighlight, setHoveredHighlight] = useState<string | null>(null);

  const totalPages = document?.pages || 1;

  // Reset to page 1 when document changes
  useEffect(() => {
    setCurrentPage(1);
  }, [document?.id, setCurrentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(200, zoomLevel + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(50, zoomLevel - 25));
  };

  const handleFit = () => {
    setZoomLevel(100);
  };

  if (!document) {
    return (
      <div className="h-full flex flex-col bg-omni-gray-lighter">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Sélectionnez un document</p>
            <p className="text-sm text-gray-400 mt-1">pour afficher l&apos;aperçu</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter highlights for current page
  const currentHighlights = document.highlights?.filter(h => h.page === currentPage) || [];

  return (
    <div className="h-full flex flex-col bg-omni-gray-lighter">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-omni-black truncate flex-1 mr-4">
          {document.code && <span className="text-gray-400 mr-1">{document.code}</span>}
          {document.name}
        </h3>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              title="Zoom arrière"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              title="Zoom avant"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleFit}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              title="Ajuster"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Download */}
          <button
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            title="Télécharger"
            onClick={() => console.log('[PDF] Download:', document.name)}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4">
        <div
          className="mx-auto bg-white shadow-lg rounded-sm relative"
          style={{
            width: `${595 * (zoomLevel / 100)}px`,
            height: `${842 * (zoomLevel / 100)}px`,
            aspectRatio: '1 / 1.414', // A4 ratio
          }}
        >
          {/* Mock PDF Content */}
          <div className="absolute inset-0 p-8" style={{ fontSize: `${12 * (zoomLevel / 100)}px` }}>
            {/* Fake document header */}
            <div className="border-b-2 border-gray-300 pb-4 mb-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>

            {/* Fake content lines */}
            <div className="space-y-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div
                    className="h-3 bg-gray-100 rounded"
                    style={{ width: `${60 + Math.random() * 35}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Fake table */}
            <div className="mt-8 border border-gray-200 rounded">
              <div className="grid grid-cols-4 gap-0">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 ${i < 4 ? 'bg-gray-100' : 'bg-white'} border-b border-r border-gray-200 last:border-r-0`}
                  />
                ))}
              </div>
            </div>

            {/* More content */}
            <div className="mt-8 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div
                    className="h-3 bg-gray-100 rounded"
                    style={{ width: `${50 + Math.random() * 45}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {currentHighlights.map((highlight) => {
            const isActive = selectedReportElementId === highlight.linkedElementId;
            const isHovered = hoveredHighlight === highlight.id;

            return (
              <div
                key={highlight.id}
                className={`
                  absolute cursor-pointer transition-all rounded-sm
                  ${isActive ? 'highlight-pulse' : ''}
                `}
                style={{
                  left: `${highlight.x}%`,
                  top: `${highlight.y}%`,
                  width: `${highlight.width}%`,
                  height: `${highlight.height}%`,
                  backgroundColor: `${highlight.color}40`,
                  borderLeft: `3px solid ${highlight.color}`,
                  outline: isHovered ? `2px solid ${highlight.color}` : 'none',
                  outlineOffset: '2px',
                }}
                onClick={() => onHighlightClick(highlight.id, highlight.linkedElementId)}
                onMouseEnter={() => setHoveredHighlight(highlight.id)}
                onMouseLeave={() => setHoveredHighlight(null)}
                title={`Utilisé dans : ${highlight.linkedElementName}`}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div
                    className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-omni-black text-white text-xs rounded whitespace-nowrap z-10"
                    style={{ fontSize: '11px' }}
                  >
                    Utilisé dans : {highlight.linkedElementName}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
