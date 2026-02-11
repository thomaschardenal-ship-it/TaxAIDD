export interface Notification {
  id: string;
  type: 'document_uploaded' | 'review_request' | 'deadline' | 'task_assigned' | 'status_change';
  title: string;
  message: string;
  projectId?: string;
  createdAt: string;
  read: boolean;
}

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'document_uploaded',
    title: 'Document ajouté',
    message: 'Sophie Laurent a uploadé "Liasse 2050-2059 N-1" dans Acquisition TechVision',
    projectId: 'project-1',
    createdAt: '2025-01-15T14:30:00',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'review_request',
    title: 'Review demandée',
    message: 'Thomas Bernard demande une review sur la section "Tax Positions & Risks"',
    projectId: 'project-1',
    createdAt: '2025-01-15T11:00:00',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'deadline',
    title: 'Deadline proche',
    message: 'Le projet "Acquisition TechVision" arrive à échéance dans 5 jours',
    projectId: 'project-1',
    createdAt: '2025-01-15T09:00:00',
    read: false,
  },
  {
    id: 'notif-4',
    type: 'task_assigned',
    title: 'Tâche assignée',
    message: 'Marc Dubois vous a assigné "Compléter l\'analyse TVA Q4"',
    projectId: 'project-1',
    createdAt: '2025-01-14T16:45:00',
    read: true,
  },
  {
    id: 'notif-5',
    type: 'status_change',
    title: 'Statut mis à jour',
    message: 'Le document "Contrats Top Management" est passé en statut "Partiel"',
    projectId: 'project-1',
    createdAt: '2025-01-14T10:30:00',
    read: true,
  },
  {
    id: 'notif-6',
    type: 'document_uploaded',
    title: 'Documents reçus',
    message: 'Claire Martin a importé 3 documents dans la section Social',
    projectId: 'project-1',
    createdAt: '2025-01-13T15:20:00',
    read: true,
  },
  {
    id: 'notif-7',
    type: 'review_request',
    title: 'Section validée',
    message: 'Marc Dubois a validé la section "Legal Structure"',
    projectId: 'project-1',
    createdAt: '2025-01-13T09:15:00',
    read: true,
  },
];

export const getUnreadCount = (): number => {
  return notifications.filter(n => !n.read).length;
};
