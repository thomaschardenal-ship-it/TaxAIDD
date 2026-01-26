import { Client } from '@/types';

export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Groupe TechVision',
    industry: 'Technologies',
    initials: 'TV',
    color: '#6B00E0',
  },
  {
    id: 'client-2',
    name: 'Holding Innovate',
    industry: 'Services',
    initials: 'HI',
    color: '#0033A0',
  },
];

export const getClientById = (id: string): Client | undefined =>
  clients.find(client => client.id === id);
