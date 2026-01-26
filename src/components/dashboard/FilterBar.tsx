'use client';

import React from 'react';
import { Search, LayoutGrid, List, Filter } from 'lucide-react';
import { DomainType, ProjectStatus } from '@/types';
import { clients, users } from '@/data';
import Button from '@/components/ui/Button';

interface FilterBarProps {
  view: 'cards' | 'list';
  onViewChange: (view: 'cards' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    clientId: string | null;
    status: ProjectStatus | null;
    responsibleId: string | null;
    domain: DomainType | null;
  };
  onFilterChange: (key: string, value: string | null) => void;
}

export default function FilterBar({
  view,
  onViewChange,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
}: FilterBarProps) {
  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: 'en-cours', label: 'En cours' },
    { value: 'review', label: 'Review' },
    { value: 'valide', label: 'Validé' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const domainOptions: { value: DomainType; label: string }[] = [
    { value: 'TAX', label: 'TAX' },
    { value: 'Social', label: 'Social' },
    { value: 'Corporate', label: 'Corporate' },
    { value: 'IP/IT', label: 'IP/IT' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un dossier..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-omni-purple focus:ring-1 focus:ring-omni-purple"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />

          {/* Client filter */}
          <select
            value={filters.clientId || ''}
            onChange={(e) => onFilterChange('clientId', e.target.value || null)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-omni-purple"
          >
            <option value="">Tous les clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value || null)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-omni-purple"
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Responsible filter */}
          <select
            value={filters.responsibleId || ''}
            onChange={(e) => onFilterChange('responsibleId', e.target.value || null)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-omni-purple"
          >
            <option value="">Tous les responsables</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          {/* Domain filter */}
          <select
            value={filters.domain || ''}
            onChange={(e) => onFilterChange('domain', e.target.value || null)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-omni-purple"
          >
            <option value="">Tous les domaines</option>
            {domainOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-omni-gray-light rounded-lg p-1 ml-auto">
          <button
            onClick={() => onViewChange('cards')}
            className={`p-2 rounded-md transition-colors ${
              view === 'cards' ? 'bg-white shadow-sm text-omni-purple' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Vue cartes"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`p-2 rounded-md transition-colors ${
              view === 'list' ? 'bg-white shadow-sm text-omni-purple' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Vue liste"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
