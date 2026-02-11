'use client';

import React from 'react';
import { DomainType, ProjectStatus, DocumentStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'badge';
  const variantClasses = variant === 'outline' ? 'border bg-transparent' : '';

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
}

interface DomainBadgeProps {
  domain: DomainType;
  size?: 'sm' | 'md';
}

const domainConfig: Record<DomainType, { bg: string; text: string; label: string }> = {
  'TAX': { bg: 'bg-wedd-mint-50', text: 'text-wedd-black', label: 'TAX' },
  'Social': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Social' },
  'Corporate': { bg: 'bg-blue-100', text: 'text-wedd-black', label: 'Corporate' },
  'IP/IT': { bg: 'bg-pink-100', text: 'text-wedd-mint', label: 'IP/IT' },
};

export function DomainBadge({ domain, size = 'sm' }: DomainBadgeProps) {
  const config = domainConfig[domain];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`badge ${config.bg} ${config.text} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig: Record<ProjectStatus, { bg: string; text: string; label: string }> = {
  'en-cours': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En cours' },
  'review': { bg: 'bg-wedd-mint-50', text: 'text-wedd-black', label: 'Review' },
  'valide': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Validé' },
  'urgent': { bg: 'bg-pink-100', text: 'text-wedd-mint', label: 'Urgent' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`badge ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
  showLabel?: boolean;
}

const docStatusConfig: Record<DocumentStatus, { icon: string; color: string; label: string }> = {
  'received': { icon: '✅', color: 'text-emerald-600', label: 'Reçu' },
  'pending': { icon: '⏳', color: 'text-amber-600', label: 'En attente' },
  'missing': { icon: '❌', color: 'text-red-500', label: 'Manquant' },
};

export function DocumentStatusBadge({ status, showLabel = false }: DocumentStatusBadgeProps) {
  const config = docStatusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1 ${config.color}`} title={config.label}>
      <span>{config.icon}</span>
      {showLabel && <span className="text-xs">{config.label}</span>}
    </span>
  );
}
