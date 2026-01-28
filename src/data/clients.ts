import { Client } from '@/types';

export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Groupe TechVision',
    industry: 'Technologies',
    initials: 'TV',
    color: '#6B00E0',
    address: '45 Avenue des Champs-Élysées, 75008 Paris',
    website: 'https://techvision.fr',
    siren: '123 456 789',
    contacts: [
      {
        id: 'contact-1-1',
        name: 'Jean-Marc Dupont',
        email: 'jm.dupont@techvision.fr',
        phone: '+33 1 23 45 67 89',
        role: 'Directeur Financier',
        isPrimary: true,
      },
      {
        id: 'contact-1-2',
        name: 'Marie Lefebvre',
        email: 'm.lefebvre@techvision.fr',
        phone: '+33 1 23 45 67 90',
        role: 'Responsable Juridique',
      },
      {
        id: 'contact-1-3',
        name: 'Paul Martin',
        email: 'p.martin@techvision.fr',
        role: 'Responsable RH',
      },
    ],
  },
  {
    id: 'client-2',
    name: 'Holding Innovate',
    industry: 'Services',
    initials: 'HI',
    color: '#0033A0',
    address: '12 Rue de la Paix, 75002 Paris',
    website: 'https://holding-innovate.com',
    siren: '987 654 321',
    contacts: [
      {
        id: 'contact-2-1',
        name: 'Sophie Bernard',
        email: 's.bernard@holding-innovate.com',
        phone: '+33 1 98 76 54 32',
        role: 'DAF',
        isPrimary: true,
      },
    ],
  },
];

export const getClientById = (id: string): Client | undefined =>
  clients.find(client => client.id === id);
