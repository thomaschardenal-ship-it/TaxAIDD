'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, ChevronLeft, ChevronRight, FileText, Highlighter, StickyNote, Link2, Undo2, X } from 'lucide-react';
import { DocumentItem } from '@/types';
import { useProjectContext } from '@/context/ProjectContext';

interface MockPDFViewerProps {
  document: DocumentItem | null;
  onHighlightClick: (highlightId: string, elementId: string) => void;
}

type AnnotationTool = 'highlight' | 'note' | 'link' | null;

interface MockAnnotation {
  id: string;
  type: 'highlight' | 'note';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
}

const highlightColors = [
  { name: 'Jaune', value: '#FBBF24' },
  { name: 'Vert', value: '#34D399' },
  { name: 'Bleu', value: '#60A5FA' },
  { name: 'Rose', value: '#F472B6' },
];

const reportSections = [
  'Tableau de détermination du résultat fiscal',
  'Analyse TVA',
  'Synthèse des risques',
  'Points d\'attention CIR',
  'Revue des conventions réglementées',
];

export default function MockPDFViewer({ document, onHighlightClick }: MockPDFViewerProps) {
  const { currentPage, setCurrentPage, zoomLevel, setZoomLevel, selectedReportElementId } = useProjectContext();
  const [hoveredHighlight, setHoveredHighlight] = useState<string | null>(null);

  // Annotation toolbar state
  const [activeTool, setActiveTool] = useState<AnnotationTool>(null);
  const [selectedColor, setSelectedColor] = useState(highlightColors[0].value);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [annotations, setAnnotations] = useState<MockAnnotation[]>([]);
  const [notePopup, setNotePopup] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [noteText, setNoteText] = useState('');
  const [showLinkDropdown, setShowLinkDropdown] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [undoStack, setUndoStack] = useState<MockAnnotation[][]>([]);

  const documentAreaRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const totalPages = document?.pages || 1;

  // Reset to page 1 when document changes
  useEffect(() => {
    setCurrentPage(1);
  }, [document?.id, setCurrentPage]);

  // Reset annotations when document changes
  useEffect(() => {
    setAnnotations([]);
    setUndoStack([]);
    setActiveTool(null);
    setNotePopup({ x: 0, y: 0, visible: false });
    setShowLinkDropdown({ x: 0, y: 0, visible: false });
  }, [document?.id]);

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

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

  const handleToolClick = (tool: AnnotationTool) => {
    if (activeTool === tool) {
      setActiveTool(null);
    } else {
      setActiveTool(tool);
    }
    setShowColorPicker(false);
    setNotePopup({ x: 0, y: 0, visible: false });
    setShowLinkDropdown({ x: 0, y: 0, visible: false });
  };

  const handleDocumentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTool || !documentAreaRef.current) return;

    const rect = documentAreaRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTool === 'highlight') {
      const newAnnotation: MockAnnotation = {
        id: `ann-${Date.now()}`,
        type: 'highlight',
        x: Math.max(0, xPct - 10),
        y: Math.max(0, yPct - 1),
        width: 20,
        height: 2.5,
        color: selectedColor,
      };
      setUndoStack(prev => [...prev, annotations]);
      setAnnotations(prev => [...prev, newAnnotation]);
    } else if (activeTool === 'note') {
      setNotePopup({ x: xPct, y: yPct, visible: true });
      setNoteText('');
    } else if (activeTool === 'link') {
      setShowLinkDropdown({ x: xPct, y: yPct, visible: true });
    }
  }, [activeTool, selectedColor, annotations]);

  const handleSaveNote = () => {
    const newAnnotation: MockAnnotation = {
      id: `ann-${Date.now()}`,
      type: 'note',
      x: Math.max(0, notePopup.x - 1),
      y: Math.max(0, notePopup.y - 1),
      width: 2.5,
      height: 2.5,
      color: '#FBBF24',
      text: noteText,
    };
    setUndoStack(prev => [...prev, annotations]);
    setAnnotations(prev => [...prev, newAnnotation]);
    setNotePopup({ x: 0, y: 0, visible: false });
    setNoteText('');
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setAnnotations(previousState);
    setUndoStack(prev => prev.slice(0, -1));
  };

  const handleLinkSelect = (section: string) => {
    alert(`Lien créé vers : "${section}"`);
    setShowLinkDropdown({ x: 0, y: 0, visible: false });
  };

  if (!document) {
    return (
      <div className="h-full flex flex-col bg-wedd-gray-100">
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
    <div className="h-full flex flex-col bg-wedd-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-wedd-black truncate flex-1 mr-4">
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

      {/* Annotation Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 h-10 flex items-center gap-1">
        {/* Highlight tool */}
        <div className="relative" ref={colorPickerRef}>
          <button
            onClick={() => handleToolClick('highlight')}
            className={`p-1.5 rounded transition-colors ${
              activeTool === 'highlight'
                ? 'bg-wedd-mint/20 border border-wedd-mint'
                : 'hover:bg-gray-100 text-gray-600 border border-transparent'
            }`}
            title="Surligner"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          {activeTool === 'highlight' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className="ml-0.5 w-4 h-4 rounded border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: selectedColor }}
              title="Choisir la couleur"
            />
          )}
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1.5 z-50">
              {highlightColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setSelectedColor(color.value);
                    setShowColorPicker(false);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Note tool */}
        <button
          onClick={() => handleToolClick('note')}
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'note'
              ? 'bg-wedd-mint/20 border border-wedd-mint'
              : 'hover:bg-gray-100 text-gray-600 border border-transparent'
          }`}
          title="Ajouter une note"
        >
          <StickyNote className="w-4 h-4" />
        </button>

        {/* Link to Report tool */}
        <button
          onClick={() => handleToolClick('link')}
          className={`p-1.5 rounded transition-colors ${
            activeTool === 'link'
              ? 'bg-wedd-mint/20 border border-wedd-mint'
              : 'hover:bg-gray-100 text-gray-600 border border-transparent'
          }`}
          title="Lier au rapport"
        >
          <Link2 className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Undo */}
        <button
          onClick={handleUndo}
          disabled={undoStack.length === 0}
          className={`p-1.5 rounded transition-colors border border-transparent ${
            undoStack.length === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Annuler"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Annotation count indicator */}
        {annotations.length > 0 && (
          <span className="ml-2 text-xs text-gray-400">
            {annotations.length} annotation{annotations.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4">
        <div
          ref={documentAreaRef}
          className={`mx-auto bg-white shadow-lg rounded-sm relative ${activeTool ? 'cursor-crosshair' : ''}`}
          style={{
            width: `${595 * (zoomLevel / 100)}px`,
            height: `${842 * (zoomLevel / 100)}px`,
            aspectRatio: '1 / 1.414', // A4 ratio
          }}
          onClick={handleDocumentClick}
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

          {/* Existing Highlights from document data */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onHighlightClick(highlight.id, highlight.linkedElementId);
                }}
                onMouseEnter={() => setHoveredHighlight(highlight.id)}
                onMouseLeave={() => setHoveredHighlight(null)}
                title={`Utilisé dans : ${highlight.linkedElementName}`}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div
                    className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-wedd-black text-white text-xs rounded whitespace-nowrap z-10"
                    style={{ fontSize: '11px' }}
                  >
                    Utilisé dans : {highlight.linkedElementName}
                  </div>
                )}
              </div>
            );
          })}

          {/* User-created annotations */}
          {annotations.map((ann) => (
            <div
              key={ann.id}
              className="absolute pointer-events-none"
              style={{
                left: `${ann.x}%`,
                top: `${ann.y}%`,
                width: `${ann.width}%`,
                height: `${ann.height}%`,
              }}
            >
              {ann.type === 'highlight' && (
                <div
                  className="w-full h-full rounded-sm border"
                  style={{
                    backgroundColor: `${ann.color}40`,
                    borderColor: `${ann.color}80`,
                  }}
                />
              )}
              {ann.type === 'note' && (
                <div
                  className="w-5 h-5 rounded-sm shadow-sm border border-yellow-400 bg-yellow-200 flex items-center justify-center pointer-events-auto cursor-default"
                  title={ann.text || 'Note'}
                >
                  <StickyNote className="w-3 h-3 text-yellow-700" />
                </div>
              )}
            </div>
          ))}

          {/* Note popup */}
          {notePopup.visible && (
            <div
              className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
              style={{
                left: `${notePopup.x}%`,
                top: `${notePopup.y}%`,
                width: '220px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Nouvelle note</span>
                <button
                  onClick={() => setNotePopup({ x: 0, y: 0, visible: false })}
                  className="p-0.5 rounded hover:bg-gray-100 text-gray-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Saisir votre note..."
                className="w-full h-16 text-xs border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-1 focus:ring-wedd-mint"
                autoFocus
              />
              <button
                onClick={handleSaveNote}
                className="mt-2 w-full text-xs bg-wedd-black text-white rounded py-1.5 hover:bg-gray-800 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          )}

          {/* Link dropdown */}
          {showLinkDropdown.visible && (
            <div
              className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
              style={{
                left: `${showLinkDropdown.x}%`,
                top: `${showLinkDropdown.y}%`,
                width: '240px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-gray-100">
                <span className="text-xs font-medium text-gray-700">Lier à une section du rapport</span>
                <button
                  onClick={() => setShowLinkDropdown({ x: 0, y: 0, visible: false })}
                  className="p-0.5 rounded hover:bg-gray-100 text-gray-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              {reportSections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLinkSelect(section)}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {section}
                </button>
              ))}
            </div>
          )}
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
