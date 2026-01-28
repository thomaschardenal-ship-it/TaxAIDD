'use client';

import React from 'react';
import { FileText, Building, Users, Shield, FolderOpen } from 'lucide-react';
import { DomainType } from '@/types';
import { DomainProgressBar } from '@/components/ui/ProgressBar';

interface CollectionProgressProps {
  documentStats: Record<DomainType, { received: number; total: number }>;
  onDomainClick?: (domain: DomainType) => void;
}

const domainConfig: Record<DomainType, { icon: typeof FileText; color: string; bgLight: string }> = {
  'TAX': { icon: FileText, color: '#6B00E0', bgLight: 'bg-purple-50' },
  'Social': { icon: Users, color: '#00D4AA', bgLight: 'bg-emerald-50' },
  'Corporate': { icon: Building, color: '#0033A0', bgLight: 'bg-blue-50' },
  'IP/IT': { icon: Shield, color: '#E91E8C', bgLight: 'bg-pink-50' },
};

export default function CollectionProgress({ documentStats, onDomainClick }: CollectionProgressProps) {
  const domains: DomainType[] = ['TAX', 'Social', 'Corporate', 'IP/IT'];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-taxaidd-black mb-6">Avancée de la Collecte</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {domains.map(domain => {
          const config = domainConfig[domain];
          const stats = documentStats[domain] || { received: 0, total: 0 };
          const Icon = config.icon;

          return (
            <button
              key={domain}
              onClick={() => onDomainClick?.(domain)}
              className={`p-4 rounded-xl ${config.bgLight} transition-all hover:scale-105 hover:shadow-md cursor-pointer text-left w-full group`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-taxaidd-black">{domain}</p>
                  <p className="text-xs text-gray-500">
                    {stats.received} / {stats.total} documents
                  </p>
                </div>
                <FolderOpen className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <DomainProgressBar domain={domain} received={stats.received} total={stats.total} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
