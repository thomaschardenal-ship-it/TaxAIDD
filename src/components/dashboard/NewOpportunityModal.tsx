'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Check, Search, Loader2, Building2, Plus, X, Globe, Users as UsersIcon, FileText, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { DomainType } from '@/types';
import { users } from '@/data';
import { cvProfiles, credentials, scopeTemplates } from '@/data/resources';
import { useClients } from '@/context/ClientsContext';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NewOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityFormData) => void;
}

export interface OpportunityFormData {
  name: string;
  clientId: string;
  missionType: 'buy-side' | 'sell-side' | '';
  target: PappersCompany | null;
  selectedSubsidiaries: string[];
  domains: DomainType[];
  jurisdictions: string[];
  responsibleId: string;
  teamIds: string[];
  budget: Record<string, Record<string, number>>;
  selectedSlides: string[];
}

interface PappersCompany {
  siren: string;
  name: string;
  legalForm: string;
  city: string;
  sector: string;
  capital: string;
  ceo: string;
  employees: string;
  revenue: string;
  subsidiaries: PappersSubsidiary[];
}

interface PappersSubsidiary {
  siren: string;
  name: string;
  legalForm: string;
  ownership: number;
  city: string;
}

// ─── Mock Pappers Data ───────────────────────────────────────────────────────

