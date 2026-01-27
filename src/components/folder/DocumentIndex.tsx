'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { DocumentItem } from '@/types';
import { useProjectContext } from '@/context/ProjectContext';
import TreeView from '@/components/ui/TreeView';
import Button from '@/components/ui/Button';
import { countDocumentsByStatus } from '@/data';

interface DocumentIndexProps {
  documents: DocumentItem[];
  projectName: string;
  onImport: () => void;
}

export default function DocumentIndex({ documents, projectName, onImport }: DocumentIndexProps) {
  const { selectedDocumentId, filteredDocumentIds, setSelectedDocument } = useProjectContext();

  const stats = countDocumentsByStatus(documents);

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
          <h3 className="font-semibold text-taxaidd-black">Documents</h3>
          <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />} onClick={onImport}>
            Importer
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          {stats.received} / {stats.total} documents reçus
        </p>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <TreeView
          items={documents}
          selectedId={selectedDocumentId}
          filteredIds={filteredDocumentIds}
          onSelect={handleSelectDocument}
          projectName={projectName}
        />
      </div>
    </div>
  );
}
