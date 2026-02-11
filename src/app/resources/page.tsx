'use client';

import React, { useState, useMemo } from 'react';
import { Users, Award, FileText, Briefcase, GraduationCap, Globe, Clock } from 'lucide-react';
import { DomainType } from '@/types';
import { DomainBadge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import {
  cvProfiles,
  credentials,
  scopeTemplates,
  CVProfile,
} from '@/data/resources';

type TabKey = 'cvs' | 'credentials' | 'scopes';

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'cvs', label: 'CVs Équipe', icon: Users },
  { key: 'credentials', label: 'Références', icon: Award },
  { key: 'scopes', label: 'Scopes Types', icon: FileText },
];

const domainAvatarColors: Record<DomainType, string> = {
  TAX: '#8dd4a0',
  Social: '#34d399',
  Corporate: '#60a5fa',
  'IP/IT': '#f472b6',
};

const availabilityConfig: Record<
  CVProfile['availability'],
  { label: string; bg: string; text: string }
> = {
  available: { label: 'Disponible', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  partial: { label: 'Partiel', bg: 'bg-orange-100', text: 'text-orange-700' },
  busy: { label: 'Occupé', bg: 'bg-red-100', text: 'text-red-700' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('cvs');
  const [selectedCV, setSelectedCV] = useState<CVProfile | null>(null);

  // Credential filters
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [opTypeFilter, setOpTypeFilter] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<DomainType | null>(null);

  const uniqueYears = useMemo(
    () => Array.from(new Set(credentials.map((c) => c.year))).sort((a, b) => b - a),
    []
  );
  const uniqueOpTypes = useMemo(
    () => Array.from(new Set(credentials.map((c) => c.operationType))).sort(),
    []
  );
  const allDomains: DomainType[] = ['TAX', 'Social', 'Corporate', 'IP/IT'];

  const filteredCredentials = useMemo(() => {
    return credentials.filter((cred) => {
      if (yearFilter && cred.year !== yearFilter) return false;
      if (opTypeFilter && cred.operationType !== opTypeFilter) return false;
      if (domainFilter && !cred.domains.includes(domainFilter)) return false;
      return true;
    });
  }, [yearFilter, opTypeFilter, domainFilter]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-bold text-wedd-black">Ressources</h1>
        <p className="text-sm text-gray-500 mt-1">
          Banques de CVs, références et périmètres types
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium
                  transition-all duration-200 border-b-2 -mb-[1px]
                  ${
                    isActive
                      ? 'border-wedd-mint text-wedd-black bg-wedd-mint-50'
                      : 'border-transparent text-gray-500 hover:text-wedd-black hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'cvs' && (
          <CVsTab onSelectCV={setSelectedCV} />
        )}
        {activeTab === 'credentials' && (
          <CredentialsTab
            filteredCredentials={filteredCredentials}
            yearFilter={yearFilter}
            opTypeFilter={opTypeFilter}
            domainFilter={domainFilter}
            onYearChange={setYearFilter}
            onOpTypeChange={setOpTypeFilter}
            onDomainChange={setDomainFilter}
            uniqueYears={uniqueYears}
            uniqueOpTypes={uniqueOpTypes}
            allDomains={allDomains}
          />
        )}
        {activeTab === 'scopes' && <ScopesTab />}
      </div>

      {/* CV Detail Modal */}
      {selectedCV && (
        <Modal
          isOpen={!!selectedCV}
          onClose={() => setSelectedCV(null)}
          title={selectedCV.name}
          size="lg"
        >
          <CVDetailModal profile={selectedCV} />
        </Modal>
      )}
    </div>
  );
}

/* ─── CVs Tab ──────────────────────────────────────────────────────── */

function CVsTab({ onSelectCV }: { onSelectCV: (cv: CVProfile) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cvProfiles.map((profile) => {
        const avail = availabilityConfig[profile.availability];
        return (
          <div
            key={profile.id}
            className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
          >
            {/* Top row: avatar + info + availability */}
            <div className="flex items-start gap-4">
              <Avatar
                name={profile.name}
                initials={getInitials(profile.name)}
                color={domainAvatarColors[profile.specialty]}
                size="xl"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-wedd-black truncate">
                    {profile.name}
                  </h3>
                  <span
                    className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${avail.bg} ${avail.text}`}
                  >
                    {avail.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{profile.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <DomainBadge domain={profile.specialty} size="sm" />
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {profile.yearsExperience} ans
                  </span>
                </div>
              </div>
            </div>

            {/* Key experiences */}
            <ul className="mt-4 space-y-1.5">
              {profile.keyExperiences.slice(0, 3).map((exp, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-wedd-mint mt-1 flex-shrink-0">&#8226;</span>
                  {exp}
                </li>
              ))}
            </ul>

            {/* Languages + action */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectCV(profile)}
              >
                Voir le CV complet
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── CV Detail Modal Content ──────────────────────────────────────── */

function CVDetailModal({ profile }: { profile: CVProfile }) {
  const avail = availabilityConfig[profile.availability];
  return (
    <div className="space-y-6">
      {/* Top summary */}
      <div className="flex items-center gap-4">
        <Avatar
          name={profile.name}
          initials={getInitials(profile.name)}
          color={domainAvatarColors[profile.specialty]}
          size="xl"
        />
        <div>
          <h3 className="text-lg font-semibold text-wedd-black">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <DomainBadge domain={profile.specialty} size="sm" />
            <span
              className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${avail.bg} ${avail.text}`}
            >
              {avail.label}
            </span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Formation</p>
            <p className="text-sm text-wedd-black mt-0.5">{profile.education}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Expérience</p>
            <p className="text-sm text-wedd-black mt-0.5">{profile.yearsExperience} ans</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Langues</p>
            <p className="text-sm text-wedd-black mt-0.5">{profile.languages.join(', ')}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Award className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Certifications
            </p>
            <ul className="mt-0.5">
              {profile.certifications.map((cert, i) => (
                <li key={i} className="text-sm text-wedd-black">
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Key experiences */}
      <div>
        <h4 className="text-sm font-semibold text-wedd-black mb-2">Expériences clés</h4>
        <ul className="space-y-2">
          {profile.keyExperiences.map((exp, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-wedd-mint mt-0.5 flex-shrink-0">&#8226;</span>
              {exp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Credentials Tab ──────────────────────────────────────────────── */

interface CredentialsTabProps {
  filteredCredentials: typeof credentials;
  yearFilter: number | null;
  opTypeFilter: string | null;
  domainFilter: DomainType | null;
  onYearChange: (v: number | null) => void;
  onOpTypeChange: (v: string | null) => void;
  onDomainChange: (v: DomainType | null) => void;
  uniqueYears: number[];
  uniqueOpTypes: string[];
  allDomains: DomainType[];
}

function CredentialsTab({
  filteredCredentials,
  yearFilter,
  opTypeFilter,
  domainFilter,
  onYearChange,
  onOpTypeChange,
  onDomainChange,
  uniqueYears,
  uniqueOpTypes,
  allDomains,
}: CredentialsTabProps) {
  return (
    <div>
      {/* Filter row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={yearFilter ?? ''}
          onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-wedd-black focus:outline-none focus:ring-2 focus:ring-wedd-mint/50"
        >
          <option value="">Toutes les années</option>
          {uniqueYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={opTypeFilter ?? ''}
          onChange={(e) => onOpTypeChange(e.target.value || null)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-wedd-black focus:outline-none focus:ring-2 focus:ring-wedd-mint/50"
        >
          <option value="">Tous types d&apos;opération</option>
          {uniqueOpTypes.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>

        <select
          value={domainFilter ?? ''}
          onChange={(e) => onDomainChange((e.target.value as DomainType) || null)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-wedd-black focus:outline-none focus:ring-2 focus:ring-wedd-mint/50"
        >
          <option value="">Tous les domaines</option>
          {allDomains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Credential cards */}
      <div className="space-y-4">
        {filteredCredentials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune référence ne correspond aux filtres sélectionnés</p>
          </div>
        ) : (
          filteredCredentials.map((cred) => (
            <div
              key={cred.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start gap-4">
                {/* Year badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-wedd-mint-50 flex items-center justify-center">
                  <span className="text-sm font-bold text-wedd-black">{cred.year}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-semibold text-wedd-black">
                      {cred.operationType} — {cred.sector}
                    </h3>
                    {cred.dealSize && (
                      <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-wedd-mint-50 text-wedd-black font-medium">
                        {cred.dealSize}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{cred.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Périmètre : {cred.scope}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {cred.domains.map((domain) => (
                      <DomainBadge key={domain} domain={domain} size="sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Scopes Tab ───────────────────────────────────────────────────── */

function ScopesTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {scopeTemplates.map((scope) => (
        <div
          key={scope.id}
          className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-1">
            <DomainBadge domain={scope.domain} size="md" />
            <span className="text-xs text-gray-400 font-medium">{scope.missionType}</span>
          </div>
          <h3 className="text-base font-semibold text-wedd-black mt-2">{scope.title}</h3>

          {/* Sections */}
          <ol className="mt-4 space-y-2 flex-1">
            {scope.sections.map((section, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-wedd-mint-50 text-wedd-black text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {section}
              </li>
            ))}
          </ol>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              {scope.estimatedDays} jours estimés
            </span>
            <Button
              variant="mint"
              size="sm"
              onClick={() => alert(`Scope "${scope.title}" sélectionné pour utilisation.`)}
            >
              Utiliser ce scope
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
