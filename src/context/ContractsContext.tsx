'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SubcontractingContract, ContractStatus } from '@/types';
import { contracts as initialContracts } from '@/data/contracts';

interface ContractsContextType {
  contracts: SubcontractingContract[];
  addContract: (contract: Omit<SubcontractingContract, 'id' | 'createdAt'>) => SubcontractingContract;
  updateContract: (contract: SubcontractingContract) => void;
  deleteContract: (contractId: string) => void;
  getContractsByOpportunity: (opportunityId: string) => SubcontractingContract[];
  updateContractStatus: (contractId: string, status: ContractStatus) => void;
}

const ContractsContext = createContext<ContractsContextType | undefined>(undefined);

export function ContractsProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<SubcontractingContract[]>(initialContracts);

  const addContract = useCallback((contractData: Omit<SubcontractingContract, 'id' | 'createdAt'>): SubcontractingContract => {
    const newContract: SubcontractingContract = {
      ...contractData,
      id: `contract-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContracts(prev => [...prev, newContract]);
    return newContract;
  }, []);

  const updateContract = useCallback((updatedContract: SubcontractingContract) => {
    setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
  }, []);

  const deleteContract = useCallback((contractId: string) => {
    setContracts(prev => prev.filter(c => c.id !== contractId));
  }, []);

  const getContractsByOpportunity = useCallback((opportunityId: string): SubcontractingContract[] => {
    return contracts.filter(c => c.opportunityId === opportunityId);
  }, [contracts]);

  const updateContractStatus = useCallback((contractId: string, status: ContractStatus) => {
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, status } : c));
  }, []);

  return (
    <ContractsContext.Provider value={{ contracts, addContract, updateContract, deleteContract, getContractsByOpportunity, updateContractStatus }}>
      {children}
    </ContractsContext.Provider>
  );
}

export function useContracts() {
  const context = useContext(ContractsContext);
  if (context === undefined) {
    throw new Error('useContracts must be used within a ContractsProvider');
  }
  return context;
}
