'use client';

import React from 'react';
import Breadcrumb from './Breadcrumb';

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export default function Header({ title, breadcrumbs, actions }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-3">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-omni-black">{title}</h1>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
