'use client';

import React from 'react';
import { DomainType } from '@/types';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
  gradient?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  color,
  gradient = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getGradient = () => {
    if (!gradient) return color || '#FFB800';
    if (percentage < 30) return 'linear-gradient(90deg, #E91E8C, #F5A5D5)';
    if (percentage < 60) return 'linear-gradient(90deg, #FFB800, #F5A623)';
    if (percentage < 90) return 'linear-gradient(90deg, #6B00E0, #C4B5FD)';
    return 'linear-gradient(90deg, #00D4AA, #7FFFD4)';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-taxaidd-gray-light rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${percentage}%`,
            background: getGradient(),
          }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 mt-1 inline-block">{Math.round(percentage)}%</span>
      )}
    </div>
  );
}

interface DomainProgressBarProps {
  domain: DomainType;
  received: number;
  total: number;
}

const domainColors: Record<DomainType, string> = {
  'TAX': '#6B00E0',
  'Social': '#00D4AA',
  'Corporate': '#0033A0',
  'IP/IT': '#E91E8C',
};

export function DomainProgressBar({ domain, received, total }: DomainProgressBarProps) {
  const percentage = total > 0 ? (received / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="w-full h-2 bg-taxaidd-gray-light rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: domainColors[domain],
          }}
        />
      </div>
    </div>
  );
}