const mockPappersCompanies: PappersCompany[] = [
  {
    siren: '123 456 789',
    name: 'TechVision SAS',
    legalForm: 'SAS',
    city: 'Paris',
    sector: 'Technologies',
    capital: '500 000 €',
    ceo: 'Jean-Marc Dupont',
    employees: '73',
    revenue: '12,4 M€',
    subsidiaries: [
      { siren: '234 567 890', name: 'TechVision Cloud SARL', legalForm: 'SARL', ownership: 100, city: 'Paris' },
      { siren: '345 678 901', name: 'TechVision Services SAS', legalForm: 'SAS', ownership: 75, city: 'Lyon' },
      { siren: '456 789 012', name: 'InnoLab SAS', legalForm: 'SAS', ownership: 51, city: 'Saclay' },
    ],
  },
  {
    siren: '987 654 321',
    name: 'Groupe Nexus SA',
    legalForm: 'SA',
    city: 'Lyon',
    sector: 'Industrie',
    capital: '2 000 000 €',
    ceo: 'Pierre Legrand',
    employees: '245',
    revenue: '48,2 M€',
    subsidiaries: [
      { siren: '876 543 210', name: 'Nexus Manufacturing SAS', legalForm: 'SAS', ownership: 100, city: 'Lyon' },
      { siren: '765 432 109', name: 'Nexus Logistics SARL', legalForm: 'SARL', ownership: 100, city: 'Marseille' },
      { siren: '654 321 098', name: 'Nexus International Ltd', legalForm: 'Ltd', ownership: 80, city: 'Londres' },
      { siren: '543 210 987', name: 'Nexus Deutschland GmbH', legalForm: 'GmbH', ownership: 100, city: 'Munich' },
    ],
  },
  {
    siren: '111 222 333',
    name: 'DataFlow SAS',
    legalForm: 'SAS',
    city: 'Paris',
    sector: 'Technologies',
    capital: '150 000 €',
    ceo: 'Marie Chen',
    employees: '38',
    revenue: '6,8 M€',
    subsidiaries: [
      { siren: '222 333 444', name: 'DataFlow Cloud SARL', legalForm: 'SARL', ownership: 100, city: 'Paris' },
    ],
  },
  {
    siren: '444 555 666',
    name: 'BioPharm Labs SAS',
    legalForm: 'SAS',
    city: 'Strasbourg',
    sector: 'Santé / Pharma',
    capital: '1 200 000 €',
    ceo: 'Dr. François Muller',
    employees: '120',
    revenue: '25,6 M€',
    subsidiaries: [
      { siren: '555 666 777', name: 'BioPharm R&D SAS', legalForm: 'SAS', ownership: 100, city: 'Strasbourg' },
      { siren: '666 777 888', name: 'BioPharm Distribution SARL', legalForm: 'SARL', ownership: 100, city: 'Paris' },
      { siren: '777 888 999', name: 'BioPharm Suisse SA', legalForm: 'SA', ownership: 60, city: 'Bâle' },
    ],
  },
  {
    siren: '888 999 000',
    name: 'Vidal Industries SA',
    legalForm: 'SA',
    city: 'Bordeaux',
    sector: 'Industrie',
    capital: '3 500 000 €',
    ceo: 'Henri Vidal',
    employees: '310',
    revenue: '62,1 M€',
    subsidiaries: [
      { siren: '999 000 111', name: 'Vidal Services SARL', legalForm: 'SARL', ownership: 100, city: 'Bordeaux' },
      { siren: '000 111 222', name: 'Vidal Immobilier SCI', legalForm: 'SCI', ownership: 100, city: 'Bordeaux' },
    ],
  },
  {
    siren: '112 233 445',
    name: 'GreenTech Solutions SAS',
    legalForm: 'SAS',
    city: 'Nantes',
    sector: 'Énergie',
    capital: '800 000 €',
    ceo: 'Léa Dumont',
    employees: '55',
    revenue: '9,3 M€',
    subsidiaries: [
      { siren: '223 344 556', name: 'GreenTech Invest SAS', legalForm: 'SAS', ownership: 100, city: 'Nantes' },
    ],
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const steps = [
  { id: 1, title: 'Informations' },
  { id: 2, title: 'Périmètre' },
  { id: 3, title: 'Équipe' },
  { id: 4, title: 'Budget' },
  { id: 5, title: 'Proposition' },
];

const domainOptions: { value: DomainType; label: string; color: string }[] = [
  { value: 'TAX', label: 'Fiscal', color: '#6B00E0' },
  { value: 'Social', label: 'Social', color: '#00D4AA' },
  { value: 'Corporate', label: 'Corporate', color: '#0033A0' },
  { value: 'IP/IT', label: 'IP/IT', color: '#E91E8C' },
];

const userDomainMap: Record<string, DomainType> = {
  'user-1': 'TAX',
  'user-2': 'TAX',
  'user-3': 'TAX',
  'user-4': 'Social',
  'user-5': 'Corporate',
  'user-6': 'IP/IT',
};

const availableCountries = [
  'Allemagne', 'Autriche', 'Belgique', 'Brésil', 'Canada', 'Chine',
  'Danemark', 'Émirats arabes unis', 'Espagne', 'États-Unis', 'Finlande',
  'Grèce', 'Hong Kong', 'Hongrie', 'Inde', 'Irlande', 'Italie', 'Japon',
  'Luxembourg', 'Maroc', 'Norvège', 'Pays-Bas', 'Pologne', 'Portugal',
  'République tchèque', 'Roumanie', 'Royaume-Uni', 'Singapour', 'Suède',
  'Suisse',
];

const industries = [
  'Technologies', 'Services', 'Industrie', 'Finance', 'Santé / Pharma',
  'Commerce', 'Immobilier', 'Énergie', 'Autre',
];

// ─── Default budget rates per domain (€/day * estimated days) ────────────────

const domainBaseBudget: Record<DomainType, number> = {
  'TAX': 18000,
  'Social': 15000,
  'Corporate': 12000,
  'IP/IT': 9000,
};

// ─── Slide Types ─────────────────────────────────────────────────────────────

interface ProposalSlide {
  id: string;
  type: 'project' | 'team' | 'scope' | 'budget' | 'references';
  title: string;
  domain?: DomainType;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NewOpportunityModal({ isOpen, onClose, onSubmit }: NewOpportunityModalProps) {
  const { clients, addClient } = useClients();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [missionType, setMissionType] = useState<'buy-side' | 'sell-side' | ''>('');
  const [targetSearch, setTargetSearch] = useState('');
  const [searchResults, setSearchResults] = useState<PappersCompany[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<PappersCompany | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectedInfo, setCollectedInfo] = useState(false);
  const [selectedSubsidiaries, setSelectedSubsidiaries] = useState<string[]>([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientData, setNewClientData] = useState({ name: '', industry: '' });

  // Step 2 state
  const [domains, setDomains] = useState<DomainType[]>([]);
  const [jurisdictions, setJurisdictions] = useState<string[]>(['France']);
  const [jurisdictionSearch, setJurisdictionSearch] = useState('');
  const [showJurisdictionDropdown, setShowJurisdictionDropdown] = useState(false);

  // Step 3 state
  const [responsibleId, setResponsibleId] = useState('');
  const [teamIds, setTeamIds] = useState<string[]>([]);

  // Step 4 state
  const [budget, setBudget] = useState<Record<string, Record<string, number>>>({});

  // Step 5 state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // ── Pappers search simulation ──────────────────────────────────────────────

  const handleTargetSearch = (query: string) => {
    setTargetSearch(query);
    if (query.length >= 2) {
      const results = mockPappersCompanies.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.siren.replace(/\s/g, '').includes(query.replace(/\s/g, ''))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectTarget = (company: PappersCompany) => {
    setSelectedTarget(company);
    setTargetSearch(company.name);
    setSearchResults([]);
    setCollectedInfo(false);
    setSelectedSubsidiaries([]);
  };

  const handleCollectInfo = () => {
    if (!selectedTarget) return;
    setIsCollecting(true);
    // Simulate API call
    setTimeout(() => {
      setIsCollecting(false);
      setCollectedInfo(true);
      // Auto-select all subsidiaries
      setSelectedSubsidiaries(selectedTarget.subsidiaries.map(s => s.siren));
    }, 1500);
  };

  const toggleSubsidiary = (siren: string) => {
    setSelectedSubsidiaries(prev =>
      prev.includes(siren) ? prev.filter(s => s !== siren) : [...prev, siren]
    );
  };

  // ── Client creation ────────────────────────────────────────────────────────

  const handleCreateClient = () => {
    if (newClientData.name && newClientData.industry) {
      const created = addClient({ name: newClientData.name, industry: newClientData.industry });
      setClientId(created.id);
      setNewClientData({ name: '', industry: '' });
      setShowNewClientForm(false);
    }
  };

  // ── Domain toggle ──────────────────────────────────────────────────────────

  const toggleDomain = (domain: DomainType) => {
    setDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  // ── Jurisdiction management ────────────────────────────────────────────────

  const filteredCountries = useMemo(() => {
    if (!jurisdictionSearch) return [];
    return availableCountries.filter(c =>
      c.toLowerCase().includes(jurisdictionSearch.toLowerCase()) &&
      !jurisdictions.includes(c)
    );
  }, [jurisdictionSearch, jurisdictions]);

  const addJurisdiction = (country: string) => {
    setJurisdictions(prev => [...prev, country]);
    setJurisdictionSearch('');
    setShowJurisdictionDropdown(false);
  };

  const removeJurisdiction = (country: string) => {
    if (country === 'France') return; // France cannot be removed
    setJurisdictions(prev => prev.filter(j => j !== country));
  };

  // ── Team filtering by selected domains ─────────────────────────────────────

  const filteredUsers = useMemo(() => {
    if (domains.length === 0) return users;
    return users.filter(u => {
      const userDomain = userDomainMap[u.id];
      return userDomain && domains.includes(userDomain);
    });
  }, [domains]);

  const toggleTeamMember = (userId: string) => {
    setTeamIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // ── Budget initialization when entering step 4 ────────────────────────────

  const initializeBudget = () => {
    const newBudget: Record<string, Record<string, number>> = {};
    domains.forEach(domain => {
      newBudget[domain] = {};
      jurisdictions.forEach(jurisdiction => {
        const base = domainBaseBudget[domain] || 10000;
        // France gets full rate, other jurisdictions get 60%
        newBudget[domain][jurisdiction] = jurisdiction === 'France' ? base : Math.round(base * 0.6);
      });
    });
    setBudget(newBudget);
  };

  const updateBudgetCell = (domain: string, jurisdiction: string, value: number) => {
    setBudget(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [jurisdiction]: value,
      },
    }));
  };

  const getDomainTotal = (domain: string): number => {
    if (!budget[domain]) return 0;
    return Object.values(budget[domain]).reduce((sum, v) => sum + v, 0);
  };

  const getGrandTotal = (): number => {
    return domains.reduce((sum, d) => sum + getDomainTotal(d), 0);
  };

  // ── Proposal slides ───────────────────────────────────────────────────────

  const proposalSlides: ProposalSlide[] = useMemo(() => {
    const slides: ProposalSlide[] = [
      { id: 'slide-project', type: 'project', title: 'Présentation du Projet' },
      { id: 'slide-team', type: 'team', title: 'Présentation de l\'Équipe' },
    ];
    // One scope slide per selected domain
    domains.forEach(domain => {
      const label = domainOptions.find(d => d.value === domain)?.label || domain;
      slides.push({
        id: `slide-scope-${domain}`,
        type: 'scope',
        title: `Scope — ${label}`,
        domain,
      });
    });
    slides.push({ id: 'slide-budget', type: 'budget', title: 'Budget' });
    slides.push({ id: 'slide-references', type: 'references', title: 'Références' });
    return slides;
  }, [domains]);

  // ── Step navigation ────────────────────────────────────────────────────────

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!name && !!clientId && !!missionType;
      case 2:
        return domains.length > 0 && jurisdictions.length > 0;
      case 3:
        return !!responsibleId;
      case 4:
        return domains.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      initializeBudget();
    }
    if (currentStep === 4) {
      setCurrentSlideIndex(0);
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      clientId,
      missionType: missionType as 'buy-side' | 'sell-side',
      target: selectedTarget,
      selectedSubsidiaries,
      domains,
      jurisdictions,
      responsibleId,
      teamIds,
      budget,
      selectedSlides: proposalSlides.map(s => s.id),
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setName('');
    setClientId('');
    setMissionType('');
    setTargetSearch('');
    setSearchResults([]);
    setSelectedTarget(null);
    setIsCollecting(false);
    setCollectedInfo(false);
    setSelectedSubsidiaries([]);
    setShowNewClientForm(false);
    setNewClientData({ name: '', industry: '' });
    setDomains([]);
    setJurisdictions(['France']);
    setJurisdictionSearch('');
    setResponsibleId('');
    setTeamIds([]);
    setBudget({});
    setCurrentSlideIndex(0);
  };

  // ── Get sector for reference filtering ────────────────────────────────────

  const targetSector = selectedTarget?.sector || '';

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderSlideContent = (slide: ProposalSlide) => {
    const clientObj = clients.find(c => c.id === clientId);
    switch (slide.type) {
      case 'project':
        return (
          <div className="p-6 space-y-4">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-wedd-mint rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-wedd-black text-lg font-display">W</span>
              </div>
              <h3 className="text-xl font-bold text-wedd-black">Proposition de Services</h3>
              <p className="text-gray-500 text-sm mt-1">Due Diligence — {missionType === 'buy-side' ? 'Buy-side' : 'Sell-side'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dossier</span>
                <span className="font-medium">{name || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Client</span>
                <span className="font-medium">{clientObj?.name || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cible</span>
                <span className="font-medium">{selectedTarget?.name || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Secteur</span>
                <span className="font-medium">{targetSector || '—'}</span>
              </div>
              {selectedSubsidiaries.length > 0 && selectedTarget && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entités dans le scope</span>
                  <span className="font-medium">{selectedSubsidiaries.length + 1} sociétés</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Domaines</span>
                <span className="font-medium">{domains.map(d => domainOptions.find(o => o.value === d)?.label).join(', ') || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Juridictions</span>
                <span className="font-medium">{jurisdictions.join(', ')}</span>
              </div>
            </div>
          </div>
        );
      case 'team': {
        const selectedTeam = users.filter(u => teamIds.includes(u.id) || u.id === responsibleId);
        const teamCVs = cvProfiles.filter(cv => selectedTeam.some(u => u.id === cv.userId));
        return (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-wedd-black mb-4">Équipe Projet</h3>
            {selectedTeam.length === 0 ? (
              <p className="text-gray-400 text-sm italic">Aucun membre sélectionné</p>
            ) : (
              <div className="space-y-3">
                {selectedTeam.map(user => {
                  const cv = teamCVs.find(c => c.userId === user.id);
                  return (
                    <div key={user.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{user.name} {user.id === responsibleId && <span className="text-xs text-wedd-mint">(Responsable)</span>}</p>
                        <p className="text-xs text-gray-500">{user.title}</p>
                        {cv && (
                          <p className="text-xs text-gray-400 mt-1">{cv.yearsExperience} ans d&apos;expérience — {cv.education}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      case 'scope': {
        const template = scopeTemplates.find(t => t.domain === slide.domain);
        return (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: domainOptions.find(d => d.value === slide.domain)?.color }}
              />
              <h3 className="text-lg font-bold text-wedd-black">{template?.title || `Scope — ${slide.domain}`}</h3>
            </div>
            {template ? (
              <div className="space-y-2">
                {template.sections.map((section, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <span className="text-xs font-mono text-gray-400 mt-0.5">{i + 1}.</span>
                    <span className="text-sm">{section}</span>
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-500">Durée estimée</span>
                  <span className="font-medium">{template.estimatedDays} jours</span>
                </div>
                {jurisdictions.length > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Juridictions</span>
                    <span className="font-medium">{jurisdictions.join(', ')}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">Template non disponible</p>
            )}
          </div>
        );
      }
      case 'budget':
        return (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-wedd-black mb-4">Budget Estimatif</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">Domaine</th>
                  {jurisdictions.map(j => (
                    <th key={j} className="text-right py-2 text-gray-500 font-medium">{j}</th>
                  ))}
                  <th className="text-right py-2 text-gray-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {domains.map(domain => (
                  <tr key={domain} className="border-b border-gray-100">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: domainOptions.find(d => d.value === domain)?.color }} />
                        {domainOptions.find(d => d.value === domain)?.label}
                      </div>
                    </td>
                    {jurisdictions.map(j => (
                      <td key={j} className="text-right py-2">{(budget[domain]?.[j] || 0).toLocaleString('fr-FR')} €</td>
                    ))}
                    <td className="text-right py-2 font-medium">{getDomainTotal(domain).toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300">
                  <td className="py-2 font-bold">Total</td>
                  {jurisdictions.map(j => {
                    const colTotal = domains.reduce((sum, d) => sum + (budget[d]?.[j] || 0), 0);
                    return <td key={j} className="text-right py-2 font-medium">{colTotal.toLocaleString('fr-FR')} €</td>;
                  })}
                  <td className="text-right py-2 font-bold">{getGrandTotal().toLocaleString('fr-FR')} €</td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      case 'references': {
        // Filter credentials by sector if target is known
        const relevantCreds = targetSector
          ? credentials.filter(c =>
              c.sector.toLowerCase().includes(targetSector.toLowerCase()) ||
              targetSector.toLowerCase().includes(c.sector.toLowerCase())
            )
          : credentials;
        const displayCreds = relevantCreds.length > 0 ? relevantCreds.slice(0, 4) : credentials.slice(0, 4);
        return (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-wedd-black mb-4">
              Références {targetSector ? `— ${targetSector}` : ''}
            </h3>
            <div className="space-y-3">
              {displayCreds.map(cred => (
                <div key={cred.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{cred.operationType} — {cred.sector}</span>
                    <span className="text-xs text-gray-400">{cred.year}</span>
                  </div>
                  <p className="text-xs text-gray-600">{cred.description}</p>
                  {cred.dealSize && (
                    <p className="text-xs text-gray-400 mt-1">Taille : {cred.dealSize}</p>
                  )}
                  <div className="flex gap-1 mt-2">
                    {cred.domains.map(d => (
                      <span
                        key={d}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${domainOptions.find(o => o.value === d)?.color}20`, color: domainOptions.find(o => o.value === d)?.color }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle Opportunité" size="xl">
      {/* Steps indicator */}
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center flex-shrink-0">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep > step.id
                    ? 'bg-wedd-mint text-white'
                    : currentStep === step.id
                    ? 'bg-wedd-mint text-wedd-black'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className={`ml-2 text-sm whitespace-nowrap ${currentStep === step.id ? 'font-medium text-wedd-black' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 flex-shrink-0 ${currentStep > step.id ? 'bg-wedd-mint' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ─── Step 1: Informations ─────────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="space-y-4">
          {/* Nom du dossier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du dossier *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Acquisition TechVision SAS"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-black"
            />
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
            {!showNewClientForm ? (
              <>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                  {clients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => setClientId(client.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg border-2 text-left transition-all ${
                        clientId === client.id
                          ? 'border-wedd-mint bg-wedd-mint/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: client.color }}
                      >
                        {client.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.industry}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowNewClientForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-wedd-black hover:text-wedd-black transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer un nouveau client</span>
                </button>
              </>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>Nouveau client</span>
                </div>
                <input
                  type="text"
                  value={newClientData.name}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du client"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-black"
                />
                <select
                  value={newClientData.industry}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-black"
                >
                  <option value="">Sélectionner un secteur</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button onClick={() => setShowNewClientForm(false)} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100">Annuler</button>
                  <button
                    onClick={handleCreateClient}
                    disabled={!newClientData.name || !newClientData.industry}
                    className="flex-1 px-3 py-2 text-sm bg-wedd-mint text-wedd-black rounded-lg hover:bg-wedd-mint-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Créer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Type de mission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de mission *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMissionType('buy-side')}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  missionType === 'buy-side' ? 'border-wedd-mint bg-wedd-mint/10' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-sm">Buy-side</p>
                <p className="text-xs text-gray-500 mt-0.5">Due diligence pour l&apos;acquéreur</p>
              </button>
              <button
                onClick={() => setMissionType('sell-side')}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  missionType === 'sell-side' ? 'border-wedd-mint bg-wedd-mint/10' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-sm">Sell-side</p>
                <p className="text-xs text-gray-500 mt-0.5">Vendor due diligence</p>
              </button>
            </div>
          </div>

          {/* Cible — Pappers search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Société cible</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={targetSearch}
                onChange={(e) => handleTargetSearch(e.target.value)}
                placeholder="Rechercher une société (nom ou SIREN)..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-black"
              />
              {/* Search results dropdown */}
              {searchResults.length > 0 && !selectedTarget && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map(company => (
                    <button
                      key={company.siren}
                      onClick={() => handleSelectTarget(company)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-0"
                    >
                      <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{company.name}</p>
                        <p className="text-xs text-gray-500">{company.siren} — {company.legalForm} — {company.city}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected target + Collect button */}
            {selectedTarget && !collectedInfo && (
              <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{selectedTarget.name}</p>
                    <p className="text-xs text-gray-500">{selectedTarget.siren} — {selectedTarget.legalForm} — {selectedTarget.city}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedTarget(null); setTargetSearch(''); }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <button
                  onClick={handleCollectInfo}
                  disabled={isCollecting}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-wedd-black text-white rounded-lg hover:bg-wedd-black-light disabled:opacity-50 transition-colors text-sm"
                >
                  {isCollecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Collecte en cours...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Collecter les informations</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Collected info + subsidiaries */}
            {selectedTarget && collectedInfo && (
              <div className="mt-3 space-y-3">
                {/* Company info card */}
                <div className="p-4 border border-wedd-mint/30 rounded-lg bg-wedd-mint/5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm text-wedd-black">{selectedTarget.name}</h4>
                    <button
                      onClick={() => { setSelectedTarget(null); setTargetSearch(''); setCollectedInfo(false); setSelectedSubsidiaries([]); }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-500">SIREN :</span> <span className="font-medium">{selectedTarget.siren}</span></div>
                    <div><span className="text-gray-500">Forme :</span> <span className="font-medium">{selectedTarget.legalForm}</span></div>
                    <div><span className="text-gray-500">Siège :</span> <span className="font-medium">{selectedTarget.city}</span></div>
                    <div><span className="text-gray-500">Secteur :</span> <span className="font-medium">{selectedTarget.sector}</span></div>
                    <div><span className="text-gray-500">Capital :</span> <span className="font-medium">{selectedTarget.capital}</span></div>
                    <div><span className="text-gray-500">Dirigeant :</span> <span className="font-medium">{selectedTarget.ceo}</span></div>
                    <div><span className="text-gray-500">Effectif :</span> <span className="font-medium">{selectedTarget.employees}</span></div>
                    <div><span className="text-gray-500">CA :</span> <span className="font-medium">{selectedTarget.revenue}</span></div>
                  </div>
                </div>

                {/* Subsidiaries selection */}
                {selectedTarget.subsidiaries.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filiales — Sélectionner les sociétés dans le scope
                    </label>
                    <div className="space-y-1.5">
                      {selectedTarget.subsidiaries.map(sub => (
                        <label
                          key={sub.siren}
                          className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                            selectedSubsidiaries.includes(sub.siren) ? 'border-wedd-mint bg-wedd-mint/5' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubsidiaries.includes(sub.siren)}
                            onChange={() => toggleSubsidiary(sub.siren)}
                            className="w-4 h-4 accent-wedd-mint"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{sub.name}</p>
                            <p className="text-xs text-gray-500">{sub.siren} — {sub.legalForm} — {sub.ownership}% — {sub.city}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Step 2: Périmètre ────────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Domains */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Domaines d&apos;intervention *</label>
            <div className="grid grid-cols-2 gap-3">
              {domainOptions.map(domain => (
                <button
                  key={domain.value}
                  onClick={() => toggleDomain(domain.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    domains.includes(domain.value)
                      ? 'border-wedd-mint bg-wedd-mint/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: domain.color }} />
                    <span className="font-medium">{domain.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Jurisdictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Juridictions *</label>
            {/* Selected jurisdictions */}
            <div className="flex flex-wrap gap-2 mb-3">
              {jurisdictions.map(j => (
                <span
                  key={j}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                >
                  <Globe className="w-3.5 h-3.5 text-gray-500" />
                  {j}
                  {j !== 'France' && (
                    <button onClick={() => removeJurisdiction(j)} className="ml-0.5 hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {/* Add jurisdiction search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={jurisdictionSearch}
                onChange={(e) => { setJurisdictionSearch(e.target.value); setShowJurisdictionDropdown(true); }}
                onFocus={() => setShowJurisdictionDropdown(true)}
                placeholder="Ajouter une juridiction..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-black"
              />
              {showJurisdictionDropdown && filteredCountries.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredCountries.map(country => (
                    <button
                      key={country}
                      onClick={() => addJurisdiction(country)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                    >
                      {country}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">France est incluse par défaut et ne peut pas être retirée.</p>
          </div>
        </div>
      )}

      {/* ─── Step 3: Équipe ───────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
            <select
              value={responsibleId}
              onChange={(e) => setResponsibleId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedd-black"
            >
              <option value="">Sélectionner un responsable</option>
              {filteredUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name} — {user.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membres de l&apos;équipe
              {domains.length > 0 && (
                <span className="text-xs text-gray-400 font-normal ml-2">
                  (filtrés par domaines : {domains.map(d => domainOptions.find(o => o.value === d)?.label).join(', ')})
                </span>
              )}
            </label>
            <div className="space-y-2 max-h-52 overflow-y-auto mt-2">
              {filteredUsers.filter(u => u.id !== responsibleId).map(user => {
                const userDomain = userDomainMap[user.id];
                const domainColor = domainOptions.find(d => d.value === userDomain)?.color;
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      teamIds.includes(user.id) ? 'bg-wedd-mint/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={teamIds.includes(user.id)}
                      onChange={() => toggleTeamMember(user.id)}
                      className="w-4 h-4 accent-wedd-mint"
                    />
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.title}</p>
                    </div>
                    {domainColor && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${domainColor}15`, color: domainColor }}
                      >
                        {userDomain}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 4: Budget ───────────────────────────────────────────────── */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Budget estimatif par domaine d&apos;intervention{jurisdictions.length > 1 ? ' et juridiction' : ''}. Les montants sont modifiables.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 text-gray-500 font-medium min-w-[140px]">Domaine</th>
                  {jurisdictions.map(j => (
                    <th key={j} className="text-right py-3 px-2 text-gray-500 font-medium min-w-[120px]">{j}</th>
                  ))}
                  <th className="text-right py-3 pl-4 text-gray-500 font-medium min-w-[100px]">Total</th>
                </tr>
              </thead>
              <tbody>
                {domains.map(domain => {
                  const domainColor = domainOptions.find(d => d.value === domain)?.color;
                  const label = domainOptions.find(d => d.value === domain)?.label || domain;
                  return (
                    <tr key={domain} className="border-b border-gray-100">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domainColor }} />
                          <span className="font-medium">{label}</span>
                        </div>
                      </td>
                      {jurisdictions.map(j => (
                        <td key={j} className="py-2 px-2">
                          <div className="relative">
                            <input
                              type="number"
                              value={budget[domain]?.[j] || 0}
                              onChange={(e) => updateBudgetCell(domain, j, parseInt(e.target.value) || 0)}
                              className="w-full text-right px-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-wedd-black text-sm"
                            />
                          </div>
                        </td>
                      ))}
                      <td className="py-3 pl-4 text-right font-medium">
                        {getDomainTotal(domain).toLocaleString('fr-FR')} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300">
                  <td className="py-3 pr-4 font-bold">Total</td>
                  {jurisdictions.map(j => {
                    const colTotal = domains.reduce((sum, d) => sum + (budget[d]?.[j] || 0), 0);
                    return (
                      <td key={j} className="py-3 px-2 text-right font-medium">
                        {colTotal.toLocaleString('fr-FR')} €
                      </td>
                    );
                  })}
                  <td className="py-3 pl-4 text-right font-bold text-wedd-black">
                    {getGrandTotal().toLocaleString('fr-FR')} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ─── Step 5: Proposition ──────────────────────────────────────────── */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-2">
            Aperçu des slides de la proposition de services. Naviguez entre les slides pour vérifier le contenu pré-rempli.
          </p>

          {/* Slide viewer */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Slide navigation bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <button
                onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {proposalSlides[currentSlideIndex]?.title}
                </span>
                <span className="text-xs text-gray-400">
                  ({currentSlideIndex + 1} / {proposalSlides.length})
                </span>
              </div>
              <button
                onClick={() => setCurrentSlideIndex(prev => Math.min(proposalSlides.length - 1, prev + 1))}
                disabled={currentSlideIndex === proposalSlides.length - 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slide content */}
            <div className="min-h-[300px] bg-white">
              {proposalSlides[currentSlideIndex] && renderSlideContent(proposalSlides[currentSlideIndex])}
            </div>
          </div>

          {/* Slide thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {proposalSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(index)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  currentSlideIndex === index
                    ? 'bg-wedd-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                {slide.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <ModalFooter>
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        {currentStep < 5 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            icon={<Check className="w-4 h-4" />}
          >
            Créer l&apos;opportunité
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
}
