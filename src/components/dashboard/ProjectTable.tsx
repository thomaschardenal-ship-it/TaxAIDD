'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Project } from '@/types';
import { getClientById, getUserById } from '@/data';
import { StatusBadge, DomainBadge } from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import ProgressBar from '@/components/ui/ProgressBar';

interface ProjectTableProps {
  projects: Project[];
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th>Dossier</th>
            <th>Client</th>
            <th>Statut</th>
            <th>Responsable</th>
            <th>Progression</th>
            <th>Deadline</th>
            <th>Domaines</th>
            <th className="w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            const client = getClientById(project.clientId);
            const responsible = getUserById(project.responsibleId);

            return (
              <tr key={project.id} className="hover:bg-taxaidd-gray-light/50">
                <td>
                  <span className="font-medium text-taxaidd-black">{project.name}</span>
                </td>
                <td>
                  {client && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: client.color }}
                      >
                        {client.initials}
                      </div>
                      <span className="text-sm">{client.name}</span>
                    </div>
                  )}
                </td>
                <td>
                  <StatusBadge status={project.status} />
                </td>
                <td>
                  {responsible && (
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={responsible.name}
                        initials={responsible.initials}
                        color={responsible.color}
                        size="sm"
                      />
                      <span className="text-sm">{responsible.name}</span>
                    </div>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <ProgressBar value={project.progress} size="sm" className="flex-1" />
                    <span className="text-xs font-medium text-gray-600">{project.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className="text-sm">{formatDate(project.endDate)}</span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {project.domains.map(domain => (
                      <DomainBadge key={domain} domain={domain} size="sm" />
                    ))}
                  </div>
                </td>
                <td>
                  <Link
                    href={`/project/${project.id}`}
                    className="inline-flex items-center gap-1 text-taxaidd-purple hover:underline text-sm"
                  >
                    Ouvrir
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
