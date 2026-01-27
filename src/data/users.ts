import { User } from '@/types';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Marc Dubois',
    email: 'admin@taxaidd.fr',
    role: 'admin',
    title: 'Admin Fiscaliste',
    initials: 'MD',
    color: '#6B00E0',
  },
  {
    id: 'user-2',
    name: 'Sophie Laurent',
    email: 'slaurent@taxaidd.fr',
    role: 'senior',
    title: 'Fiscaliste Senior',
    initials: 'SL',
    color: '#0033A0',
  },
  {
    id: 'user-3',
    name: 'Thomas Bernard',
    email: 'tbernard@taxaidd.fr',
    role: 'junior',
    title: 'Fiscaliste Junior',
    initials: 'TB',
    color: '#00D4AA',
  },
  {
    id: 'user-4',
    name: 'Claire Martin',
    email: 'cmartin@taxaidd.fr',
    role: 'specialist',
    title: 'Spécialiste Social',
    initials: 'CM',
    color: '#E91E8C',
  },
  {
    id: 'user-5',
    name: 'Pierre Durand',
    email: 'pdurand@taxaidd.fr',
    role: 'specialist',
    title: 'Spécialiste Corporate',
    initials: 'PD',
    color: '#FFB800',
  },
  {
    id: 'user-6',
    name: 'Julie Moreau',
    email: 'jmoreau@taxaidd.fr',
    role: 'specialist',
    title: 'Spécialiste IP/IT',
    initials: 'JM',
    color: '#E91E8C',
  },
];

export const currentUser = users[0]; // Marc Dubois - Admin

export const getUserById = (id: string): User | undefined =>
  users.find(user => user.id === id);

export const getUsersByIds = (ids: string[]): User[] =>
  users.filter(user => ids.includes(user.id));
