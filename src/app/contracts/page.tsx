'use client';

import React, { useState, useMemo } from 'react';
import { FileSignature, Plus, Eye, Filter, Calendar, Euro } from 'lucide-react';
import { useContracts } from '@/context/ContractsContext';
import { SubcontractingContract, ContractStatus, DomainType } from '@/types';
import Button from '@/components/ui/Button';
import ContractGenerationModal from '@/components/contracts/ContractGenerationModal';
import ContractPreviewModal from '@/components/contracts/ContractPreviewModal';

const statusConfig: Record<ContractStatus, { label: string; color: string; bg: string }> = {
  brouillon: { label: 'Brouillon', color: 'text-gray-600', bg: 'bg-gray-100' },
  'en-revision': { label: 'En révision', color: 'text-amber-600', bg: 'bg-amber-50' },
  valide: { label: 'Validé', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  signe: { label: 'Signé', color: 'text-blue-600', bg: 'bg-blue-50' },
};

const domainColors: Record<DomainType, string> = {
  'TAX': '#6B00E0',
  'Social': '#00D4AA',
  'Corporate': '#0033A0',
  'IP/IT': '#E91E8C',
};

export default function ContractsPage() {
  const { contracts } = useContracts();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [previewContract, setPreviewContract] = useState<SubcontractingContract | null>(null);
  const [filterStatus, setFilterStatus] = useState<ContractStatus | ''>('');

  const filteredContracts = useMemo(() => {
    if (!filterStatus) return contracts;
    return contracts.filter(c => c.status === filterStatus);
  }, [contracts, filterStatus]);

  // Group by opportunity
  const groupedContracts = useMemo(() => {
    const groups: Record<string, { opportunityName: string; contracts: SubcontractingContract[] }> = {};
    filteredContracts.forEach(c => {
      if (!groups[c.opportunityId]) {
        groups[c.opportunityId] = { opportunityName: c.opportunityName, contracts: [] };
      }
      groups[c.opportunityId].contracts.push(c);
    });
    return groups;
  }, [filteredContracts]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { total: contracts.length };
    contracts.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  }, [contracts]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-wedd-black">Contrats de sous-traitance</h1>
          <p className="text-gray-500 mt-1">Gérez les contrats entre WeDD et les intervenants</p>
        </div>
        <Button onClick={() => setShowGenerateModal(true)} icon={<Plus className="w-4 h-4" />}>
          Nouveau contrat
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-wedd-black">{statusCounts.total || 0}</p>
        </div>
        {(Object.keys(statusConfig) as ContractStatus[]).map(status => (
          <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-500">{statusConfig[status].label}</p>
            <p className={`text-2xl font-bold ${statusConfig[status].color}`}>{statusCounts[status] || 0}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Filtrer par statut :</span>
          <button
            onClick={() => setFilterStatus('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !filterStatus ? 'bg-wedd-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {(Object.keys(statusConfig) as ContractStatus[]).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterStatus === status
                  ? `${statusConfig[status].bg} ${statusConfig[status].color}`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Contract list grouped by opportunity */}
      {Object.keys(groupedContracts).length === 0 ? (
        <div className="text-center py-12">
          <FileSignature className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun contrat trouvé</p>
          <p className="text-sm text-gray-400 mt-1">Cliquez sur &quot;Nouveau contrat&quot; pour en générer</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedContracts).map(([oppId, group]) => (
            <div key={oppId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-wedd-black">{group.opportunityName}</h3>
                <p className="text-xs text-gray-500">{group.contracts.length} contrat{group.contracts.length > 1 ? 's' : ''}</p>
              </div>
              <div className="divide-y divide-gray-100">
                {group.contracts.map(contract => {
                  const domainColor = domainColors[contract.domain];
                  const statusConf = statusConfig[contract.status];
                  return (
                    <div key={contract.id} className="px-5 py-4 flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${domainColor}15` }}
                      >
                        <FileSignature className="w-5 h-5" style={{ color: domainColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{contract.specialistName}</p>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${domainColor}15`, color: domainColor }}
                          >
                            {contract.domain}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {contract.timeline.estimatedDays}j
                          </span>
                          <span className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {contract.budget.totalAmount.toLocaleString('fr-FR')} €
                          </span>
                          <span>Créé le {contract.createdAt}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                      <button
                        onClick={() => setPreviewContract(contract)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Voir le contrat"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generation modal */}
      <ContractGenerationModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
      />

      {/* Preview modal */}
      <ContractPreviewModal
        contract={previewContract}
        isOpen={!!previewContract}
        onClose={() => setPreviewContract(null)}
      />
    </div>
  );
}
