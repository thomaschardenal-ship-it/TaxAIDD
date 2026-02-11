'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Sparkles, FileText, AlertTriangle, Link as LinkIcon, CheckCircle2, Circle, Clock, Edit3 } from 'lucide-react';
import { ReportElement, DomainType, ReportTableData, ReportListItem } from '@/types';
import { useProjectContext } from '@/context/ProjectContext';
import { getDocumentById } from '@/data';
import Button from '@/components/ui/Button';

type ValidationStatus = 'pending' | 'in_review' | 'validated' | 'needs_revision';

interface ReportContentProps {
  elements: ReportElement[];
  projectId: string;
  onCellSelect: (elementId: string, sourceDocIds: string[]) => void;
}

const domainColors: Record<DomainType, { bg: string; border: string; text: string; light: string }> = {
  'TAX': { bg: 'bg-purple-50', border: 'border-wedd-black', text: 'text-wedd-black', light: 'bg-purple-100' },
  'Social': { bg: 'bg-emerald-50', border: 'border-wedd-mint', text: 'text-emerald-700', light: 'bg-emerald-100' },
  'Corporate': { bg: 'bg-blue-50', border: 'border-wedd-black', text: 'text-wedd-black', light: 'bg-blue-100' },
  'IP/IT': { bg: 'bg-pink-50', border: 'border-wedd-mint', text: 'text-wedd-mint', light: 'bg-pink-100' },
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
  const [validationStatus, setValidationStatus] = useState<Record<string, ValidationStatus>>(() => {
    // Initialize with mock validation statuses
    return elements.reduce((acc, el) => {
      acc[el.id] = Math.random() > 0.7 ? 'validated' : Math.random() > 0.5 ? 'in_review' : 'pending';
      return acc;
    }, {} as Record<string, ValidationStatus>);
  });
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleValidationChange = (elementId: string, status: ValidationStatus) => {
    setValidationStatus(prev => ({ ...prev, [elementId]: status }));
  };

  // Calculate validation statistics
  const validatedCount = Object.values(validationStatus).filter(s => s === 'validated').length;
  const totalCount = elements.length;
  const validationProgress = totalCount > 0 ? Math.round((validatedCount / totalCount) * 100) : 0;

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
          <h3 className="font-semibold text-wedd-black">Rapport de Due Diligence</h3>
          <Button
            size="sm"
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
            icon={<Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />}
          >
            {isGenerating ? 'Génération...' : 'Générer avec IA'}
          </Button>
        </div>

        {/* Validation Progress */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Validation du rapport</span>
            <span className="text-sm text-gray-500">{validatedCount}/{totalCount} validés</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                validationProgress === 100 ? 'bg-green-500' : 'bg-wedd-black'
              }`}
              style={{ width: `${validationProgress}%` }}
            />
          </div>
          {validationProgress === 100 && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Tous les éléments ont été validés
            </p>
          )}
        </div>

        {/* Domain filter */}
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value as DomainType | 'all')}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wedd-black"
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
            validationStatus={validationStatus}
            onValidationChange={handleValidationChange}
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
  validationStatus: Record<string, ValidationStatus>;
  onValidationChange: (elementId: string, status: ValidationStatus) => void;
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
  validationStatus,
  onValidationChange,
}: DomainSectionProps) {
  const colors = domainColors[domain];
  const domainValidated = elements.filter(el => validationStatus[el.id] === 'validated').length;

  return (
    <div className="mb-6">
      {/* Domain header */}
      <div className={`${colors.light} px-4 py-3 rounded-t-lg sticky top-0 z-[5]`}>
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold ${colors.text} flex items-center gap-2`}>
            <span>{domainIcons[domain]}</span>
            {domain.toUpperCase()} ANALYSIS
          </h4>
          <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded">
            {domainValidated}/{elements.length} validés
          </span>
        </div>
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
            validationStatus={validationStatus[element.id] || 'pending'}
            onValidationChange={(status) => onValidationChange(element.id, status)}
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
  validationStatus: ValidationStatus;
  onValidationChange: (status: ValidationStatus) => void;
}

const validationStatusConfig: Record<ValidationStatus, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  pending: { icon: <Circle className="w-4 h-4" />, label: 'À valider', color: 'text-gray-400', bgColor: 'bg-gray-100' },
  in_review: { icon: <Clock className="w-4 h-4" />, label: 'En revue', color: 'text-amber-500', bgColor: 'bg-amber-50' },
  validated: { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Validé', color: 'text-green-500', bgColor: 'bg-green-50' },
  needs_revision: { icon: <Edit3 className="w-4 h-4" />, label: 'À réviser', color: 'text-red-500', bgColor: 'bg-red-50' },
};

function ElementCard({
  element,
  domain,
  isCollapsed,
  onToggle,
  onCellSelect,
  isSelected,
  projectId,
  elementRefs,
  validationStatus,
  onValidationChange,
}: ElementCardProps) {
  const colors = domainColors[domain];
  const statusConfig = validationStatusConfig[validationStatus];

  const getIcon = () => {
    switch (element.type) {
      case 'table': return '🔢';
      case 'list': return '📋';
      default: return '📄';
    }
  };

  const cycleValidationStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statusOrder: ValidationStatus[] = ['pending', 'in_review', 'validated', 'needs_revision'];
    const currentIndex = statusOrder.indexOf(validationStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onValidationChange(statusOrder[nextIndex]);
  };

  return (
    <div
      ref={(el) => { elementRefs.current[element.id] = el; }}
      className={`
        bg-white rounded-lg border-l-4 shadow-sm transition-all duration-300
        ${colors.border}
        ${isSelected ? 'ring-2 ring-wedd-mint glow-effect' : ''}
        ${validationStatus === 'validated' ? 'opacity-80' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
          <span>{getIcon()}</span>
          <span className="font-medium text-wedd-black flex-1 text-left">{element.title}</span>
          {element.sourceDocumentIds.length > 0 && (
            <span className="badge bg-gray-100 text-gray-600">
              {element.sourceDocumentIds.length} sources
            </span>
          )}
        </button>
        {/* Validation status button */}
        <button
          onClick={cycleValidationStatus}
          className={`mr-3 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors ${statusConfig.bgColor} ${statusConfig.color} hover:opacity-80`}
          title="Cliquez pour changer le statut"
        >
          {statusConfig.icon}
          <span className="hidden sm:inline">{statusConfig.label}</span>
        </button>
      </div>

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
                className="bg-wedd-cream px-3 py-2 text-left font-semibold text-wedd-black first:rounded-tl-lg last:rounded-tr-lg"
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
                      ${row.isEditable ? 'cursor-pointer hover:bg-wedd-mint/10' : ''}
                      ${isSelected ? 'ring-2 ring-wedd-black ring-inset bg-wedd-black/5' : ''}
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
              className="text-xs px-2 py-1 bg-wedd-cream rounded hover:bg-wedd-black/10 hover:text-wedd-black transition-colors"
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
