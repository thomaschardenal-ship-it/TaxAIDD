'use client';

import React, { useState } from 'react';
import { Company } from '@/types';

interface OrgChartProps {
  companies: Company[];
}

const companyColors = [
  '#6B00E0', '#0033A0', '#00D4AA', '#E91E8C', '#FFB800',
];

export default function OrgChart({ companies }: OrgChartProps) {
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);

  // Find the holding company (parentId === null)
  const holding = companies.find(c => c.parentId === null);
  const subsidiaries = companies.filter(c => c.parentId === holding?.id);

  if (!holding) return <div className="text-gray-500">Aucune structure juridique disponible</div>;

  const getColorForCompany = (id: string) => {
    const index = companies.findIndex(c => c.id === id);
    return companyColors[index % companyColors.length];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-taxaidd-black mb-6">Structure Juridique</h3>

      <div className="flex flex-col items-center">
        {/* Holding Company */}
        <CompanyBox
          company={holding}
          color={getColorForCompany(holding.id)}
          isHovered={hoveredCompany === holding.id}
          onHover={setHoveredCompany}
        />

        {/* Connector lines */}
        {subsidiaries.length > 0 && (
          <div className="relative w-full flex flex-col items-center">
            {/* Vertical line from holding */}
            <div className="w-0.5 h-8 bg-gray-300" />

            {/* Horizontal line connecting subsidiaries */}
            <div
              className="h-0.5 bg-gray-300"
              style={{
                width: `${Math.max(60, (subsidiaries.length - 1) * 200 + 100)}px`,
              }}
            />

            {/* Vertical lines to subsidiaries */}
            <div className="flex justify-center gap-8 -mt-0.5">
              {subsidiaries.map((sub, index) => (
                <div key={sub.id} className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gray-300" />
                  <CompanyBox
                    company={sub}
                    color={getColorForCompany(sub.id)}
                    isHovered={hoveredCompany === sub.id}
                    onHover={setHoveredCompany}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CompanyBoxProps {
  company: Company;
  color: string;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

function CompanyBox({ company, color, isHovered, onHover }: CompanyBoxProps) {
  return (
    <div
      className={`
        relative px-6 py-4 rounded-xl border-2 bg-white
        transition-all duration-200 cursor-pointer
        ${isHovered ? 'shadow-lg scale-105' : 'shadow-sm'}
      `}
      style={{
        borderColor: color,
        minWidth: '180px',
      }}
      onMouseEnter={() => onHover(company.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Ownership badge */}
      {company.parentId && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {company.ownership}%
        </div>
      )}

      <div className="text-center">
        <p className="font-semibold text-taxaidd-black">{company.name}</p>
        {company.legalForm && (
          <p className="text-xs text-gray-500 mt-1">{company.legalForm}</p>
        )}
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10 bg-taxaidd-black text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg">
          <p><strong>SIREN:</strong> {company.siren || 'N/A'}</p>
          <p><strong>Forme:</strong> {company.legalForm || 'N/A'}</p>
          <p><strong>Type:</strong> {company.type}</p>
        </div>
      )}
    </div>
  );
}
