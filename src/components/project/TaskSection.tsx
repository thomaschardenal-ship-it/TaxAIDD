'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, User, CheckCircle2 } from 'lucide-react';
import { DomainType } from '@/types';
import { DomainBadge } from '@/components/ui/Badge';
import {
  getTasksForProject,
  Task,
  TaskStatus,
  TaskPriority,
  statusConfig,
  priorityConfig,
} from '@/data/tasks';

interface TaskSectionProps {
  projectId: string;
}

type GroupBy = 'collaborator' | 'domain' | 'priority';
type StatusFilter = 'all' | TaskStatus;
type DomainFilter = 'all' | DomainType;

const priorityOrder: TaskPriority[] = ['urgent', 'high', 'normal', 'low'];

const domains: DomainType[] = ['TAX', 'Social', 'Corporate', 'IP/IT'];

export default function TaskSection({ projectId }: TaskSectionProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>('collaborator');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [domainFilter, setDomainFilter] = useState<DomainFilter>('all');

  const allTasks = useMemo(() => getTasksForProject(projectId), [projectId]);

  const filteredTasks = useMemo(() => {
    let result = allTasks;
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (domainFilter !== 'all') {
      result = result.filter(t => t.domain === domainFilter);
    }
    return result;
  }, [allTasks, statusFilter, domainFilter]);

  const doneCount = allTasks.filter(t => t.status === 'done').length;
  const totalCount = allTasks.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const groupedTasks = useMemo(() => {
    const groups: Record<string, { label: string; domain?: DomainType; priority?: TaskPriority; tasks: Task[] }> = {};

    if (groupBy === 'collaborator') {
      filteredTasks.forEach(task => {
        if (!groups[task.assignedTo]) {
          groups[task.assignedTo] = { label: task.assignedName, tasks: [] };
        }
        groups[task.assignedTo].tasks.push(task);
      });
    } else if (groupBy === 'domain') {
      filteredTasks.forEach(task => {
        if (!groups[task.domain]) {
          groups[task.domain] = { label: task.domain, domain: task.domain, tasks: [] };
        }
        groups[task.domain].tasks.push(task);
      });
    } else {
      // Group by priority — maintain priority order
      priorityOrder.forEach(p => {
        const matching = filteredTasks.filter(t => t.priority === p);
        if (matching.length > 0) {
          groups[p] = { label: priorityConfig[p].label, priority: p, tasks: matching };
        }
      });
    }

    return Object.values(groups);
  }, [filteredTasks, groupBy]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-wedd-black">Tâches</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{doneCount} / {totalCount} tâches terminées</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #00D4AA, #7FFFD4)',
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Group by toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setGroupBy('collaborator')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                groupBy === 'collaborator'
                  ? 'bg-white text-wedd-black shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Par collaborateur
            </button>
            <button
              onClick={() => setGroupBy('domain')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                groupBy === 'domain'
                  ? 'bg-white text-wedd-black shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Par domaine
            </button>
            <button
              onClick={() => setGroupBy('priority')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                groupBy === 'priority'
                  ? 'bg-white text-wedd-black shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Par priorité
            </button>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-200" />

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                statusFilter === 'all'
                  ? 'bg-wedd-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            {(Object.keys(statusConfig) as TaskStatus[]).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  statusFilter === status
                    ? `${statusConfig[status].bgColor} ${statusConfig[status].color} font-medium`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {statusConfig[status].label}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-200" />

          {/* Domain filter */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDomainFilter('all')}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                domainFilter === 'all'
                  ? 'bg-wedd-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            {domains.map(domain => (
              <button
                key={domain}
                onClick={() => setDomainFilter(domainFilter === domain ? 'all' : domain)}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  domainFilter === domain
                    ? 'bg-wedd-black text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="divide-y divide-gray-50">
        {groupedTasks.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-gray-400">
            Aucune tâche ne correspond aux filtres sélectionnés.
          </div>
        )}

        {groupedTasks.map((group, gIdx) => (
          <div key={gIdx}>
            {/* Group header */}
            <div className="px-6 py-3 bg-gray-50/60 flex items-center gap-2">
              {groupBy === 'collaborator' ? (
                <>
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-wedd-black">{group.label}</span>
                </>
              ) : groupBy === 'domain' ? (
                <>
                  {group.domain && <DomainBadge domain={group.domain} size="sm" />}
                </>
              ) : (
                <>
                  {group.priority && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityConfig[group.priority].bgColor} ${priorityConfig[group.priority].color}`}>
                      {priorityConfig[group.priority].label}
                    </span>
                  )}
                </>
              )}
              <span className="text-xs text-gray-400 ml-1">
                ({group.tasks.length} tâche{group.tasks.length > 1 ? 's' : ''})
              </span>
            </div>

            {/* Tasks in group */}
            <div>
              {group.tasks.map(task => (
                <div
                  key={task.id}
                  className="px-6 py-2.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors cursor-default"
                >
                  {/* Status indicator dot */}
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.status === 'done'
                        ? 'bg-emerald-400'
                        : task.status === 'in_progress'
                        ? 'bg-blue-400'
                        : 'bg-gray-300'
                    }`}
                  />

                  {/* Title */}
                  <span
                    className={`text-sm flex-1 min-w-0 truncate ${
                      task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </span>

                  {/* Priority badge */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${priorityConfig[task.priority].bgColor} ${priorityConfig[task.priority].color}`}
                  >
                    {priorityConfig[task.priority].label}
                  </span>

                  {/* Domain badge (when grouped by collaborator) */}
                  {groupBy === 'collaborator' && (
                    <DomainBadge domain={task.domain} size="sm" />
                  )}

                  {/* Assignee name (when grouped by domain) */}
                  {groupBy === 'domain' && (
                    <span className="text-xs text-gray-500 flex-shrink-0 w-28 truncate text-right">
                      {task.assignedName}
                    </span>
                  )}

                  {/* Status badge */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${statusConfig[task.status].bgColor} ${statusConfig[task.status].color}`}
                  >
                    {statusConfig[task.status].label}
                  </span>

                  {/* Due date */}
                  <span className="text-xs text-gray-400 flex-shrink-0 w-16 text-right flex items-center justify-end gap-1">
                    {task.dueDate ? (
                      <>
                        <Calendar className="w-3 h-3" />
                        {formatDate(task.dueDate)}
                      </>
                    ) : (
                      <span className="text-gray-200">--</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
