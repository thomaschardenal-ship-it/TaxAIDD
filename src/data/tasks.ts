import { DomainType } from '@/types';

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedName: string;
  domain: DomainType;
  dueDate?: string;
}

export const tasks: Task[] = [
  { id: 'task-1', projectId: 'project-1', title: 'Compléter le tableau de détermination du résultat fiscal FY24', status: 'in_progress', priority: 'high', assignedTo: 'user-3', assignedName: 'Thomas Bernard', domain: 'TAX', dueDate: '2025-01-20' },
  { id: 'task-2', projectId: 'project-1', title: 'Réconciliation TVA Q4 2024', status: 'todo', priority: 'urgent', assignedTo: 'user-3', assignedName: 'Thomas Bernard', domain: 'TAX', dueDate: '2025-01-18' },
  { id: 'task-3', projectId: 'project-1', title: 'Revue des déclarations CIR FY22-23', status: 'done', priority: 'normal', assignedTo: 'user-2', assignedName: 'Sophie Laurent', domain: 'TAX' },
  { id: 'task-4', projectId: 'project-1', title: 'Analyser les contrats Top Management', status: 'in_progress', priority: 'high', assignedTo: 'user-4', assignedName: 'Claire Martin', domain: 'Social', dueDate: '2025-01-22' },
  { id: 'task-5', projectId: 'project-1', title: 'Vérifier la conformité URSSAF', status: 'todo', priority: 'urgent', assignedTo: 'user-4', assignedName: 'Claire Martin', domain: 'Social', dueDate: '2025-01-19' },
  { id: 'task-6', projectId: 'project-1', title: 'Compléter la revue des PV AG N-2', status: 'todo', priority: 'normal', assignedTo: 'user-5', assignedName: 'Pierre Durand', domain: 'Corporate' },
  { id: 'task-7', projectId: 'project-1', title: 'Vérifier les conventions réglementées', status: 'done', priority: 'normal', assignedTo: 'user-5', assignedName: 'Pierre Durand', domain: 'Corporate' },
  { id: 'task-8', projectId: 'project-1', title: 'Audit des licences open source', status: 'in_progress', priority: 'normal', assignedTo: 'user-6', assignedName: 'Julie Moreau', domain: 'IP/IT' },
  { id: 'task-9', projectId: 'project-1', title: 'Revue du registre RGPD', status: 'todo', priority: 'high', assignedTo: 'user-6', assignedName: 'Julie Moreau', domain: 'IP/IT', dueDate: '2025-01-25' },
  { id: 'task-10', projectId: 'project-1', title: 'Analyser les DPA fournisseurs', status: 'todo', priority: 'normal', assignedTo: 'user-6', assignedName: 'Julie Moreau', domain: 'IP/IT' },
  { id: 'task-11', projectId: 'project-1', title: 'Synthèse des risques fiscaux', status: 'todo', priority: 'high', assignedTo: 'user-2', assignedName: 'Sophie Laurent', domain: 'TAX', dueDate: '2025-01-28' },
  { id: 'task-12', projectId: 'project-1', title: 'Relancer le client pour les documents manquants', status: 'in_progress', priority: 'urgent', assignedTo: 'user-3', assignedName: 'Thomas Bernard', domain: 'TAX' },
];

export const getTasksForProject = (projectId: string): Task[] => {
  return tasks.filter(t => t.projectId === projectId);
};

export const statusConfig: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  todo: { label: 'À faire', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  in_progress: { label: 'En cours', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  done: { label: 'Fait', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
};

export const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-700', bgColor: 'bg-red-100' },
  high: { label: 'Haute', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  normal: { label: 'Normale', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  low: { label: 'Basse', color: 'text-gray-600', bgColor: 'bg-gray-100' },
};
