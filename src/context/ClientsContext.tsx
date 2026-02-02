'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { clients as initialClients } from '@/data';
import { Client, ClientContact } from '@/types';

interface ClientsContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'initials' | 'color'>) => Client;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  getClientById: (clientId: string) => Client | undefined;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// Helper to generate initials from name
function generateInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// Helper to generate random color
function generateColor(): string {
  const colors = ['#6B00E0', '#0033A0', '#00D4AA', '#E91E8C', '#FFB800'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);

  const addClient = useCallback((clientData: Omit<Client, 'id' | 'initials' | 'color'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      initials: generateInitials(clientData.name),
      color: generateColor(),
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  }, []);

  const updateClient = useCallback((updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  }, []);

  const getClientById = useCallback((clientId: string): Client | undefined => {
    return clients.find(c => c.id === clientId);
  }, [clients]);

  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, deleteClient, getClientById }}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
}
