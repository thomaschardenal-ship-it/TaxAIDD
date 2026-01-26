'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';
import { DocumentItem, DomainType } from '@/types';
import { DocumentStatusBadge } from './Badge';

interface TreeViewProps {
  items: DocumentItem[];
  selectedId: string | null;
  filteredIds: string[] | null;
  onSelect: (item: DocumentItem) => void;
  projectName?: string;
}

const domainColors: Record<DomainType, string> = {
  'TAX': '#6B00E0',
  'Social': '#00D4AA',
  'Corporate': '#0033A0',
  'IP/IT': '#E91E8C',
};

export default function TreeView({ items, selectedId, filteredIds, onSelect, projectName }: TreeViewProps) {
  return (
    <div className="text-sm">
      {projectName && (
        <div className="flex items-center gap-2 px-2 py-2 font-semibold text-omni-black mb-1">
          <Folder className="w-4 h-4 text-omni-yellow" />
          <span>{projectName}</span>
        </div>
      )}
      {items.map(item => (
        <TreeItem
          key={item.id}
          item={item}
          level={0}
          selectedId={selectedId}
          filteredIds={filteredIds}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

interface TreeItemProps {
  item: DocumentItem;
  level: number;
  selectedId: string | null;
  filteredIds: string[] | null;
  onSelect: (item: DocumentItem) => void;
}

function TreeItem({ item, level, selectedId, filteredIds, onSelect }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedId === item.id;
  const isDocument = !hasChildren;

  // Check if this item or any of its children are in the filtered list
  const isInFilter = filteredIds === null || isItemInFilter(item, filteredIds);
  const isGreyedOut = filteredIds !== null && !isInFilter;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(item);
    }
  };

  const domainColor = item.domain ? domainColors[item.domain] : '#C0C0C0';

  return (
    <div className={isGreyedOut ? 'opacity-30' : ''}>
      <div
        className={`
          flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer
          transition-all duration-150
          ${isSelected ? 'bg-omni-yellow/20 border-l-2 border-omni-yellow' : 'hover:bg-omni-gray-light'}
          ${isDocument && !isGreyedOut ? 'hover:bg-omni-yellow/10' : ''}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {/* Expand/Collapse or spacer */}
        {hasChildren ? (
          <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-400">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        ) : (
          <span className="w-4" />
        )}

        {/* Icon */}
        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 flex-shrink-0" style={{ color: domainColor }} />
          ) : (
            <Folder className="w-4 h-4 flex-shrink-0" style={{ color: domainColor }} />
          )
        ) : (
          <FileText className="w-4 h-4 flex-shrink-0 text-gray-400" />
        )}

        {/* Label */}
        <span className={`flex-1 truncate ${isSelected ? 'font-medium' : ''}`}>
          {item.code && <span className="text-gray-400 mr-1">{item.code}</span>}
          {item.name}
        </span>

        {/* Status badge for documents */}
        {isDocument && <DocumentStatusBadge status={item.status} />}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map(child => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              filteredIds={filteredIds}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to check if item or its children are in filter
function isItemInFilter(item: DocumentItem, filteredIds: string[]): boolean {
  if (filteredIds.includes(item.id)) return true;
  if (item.children) {
    return item.children.some(child => isItemInFilter(child, filteredIds));
  }
  return false;
}
