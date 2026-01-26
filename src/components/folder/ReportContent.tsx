'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Sparkles, FileText, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { ReportElement, DomainType, ReportTableData, ReportListItem } from '@/types';
import { useProjectContext } from '@/context/ProjectContext';
import { getDocumentById } from '@/data';
import Button from '@/components/ui/Button';

interface ReportContentProps {
  elements: ReportElement[];
  projectId: string;
  onCellSelect: (elementId: string, sourceDocIds: string[]) => void;
}

const domainColors: Record<DomainType, { bg: string; border: string; text: string; light: string }> = {
  'TAX': { bg: 'bg-purple-50', border: 'border-omni-purple', text: 'text-omni-purple', light: 'bg-purple-100' },
  'Social': { bg: 'bg-emerald-50', border: 'border-omni-mint', text: 'text-emerald-700', light: 'bg-emerald-100' },
  'Corporate': { bg: 'bg-blue-50', border: 'border-omni-blue', text: 'text-omni-blue', light: 'bg-blue-100' },
  'IP/IT': { bg: 'bg-pink-50', border: 'border-omni-magenta', text: 'text-omni-magenta', light: 'bg-pink-100' },
};

const domainIcons: Record<DomainType, string> = {
  'TAX': '📊',
  'Social': '👥',
  'Corporate': '🏢',
  'IP/IT': '🔒',
};

export default function ReportContent({ elements, projectId, onCellSelect }: ReportContentProps) {
  const { selectedReportElementId, selectedDocumentId } = useProjectContext();
  const [selectedDomain, setSelectedDomain] = useState<DomainType | 'all'>('all');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Group elements by domain
  const groupedElements = elements.reduce((acc, element) => {
    if (!acc[element.domain]) acc[element.domain] = [];
    acc[element.domain].push(element);
    return acc;
  }, {} as Record<DomainType, ReportElement[]>);

  const filteredDomains = selectedDomain === 'all'
    ? Object.keys(groupedElements) as DomainType[]
    : [selectedDomain];

  // Scroll to selected element
  useEffect(() => {
    if (selectedReportElementId && elementRefs.current[selectedReportElementId]) {
      elementRefs.current[selectedReportElementId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedReportElementId]);

  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    console.log('[Report] Generating with AI...');
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert('Rapport généré avec succès par l\'IA !');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-omni-black">Rapport de Due Diligence</h3>
          <Button
            size="sm"
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            icon={<Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />}
          >
            {isGenerating ? 'Génération...' : 'Générer avec IA'}
          </Button>
        </div>

        {/* Domain filter */}
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value as DomainType | 'all')}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-omni-purple"
        >
          <option value="all">Tous les domaines</option>
          <option value="TAX">TAX (Fiscalité)</option>
          <option value="Social">Social</option>
          <option value="Corporate">Corporate</option>
          <option value="IP/IT">IP/IT</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {filteredDomains.map(domain => (
          <DomainSection
            key={domain}
            domain={domain}
            elements={groupedElements[domain] || []}
            collapsedSections={collapsedSections}
            onToggle={toggleSection}
            onCellSelect={onCellSelect}
            selectedElementId={selectedReportElementId}
            projectId={projectId}
            elementRefs={elementRefs}
          />
        ))}
      </div>
    </div>
  );
}

