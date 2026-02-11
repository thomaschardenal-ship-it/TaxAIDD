'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Calendar, User, TrendingUp, Target, Euro, BarChart3, Building2, Users, ArrowRight, Filter, X } from 'lucide-react';
import { DomainType } from '@/types';
import { Header } from '@/components/layout';
import Button from '@/components/ui/Button';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import { DomainBadge } from '@/components/ui/Badge';
import { NewOpportunityModal } from '@/components/dashboard';
import {
  opportunities,
  allStages,
  stageConfig,
  getOpportunitiesByStage,
  getTotalPipelineValue,
  getWeightedPipelineValue,
  getAvailableYears,
  getAvailableLeaders,
  type Opportunity,
  type PipelineStage,
} from '@/data/pipeline';

// ─── Domain filter config ────────────────────────────────────────────────────

const domainFilterOptions: { value: DomainType; label: string; color: string }[] = [
  { value: 'TAX', label: 'Fiscal', color: '#6B00E0' },
  { value: 'Social', label: 'Social', color: '#00D4AA' },
  { value: 'Corporate', label: 'Corporate', color: '#0033A0' },
  { value: 'IP/IT', label: 'IP/IT', color: '#E91E8C' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatValue(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }
  return value.toString();
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-wedd-mint/10 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-wedd-black">{value}</p>
      {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
    </div>
  );
}

// ─── Opportunity Card ────────────────────────────────────────────────────────

function OpportunityCard({ opportunity, onClick }: { opportunity: Opportunity; onClick: () => void }) {
  const config = stageConfig[opportunity.stage];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group"
    >
      <h4 className="font-semibold text-sm text-wedd-black group-hover:text-wedd-mint transition-colors leading-tight">
        {opportunity.name}
      </h4>
      <p className="text-xs text-gray-400 mt-1">{opportunity.clientName}</p>

      <div className="flex flex-wrap gap-1 mt-2.5">
        {opportunity.domains.map((domain) => (
          <DomainBadge key={domain} domain={domain} size="sm" />
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold text-wedd-black">{formatCurrency(opportunity.estimatedValue)}</span>
        <span className={`text-xs font-medium ${config.color}`}>{opportunity.probability}%</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
        <div
          className="h-1.5 rounded-full bg-wedd-mint transition-all duration-300"
          style={{ width: `${opportunity.probability}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <User className="w-3 h-3" />
          <span>{opportunity.responsibleName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(opportunity.expectedCloseDate)}</span>
        </div>
      </div>

      {opportunity.stage === 'terminee' && (
        <Link
          href="/project/project-1"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 mt-2.5 text-xs font-medium text-wedd-mint hover:underline"
        >
          Voir le dossier DD <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

// ─── Kanban Column ───────────────────────────────────────────────────────────

function KanbanColumn({ stage, filteredOpps, onCardClick }: { stage: PipelineStage; filteredOpps: Opportunity[]; onCardClick: (opp: Opportunity) => void }) {
  const config = stageConfig[stage];
  const stageOpps = filteredOpps.filter(o => o.stage === stage);
  const stageValue = stageOpps.reduce((sum, o) => sum + o.estimatedValue, 0);

  return (
    <div className="flex flex-col min-w-[280px] flex-1">
      <div className={`rounded-t-xl px-4 py-3 ${config.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-semibold ${config.color}`}>{config.label}</h3>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${config.bgColor} ${config.color} border border-current/10`}>
              {stageOpps.length}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{formatCurrency(stageValue)}</p>
      </div>

      <div className="flex-1 bg-gray-50/50 rounded-b-xl border border-t-0 border-gray-100 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-420px)] min-h-[200px]">
        {stageOpps.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-xs text-gray-300">
            Aucune opportunité
          </div>
        ) : (
          stageOpps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} onClick={() => onCardClick(opp)} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Opportunity Detail Modal ────────────────────────────────────────────────

function OpportunityDetailModal({ opportunity, isOpen, onClose }: { opportunity: Opportunity | null; isOpen: boolean; onClose: () => void }) {
  if (!opportunity) return null;

  const config = stageConfig[opportunity.stage];

  const handleStageAction = () => {
    if (opportunity.stage === 'proposition') {
      alert('Génération de la proposition commerciale en cours...');
    } else if (opportunity.stage === 'engagement') {
      alert('Génération de la lettre d\'engagement en cours...');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={opportunity.name} size="lg">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className={`badge ${config.bgColor} ${config.color} text-sm px-3 py-1 rounded-full`}>
            {config.label}
          </span>
          <span className="text-sm text-gray-400">
            Probabilité: <span className="font-semibold text-wedd-black">{opportunity.probability}%</span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Building2 className="w-4 h-4" />
            <span className="font-medium">Client</span>
          </div>
          <p className="text-wedd-black font-medium pl-6">{opportunity.clientName}</p>
        </div>

        {opportunity.description && (
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{opportunity.description}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 font-medium mb-2">Domaines</p>
          <div className="flex flex-wrap gap-2">
            {opportunity.domains.map((domain) => (
              <DomainBadge key={domain} domain={domain} size="md" />
            ))}
          </div>
        </div>

        {opportunity.companies && opportunity.companies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">Sociétés concernées</span>
            </div>
            <ul className="space-y-1 pl-6">
              {opportunity.companies.map((company) => (
                <li key={company} className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-wedd-mint flex-shrink-0" />
                  {company}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Euro className="w-4 h-4" />
              <span>Valeur estimée</span>
            </div>
            <p className="text-lg font-bold text-wedd-black">{formatCurrency(opportunity.estimatedValue)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Target className="w-4 h-4" />
              <span>Valeur pondérée</span>
            </div>
            <p className="text-lg font-bold text-wedd-black">
              {formatCurrency(opportunity.estimatedValue * opportunity.probability / 100)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <User className="w-4 h-4" />
            <span className="font-medium">Responsable</span>
          </div>
          <p className="text-sm text-wedd-black pl-6">{opportunity.responsibleName}</p>
        </div>

        {opportunity.teamIds && opportunity.teamIds.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="font-medium">Équipe ({opportunity.teamIds.length} membres)</span>
            </div>
            <p className="text-xs text-gray-400 pl-6">
              {opportunity.teamIds.join(', ')}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Date de closing prévue</span>
            </div>
            <p className="text-sm text-wedd-black pl-6">{formatDate(opportunity.expectedCloseDate)}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Date de création</span>
            </div>
            <p className="text-sm text-wedd-black pl-6">{formatDate(opportunity.createdAt)}</p>
          </div>
        </div>
      </div>

      <ModalFooter>
        {opportunity.stage === 'proposition' && (
          <Button variant="mint" onClick={handleStageAction}>
            Générer Proposition
          </Button>
        )}
        {opportunity.stage === 'engagement' && (
          <Button variant="mint" onClick={handleStageAction}>
            Générer Lettre d&apos;Engagement
          </Button>
        )}
        {opportunity.stage === 'terminee' && (
          <Link href="/project/project-1">
            <Button variant="mint" showArrow>
              Voir le Dossier DD
            </Button>
          </Link>
        )}
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// ─── Filter Bar ──────────────────────────────────────────────────────────────

interface PipelineFilters {
  domain: DomainType | null;
  year: number | null;
  leaderId: string | null;
}

function PipelineFilterBar({ filters, onChange, activeCount }: { filters: PipelineFilters; onChange: (f: PipelineFilters) => void; activeCount: number }) {
  const years = getAvailableYears();
  const leaders = getAvailableLeaders();

  const clearAll = () => onChange({ domain: null, year: null, leaderId: null });

  return (
    <div className="flex items-center gap-3 flex-wrap mb-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filtres</span>
      </div>

      {/* Domain filter */}
      <div className="flex items-center gap-1.5">
        {domainFilterOptions.map(d => (
          <button
            key={d.value}
            onClick={() => onChange({ ...filters, domain: filters.domain === d.value ? null : d.value })}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
              filters.domain === d.value
                ? 'border-current shadow-sm'
                : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            style={filters.domain === d.value ? { backgroundColor: `${d.color}15`, color: d.color, borderColor: `${d.color}40` } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-gray-200" />

      {/* Year filter */}
      <select
        value={filters.year ?? ''}
        onChange={(e) => onChange({ ...filters, year: e.target.value ? parseInt(e.target.value) : null })}
        className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white focus:outline-none focus:border-wedd-black cursor-pointer"
      >
        <option value="">Toutes les années</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      {/* Leader filter */}
      <select
        value={filters.leaderId ?? ''}
        onChange={(e) => onChange({ ...filters, leaderId: e.target.value || null })}
        className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white focus:outline-none focus:border-wedd-black cursor-pointer"
      >
        <option value="">Tous les leaders</option>
        {leaders.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      {/* Active filter count + clear */}
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        >
          <X className="w-3 h-3" />
          Effacer ({activeCount})
        </button>
      )}
    </div>
  );
}

// ─── Main Pipeline Page ──────────────────────────────────────────────────────

export default function PipelinePage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOppOpen, setIsNewOppOpen] = useState(false);
  const [filters, setFilters] = useState<PipelineFilters>({ domain: null, year: null, leaderId: null });

  // ── Filtered opportunities ──────────────────────────────────────────────

  const filteredOpps = useMemo(() => {
    return opportunities.filter(o => {
      if (filters.domain && !o.domains.includes(filters.domain)) return false;
      if (filters.year && o.year !== filters.year) return false;
      if (filters.leaderId && o.responsibleId !== filters.leaderId) return false;
      return true;
    });
  }, [filters]);

  const activeFilterCount = [filters.domain, filters.year, filters.leaderId].filter(Boolean).length;

  // ── Dynamic KPIs based on filtered data ─────────────────────────────────

  const totalValue = useMemo(() => getTotalPipelineValue(filteredOpps), [filteredOpps]);
  const weightedValue = useMemo(() => getWeightedPipelineValue(filteredOpps), [filteredOpps]);

  const termineeOpps = useMemo(() => filteredOpps.filter(o => o.stage === 'terminee'), [filteredOpps]);
  const winRate = useMemo(() => {
    if (filteredOpps.length === 0) return 0;
    return Math.round((termineeOpps.length / filteredOpps.length) * 100);
  }, [filteredOpps, termineeOpps]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleCardClick = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOpportunity(null);
  };

  const handleNewOpportunity = (data: Parameters<typeof NewOpportunityModal>[0]['onSubmit'] extends (d: infer T) => void ? T : never) => {
    console.log('[Pipeline] New opportunity created:', data);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Pipeline Commercial"
        actions={
          <Button
            onClick={() => setIsNewOppOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Nouvelle Opportunité
          </Button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <PipelineFilterBar
          filters={filters}
          onChange={setFilters}
          activeCount={activeFilterCount}
        />

        {/* KPI Cards — dynamic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            icon={<BarChart3 className="w-5 h-5 text-wedd-mint" />}
            label="Opportunités"
            value={filteredOpps.length.toString()}
            subValue={activeFilterCount > 0 ? `sur ${opportunities.length} au total` : 'Total dans le pipeline'}
          />
          <KpiCard
            icon={<Euro className="w-5 h-5 text-wedd-mint" />}
            label="Honoraires Pipeline"
            value={`\u20AC${formatValue(totalValue)}`}
            subValue="Valeur brute totale"
          />
          <KpiCard
            icon={<Target className="w-5 h-5 text-wedd-mint" />}
            label="Honoraires Pondérés"
            value={`\u20AC${formatValue(weightedValue)}`}
            subValue="Ajustés par probabilité"
          />
          <KpiCard
            icon={<TrendingUp className="w-5 h-5 text-wedd-mint" />}
            label="Taux de conversion"
            value={`${winRate}%`}
            subValue={`${termineeOpps.length} terminée(s) sur ${filteredOpps.length}`}
          />
        </div>

        {/* Kanban Board — 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {allStages.map((stage) => (
            <KanbanColumn key={stage} stage={stage} filteredOpps={filteredOpps} onCardClick={handleCardClick} />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />

      {/* New Opportunity Modal (same as Dashboard) */}
      <NewOpportunityModal
        isOpen={isNewOppOpen}
        onClose={() => setIsNewOppOpen(false)}
        onSubmit={handleNewOpportunity}
      />
    </div>
  );
}
