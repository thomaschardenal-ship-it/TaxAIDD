'use client';

import React, { useState, useMemo } from 'react';
import { Plus, X, Filter } from 'lucide-react';
import { DocumentItem } from '@/types';
import { useProjectContext } from '@/context/ProjectContext';
import TreeView from '@/components/ui/TreeView';
import Button from '@/components/ui/Button';
import { countDocumentsByStatus, flattenDocuments } from '@/data';

interface DocumentIndexProps {
  documents: DocumentItem[];
  projectName: string;
  onImport: () => void;
}

interface TagFilters {
  entity: string;
  period: string;
  document_type: string;
}

export default function DocumentIndex({ documents, projectName, onImport }: DocumentIndexProps) {
  const { selectedDocumentId, filteredDocumentIds, setSelectedDocument } = useProjectContext();

  const [tagFilters, setTagFilters] = useState<TagFilters>({
    entity: '',
    period: '',
    document_type: '',
  });

  const stats = countDocumentsByStatus(documents);

  // Collect unique tag values for each filter type from all leaf documents
  const tagOptions = useMemo(() => {
    const allLeaves = flattenDocuments(documents).filter(d => !d.children || d.children.length === 0);
    const entities = new Set<string>();
    const periods = new Set<string>();
    const docTypes = new Set<string>();

    allLeaves.forEach(doc => {
      if (doc.tags) {
        doc.tags.forEach(tag => {
          if (tag.type === 'entity') entities.add(tag.value);
          if (tag.type === 'period') periods.add(tag.value);
          if (tag.type === 'document_type') docTypes.add(tag.value);
        });
      }
    });

    return {
      entities: Array.from(entities).sort(),
      periods: Array.from(periods).sort(),
      docTypes: Array.from(docTypes).sort(),
    };
  }, [documents]);

  // Compute filtered IDs based on tag filters
  const tagFilteredIds = useMemo(() => {
    const hasAnyFilter = tagFilters.entity || tagFilters.period || tagFilters.document_type;
    if (!hasAnyFilter) return null;

    const allLeaves = flattenDocuments(documents).filter(d => !d.children || d.children.length === 0);
    const matchingIds: string[] = [];

    allLeaves.forEach(doc => {
      if (!doc.tags || doc.tags.length === 0) return;

      let matches = true;

      if (tagFilters.entity) {
        const hasEntity = doc.tags.some(t => t.type === 'entity' && t.value === tagFilters.entity);
        if (!hasEntity) matches = false;
      }

      if (tagFilters.period) {
        const hasPeriod = doc.tags.some(t => t.type === 'period' && t.value === tagFilters.period);
        if (!hasPeriod) matches = false;
      }

      if (tagFilters.document_type) {
        const hasDocType = doc.tags.some(t => t.type === 'document_type' && t.value === tagFilters.document_type);
        if (!hasDocType) matches = false;
      }

      if (matches) {
        matchingIds.push(doc.id);
      }
    });

    return matchingIds;
  }, [documents, tagFilters]);

  // Combine context-based filter with tag-based filter
  const combinedFilteredIds = useMemo(() => {
    if (filteredDocumentIds === null && tagFilteredIds === null) return null;
    if (filteredDocumentIds === null) return tagFilteredIds;
    if (tagFilteredIds === null) return filteredDocumentIds;
    // Intersection of both
    const tagSet = new Set(tagFilteredIds);
    return filteredDocumentIds.filter(id => tagSet.has(id));
  }, [filteredDocumentIds, tagFilteredIds]);

  const hasActiveTagFilters = tagFilters.entity !== '' || tagFilters.period !== '' || tagFilters.document_type !== '';

  const handleClearTagFilters = () => {
    setTagFilters({ entity: '', period: '', document_type: '' });
  };

  const handleFilterChange = (key: keyof TagFilters, value: string) => {
    setTagFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectDocument = (item: DocumentItem) => {
    // Only select leaf nodes (actual documents)
    if (!item.children || item.children.length === 0) {
      console.log('[DocumentIndex] Selected document:', item.id, item.name);
      setSelectedDocument(item.id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-wedd-black">Documents</h3>
          <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />} onClick={onImport}>
            Importer
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          {stats.received} / {stats.total} documents re&ccedil;us
        </p>
      </div>

      {/* Tag Filter Bar */}
      <div className="px-3 py-2 border-b border-gray-100 bg-wedd-cream/50">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Filter className="w-3 h-3 text-wedd-gray-500" />
          <span className="text-[11px] font-medium text-wedd-gray-500 uppercase tracking-wider">Filtres</span>
          {hasActiveTagFilters && (
            <button
              onClick={handleClearTagFilters}
              className="ml-auto flex items-center gap-0.5 text-[10px] text-wedd-gray-500 hover:text-wedd-black transition-colors"
            >
              <X className="w-3 h-3" />
              Effacer
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <select
            value={tagFilters.entity}
            onChange={(e) => handleFilterChange('entity', e.target.value)}
            className="w-full text-[11px] px-2 py-1 rounded border border-wedd-gray-200 bg-white text-wedd-black focus:outline-none focus:ring-1 focus:ring-wedd-mint appearance-none cursor-pointer"
          >
            <option value="">Entit&eacute; (toutes)</option>
            {tagOptions.entities.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <select
            value={tagFilters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            className="w-full text-[11px] px-2 py-1 rounded border border-wedd-gray-200 bg-white text-wedd-black focus:outline-none focus:ring-1 focus:ring-wedd-mint appearance-none cursor-pointer"
          >
            <option value="">P&eacute;riode (toutes)</option>
            {tagOptions.periods.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={tagFilters.document_type}
            onChange={(e) => handleFilterChange('document_type', e.target.value)}
            className="w-full text-[11px] px-2 py-1 rounded border border-wedd-gray-200 bg-white text-wedd-black focus:outline-none focus:ring-1 focus:ring-wedd-mint appearance-none cursor-pointer"
          >
            <option value="">Type (tous)</option>
            {tagOptions.docTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {hasActiveTagFilters && tagFilteredIds !== null && (
          <p className="text-[10px] text-wedd-gray-400 mt-1.5">
            {tagFilteredIds.length} document{tagFilteredIds.length !== 1 ? 's' : ''} correspondant{tagFilteredIds.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <TreeView
          items={documents}
          selectedId={selectedDocumentId}
          filteredIds={combinedFilteredIds}
          onSelect={handleSelectDocument}
          projectName={projectName}
          showTags
        />
      </div>
    </div>
  );
}