interface DomainSectionProps {
  domain: DomainType;
  elements: ReportElement[];
  collapsedSections: Set<string>;
  onToggle: (id: string) => void;
  onCellSelect: (elementId: string, sourceDocIds: string[]) => void;
  selectedElementId: string | null;
  projectId: string;
  elementRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

function DomainSection({
  domain,
  elements,
  collapsedSections,
  onToggle,
  onCellSelect,
  selectedElementId,
  projectId,
  elementRefs,
}: DomainSectionProps) {
  const colors = domainColors[domain];

  return (
    <div className="mb-6">
      {/* Domain header */}
      <div className={`${colors.light} px-4 py-3 rounded-t-lg sticky top-0 z-[5]`}>
        <h4 className={`font-semibold ${colors.text} flex items-center gap-2`}>
          <span>{domainIcons[domain]}</span>
          {domain.toUpperCase()} ANALYSIS
        </h4>
      </div>

      {/* Elements */}
      <div className="space-y-3 mt-3">
        {elements.map(element => (
          <ElementCard
            key={element.id}
            element={element}
            domain={domain}
            isCollapsed={collapsedSections.has(element.id)}
            onToggle={() => onToggle(element.id)}
            onCellSelect={onCellSelect}
            isSelected={selectedElementId === element.id}
            projectId={projectId}
            elementRefs={elementRefs}
          />
        ))}
      </div>
    </div>
  );
}

interface ElementCardProps {
  element: ReportElement;
  domain: DomainType;
  isCollapsed: boolean;
  onToggle: () => void;
  onCellSelect: (elementId: string, sourceDocIds: string[]) => void;
  isSelected: boolean;
  projectId: string;
  elementRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

function ElementCard({
  element,
  domain,
  isCollapsed,
  onToggle,
  onCellSelect,
  isSelected,
  projectId,
  elementRefs,
}: ElementCardProps) {
  const colors = domainColors[domain];

  const getIcon = () => {
    switch (element.type) {
      case 'table': return '🔢';
      case 'list': return '📋';
      default: return '📄';
    }
  };

  return (
    <div
      ref={(el) => { elementRefs.current[element.id] = el; }}
      className={`
        bg-white rounded-lg border-l-4 shadow-sm transition-all duration-300
        ${colors.border}
        ${isSelected ? 'ring-2 ring-omni-yellow glow-effect' : ''}
      `}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
        <span>{getIcon()}</span>
        <span className="font-medium text-omni-black flex-1 text-left">{element.title}</span>
        {element.sourceDocumentIds.length > 0 && (
          <span className="badge bg-gray-100 text-gray-600">
            {element.sourceDocumentIds.length} sources
          </span>
        )}
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          {element.type === 'table' && (
            <TableContent
              data={element.content as ReportTableData}
              elementId={element.id}
              sourceDocIds={element.sourceDocumentIds}
              onCellSelect={onCellSelect}
            />
          )}

          {element.type === 'list' && (
            <ListContent
              items={element.content as ReportListItem[]}
              elementId={element.id}
              sourceDocIds={element.sourceDocumentIds}
              onCellSelect={onCellSelect}
            />
          )}

          {element.type === 'text' && (
            <TextContent
              content={element.content as string}
              elementId={element.id}
              sourceDocIds={element.sourceDocumentIds}
              onCellSelect={onCellSelect}
            />
          )}

          {/* Sources footer */}
          {element.sourceDocumentIds.length > 0 && (
            <SourcesFooter
              sourceDocIds={element.sourceDocumentIds}
              projectId={projectId}
              onSourceClick={(docIds) => onCellSelect(element.id, docIds)}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface TableContentProps {
  data: ReportTableData;
  elementId: string;
  sourceDocIds: string[];
  onCellSelect: (elementId: string, sourceDocIds: string[]) => void;
}

function TableContent({ data, elementId, sourceDocIds, onCellSelect }: TableContentProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = (rowIndex: number, colIndex: number, row: typeof data.rows[0]) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    const docIds = row.sourceDocId ? [row.sourceDocId] : sourceDocIds;
    console.log('[Table] Cell clicked:', rowIndex, colIndex, 'Sources:', docIds);
    onCellSelect(elementId, docIds);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {data.headers.map((header, i) => (
              <th
                key={i}
                className="bg-omni-gray-light px-3 py-2 text-left font-semibold text-omni-black first:rounded-tl-lg last:rounded-tr-lg"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-100">
              <td className="px-3 py-2 font-medium">{row.label}</td>
              {row.values.map((value, colIndex) => {
                const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex + 1;
                return (
                  <td
                    key={colIndex}
                    className={`
                      px-3 py-2 transition-colors
                      ${row.isEditable ? 'cursor-pointer hover:bg-omni-yellow/10' : ''}
                      ${isSelected ? 'ring-2 ring-omni-purple ring-inset bg-omni-purple/5' : ''}
                    `}
                    onClick={() => row.isEditable && handleCellClick(rowIndex, colIndex + 1, row)}
                  >
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ListContentProps {
  items: ReportListItem[];
  elementId: string;
  sourceDocIds: string[];
  onCellSelect: (elementId: string, sourceDocIds: string[]) => void;
}

function ListContent({ items, elementId, sourceDocIds, onCellSelect }: ListContentProps) {
  const getRiskBadge = (risk?: 'low' | 'medium' | 'high') => {
    if (!risk) return null;
    const config = {
      low: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Faible' },
      medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Moyen' },
      high: { bg: 'bg-red-100', text: 'text-red-700', label: 'Élevé' },
    };
    const c = config[risk];
    return <span className={`badge ${c.bg} ${c.text} ml-2`}>{c.label}</span>;
  };

  const handleItemClick = (item: ReportListItem) => {
    const docIds = item.sourceDocId ? [item.sourceDocId] : sourceDocIds;
    console.log('[List] Item clicked:', item.id, 'Sources:', docIds);
    onCellSelect(elementId, docIds);
  };

  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li
          key={item.id}
          className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => handleItemClick(item)}
        >
          {item.risk === 'high' ? (
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
          )}
          <span className="flex-1 text-sm">{item.text}</span>
          {getRiskBadge(item.risk)}
        </li>
      ))}
    </ul>
  );
}

interface TextContentProps {
  content: string;
  elementId: string;
  sourceDocIds: string[];
  onCellSelect: (elementId: string, sourceDocIds: string[]) => void;
}

function TextContent({ content, elementId, sourceDocIds, onCellSelect }: TextContentProps) {
  return (
    <div
      className="prose prose-sm max-w-none cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
      onClick={() => onCellSelect(elementId, sourceDocIds)}
    >
      {content.split('\n\n').map((paragraph, i) => (
        <p key={i} className="mb-3 last:mb-0 whitespace-pre-wrap">
          {paragraph.split('\n').map((line, j) => (
            <React.Fragment key={j}>
              {line.startsWith('**') && line.endsWith('**') ? (
                <strong>{line.slice(2, -2)}</strong>
              ) : (
                line
              )}
              {j < paragraph.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}

interface SourcesFooterProps {
  sourceDocIds: string[];
  projectId: string;
  onSourceClick: (docIds: string[]) => void;
}

function SourcesFooter({ sourceDocIds, projectId, onSourceClick }: SourcesFooterProps) {
  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <LinkIcon className="w-3.5 h-3.5" />
        <span>Sources : {sourceDocIds.length} document{sourceDocIds.length > 1 ? 's' : ''}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {sourceDocIds.slice(0, 5).map(docId => {
          const doc = getDocumentById(projectId, docId);
          return (
            <button
              key={docId}
              onClick={() => onSourceClick([docId])}
              className="text-xs px-2 py-1 bg-omni-gray-light rounded hover:bg-omni-purple/10 hover:text-omni-purple transition-colors"
            >
              {doc?.name || docId}
            </button>
          );
        })}
        {sourceDocIds.length > 5 && (
          <span className="text-xs text-gray-400 px-2 py-1">
            +{sourceDocIds.length - 5} autres
          </span>
        )}
      </div>
    </div>
  );
}
