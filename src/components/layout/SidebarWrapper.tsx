'use client';

import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useSidebar } from '@/context/SidebarContext';

interface SidebarWrapperProps {
  children: ReactNode;
}

export default function SidebarWrapper({ children }: SidebarWrapperProps) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-60'}`}>
        {children}
      </main>
    </>
  );
}
