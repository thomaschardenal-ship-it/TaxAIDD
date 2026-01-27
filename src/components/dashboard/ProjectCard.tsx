'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Project } from '@/types';
import { getClientById, getUserById, getUsersByIds } from '@/data';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge, DomainBadge } from '@/components/ui/Badge';
import { AvatarGroup } from '@/components/ui/Avatar';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const client = getClientById(project.clientId);
  const responsible = getUserById(project.responsibleId);
  const teamMembers = getUsersByIds(project.teamIds);

  const endDate = new Date(project.endDate);
  const today = new Date();
  const daysUntilDeadline = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card hover className="group">
      <CardContent className="p-5">
        {/* Header with status */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-taxaidd-black text-lg leading-tight pr-2">
            {project.name}
          </h3>
          <StatusBadge status={project.status} />
        </div>

        {/* Client */}
        {client && (
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: client.color }}
            >
              {client.initials}
            </div>
            <div>
              <p className="text-sm font-medium text-taxaidd-black">{client.name}</p>
              <p className="text-xs text-gray-500">{client.industry}</p>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(project.startDate)} → {formatDate(project.endDate)}</span>
          {isUrgent && (
            <span className="badge badge-urgent ml-auto">
              {daysUntilDeadline}j restants
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-gray-600">Progression</span>
            <span className="text-sm font-semibold text-taxaidd-black">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>

        {/* Team */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Équipe:</span>
            <AvatarGroup
              users={[
                responsible ? { name: responsible.name, initials: responsible.initials, color: responsible.color } : { name: '', initials: '?', color: '#ccc' },
                ...teamMembers.map(m => ({ name: m.name, initials: m.initials, color: m.color })),
              ]}
              max={4}
              size="sm"
            />
          </div>
        </div>

        {/* Domains */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.domains.map(domain => (
            <DomainBadge key={domain} domain={domain} size="sm" />
          ))}
        </div>

        {/* Action */}
        <Link href={`/project/${project.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:border-taxaidd-yellow group-hover:bg-taxaidd-yellow/10"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Ouvrir
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
