'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { DomainType, ProjectStatus } from '@/types';
import { currentUser } from '@/data';
import { useProjects } from '@/hooks';
import { Header } from '@/components/layout';
import { ProjectCard, ProjectTable, FilterBar, NewProjectModal } from '@/components/dashboard';
import Button from '@/components/ui/Button';

interface Filters {
  clientId: string | null;
  status: ProjectStatus | null;
  responsibleId: string | null;
  domain: DomainType | null;
}

export default function DashboardPage() {
  const { projects, loading, error } = useProjects();
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    clientId: null,
    status: null,
    responsibleId: null,
    domain: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = currentUser.role === 'admin';

  const handleFilterChange = (key: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!project.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Client filter
      if (filters.clientId && project.clientId !== filters.clientId) {
        return false;
      }

      // Status filter
      if (filters.status && project.status !== filters.status) {
        return false;
      }

      // Responsible filter
      if (filters.responsibleId && project.responsibleId !== filters.responsibleId) {
        return false;
      }

      // Domain filter
      if (filters.domain && !project.domains.includes(filters.domain)) {
        return false;
      }

      return true;
    });
  }, [projects, searchQuery, filters]);

  const handleNewProject = (data: Parameters<typeof NewProjectModal>[0]['onSubmit'] extends (d: infer T) => void ? T : never) => {
    console.log('[Dashboard] New project created:', data);
    // In a real app, this would add to the projects list
    // For now, just close the modal
  };

  return (
    <div className="min-h-screen">
      <Header
        title={isAdmin ? 'Tous les Projets' : 'Mes Projets'}
        actions={
          isAdmin && (
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Nouveau Dossier
            </Button>
          )
        }
      />

      <div className="p-6">
        <FilterBar
          view={view}
          onViewChange={setView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-wedd-mint" />
            <span className="ml-3 text-gray-500">Chargement des dossiers...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Erreur: {error.message}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun dossier trouvé</p>
          </div>
        ) : view === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <ProjectTable projects={filteredProjects} />
        )}
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewProject}
      />
    </div>
  );
}
