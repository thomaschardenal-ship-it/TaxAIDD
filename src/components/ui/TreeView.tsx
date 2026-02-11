'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';
import { DocumentItem, DomainType, TagType } from '@/types';
import { DocumentStatusBadge } from './Badge';

interface TreeViewProps {
  items: DocumentItem[];
  selectedId: string | null;
  filteredIds: string[] | null;
  onSelect: (item: DocumentItem) => void;
  projectName?: string;
  showTags?: boolean;
}

const tagColorMap: Record<TagType, string> = {
  document_type: 'bg-blue-100 text-blue-700',
  entity: 'bg-purple-100 text-purple-700',
  period: 'bg-amber-100 text-amber-700',
  domain: 'bg-emerald-100 text-emerald-700',
  free: 'bg-gray-100 text-gray-700',
};

const domainColors: Record<DomainType, string> = {
  'TAX': '#6B00E0',
  'Social': '#00D4AA',
  'Corporate': '#0033A0',
  'IP/IT': '#E91E8C',
};

export default function TreeView({ items, selectedId, filteredIds, onSelect, projectName, showTags = false }: TreeViewProps) {
  return (
    <div className="text-sm">
      {projectName && (
        <div className="flex items-center gap-2 px-2 py-2 font-semibold text-wedd-black mb-1">
          <Folder className="w-4 h-4 text-wedd-mint" />
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
          showTags={showTags}
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
  showTags?: boolean;
}

function TreeItem({ item, level, selectedId, filteredIds, onSelect, showTags = false }: TreeItemProps) {
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
    <div className={`transition-opacity duration-200 ${isGreyedOut ? 'opacity-40' : ''}`}>
      <div
        className={`
          flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer
          transition-all duration-150
          ${isSelected ? 'bg-wedd-mint/20 border-l-2 border-wedd-mint' : 'hover:bg-wedd-cream'}
          ${isDocument && !isGreyedOut ? 'hover:bg-wedd-mint/10' : ''}
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

      {/* Missing elements for partiel status */}
      {isDocument && item.status === 'partiel' && item.missingElements && item.missingElements.length > 0 && (
        <div
          className="ml-2 mb-1"
          style={{ paddingLeft: `${level * 16 + 32}px` }}
        >
          {item.missingElements.map((el, idx) => (
            <p key={idx} className="text-xs text-orange-600 leading-tight py-0.5">
              {el}
            </p>
          ))}
        </div>
      )}

      {/* Tags for leaf documents */}
      {showTags && isDocument && item.tags && item.tags.length > 0 && (
        <div
          className="flex flex-wrap gap-0.5 mb-0.5"
          style={{ paddingLeft: `${level * 16 + 32}px` }}
        >
          {item.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-[10px] px-1 py-0 rounded leading-tight ${tagColorMap[tag.type]}`}
            >
              {tag.value}
            </span>
          ))}
        </div>
      )}

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
              showTags={showTags}
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
