import { User } from '@/types';

// Domain colors for reference:
// TAX: #6B00E0 (purple)
// Social: #00D4AA (green/mint)
// Corporate: #0033A0 (blue)
// IP/IT: #E91E8C (magenta)

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Marc Dubois',
    email: 'admin@wedd.fr',
    role: 'admin',
    title: 'Admin Fiscaliste',
    initials: 'MD',
    color: '#6B00E0', // TAX purple
  },
  {
    id: 'user-2',
    name: 'Sophie Laurent',
    email: 'slaurent@wedd.fr',
    role: 'senior',
    title: 'Fiscaliste Senior',
    initials: 'SL',
    color: '#6B00E0', // TAX purple
  },
  {
    id: 'user-3',
    name: 'Thomas Bernard',
    email: 'tbernard@wedd.fr',
    role: 'junior',
    title: 'Fiscaliste Junior',
    initials: 'TB',
    color: '#6B00E0', // TAX purple
  },
  {
    id: 'user-4',
    name: 'Claire Martin',
    email: 'cmartin@wedd.fr',
    role: 'specialist',
    title: 'Spécialiste Social',
    initials: 'CM',
    color: '#00D4AA', // Social green
  },
  {
    id: 'user-5',
    name: 'Pierre Durand',
    email: 'pdurand@wedd.fr',
    role: 'specialist',
    title: 'Spécialiste Corporate',
    initials: 'PD',
    color: '#0033A0', // Corporate blue
  },
  {
    id: 'user-6',
    name: 'Julie Moreau',
    email: 'jmoreau@wedd.fr',
    role: 'specialist',
    title: 'Spécialiste IP/IT',
    initials: 'JM',
    color: '#E91E8C', // IP/IT magenta
  },
];

export const currentUser = users[0]; // Marc Dubois - Admin

export const getUserById = (id: string): User | undefined =>
  users.find(user => user.id === id);

export const getUsersByIds = (ids: string[]): User[] =>
  users.filter(user => ids.includes(user.id));

// Domain color helper - matches domain to color
export const domainColors: Record<string, string> = {
  'TAX': '#6B00E0',
  'Social': '#00D4AA',
  'Corporate': '#0033A0',
  'IP/IT': '#E91E8C',
};
