'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, TrendingUp, FolderOpen, ChevronLeft, ChevronRight,
  ChevronDown, Building2, BookOpen, Users, Settings, Briefcase, FileSignature,
} from 'lucide-react';
import { currentUser, projects, clients } from '@/data';
import Avatar from '@/components/ui/Avatar';
import { useSidebar } from '@/context/SidebarContext';
import NotificationBell from './NotificationBell';
import { DomainType } from '@/types';

// ─── Domain colors ───────────────────────────────────────────────────────────

const domainColors: Record<DomainType, string> = {
  'TAX': '#6B00E0',
  'Social': '#00D4AA',
  'Corporate': '#0033A0',
  'IP/IT': '#E91E8C',
};

// ─── Status config ───────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'en-cours': { label: 'En cours', color: 'text-blue-600', bg: 'bg-blue-50' },
  'review': { label: 'Review', color: 'text-amber-600', bg: 'bg-amber-50' },
  'valide': { label: 'Validé', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'urgent': { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-50' },
};

// ─── Project Selector Dropdown ───────────────────────────────────────────────

function ProjectSelector({ isCollapsed }: { isCollapsed: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname.startsWith('/project/');

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleSelect = (projectId: string) => {
    setIsOpen(false);
    router.push(`/project/${projectId}/folder`);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200
          ${isCollapsed ? 'justify-center' : ''}
          ${isActive
            ? 'bg-wedd-mint/20 text-wedd-mint border-l-2 border-wedd-mint ml-[-1px]'
            : 'text-wedd-gray-400 hover:bg-wedd-black-light hover:text-white'
          }
        `}
        title={isCollapsed ? 'Dossiers' : undefined}
      >
        <FolderOpen className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-wedd-mint' : ''}`} />
        {!isCollapsed && (
          <>
            <span className="font-medium flex-1 text-left">Dossiers</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200
            ${isCollapsed ? 'left-full top-0 ml-2 w-72' : 'left-0 right-0 mt-1 w-full min-w-[240px]'}
          `}
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Accès direct</p>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {projects.map(project => {
              const client = clients.find(c => c.id === project.clientId);
              const status = statusConfig[project.status];
              return (
                <button
                  key={project.id}
                  onClick={() => handleSelect(project.id)}
                  className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-wedd-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4 text-wedd-mint" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {client && <span className="text-xs text-gray-400">{client.name}</span>}
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${status?.bg} ${status?.color}`}>
                          {status?.label}
                        </span>
                      </div>
                      {/* Domain dots */}
                      <div className="flex items-center gap-1 mt-1">
                        {project.domains.map(d => (
                          <span key={d} className="w-2 h-2 rounded-full" style={{ backgroundColor: domainColors[d] }} />
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">{project.progress}%</span>
                        <div className="flex-1 h-1 bg-gray-100 rounded-full ml-1">
                          <div className="h-1 bg-wedd-mint rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Menu Items ─────────────────────────────────────────────────────────

const mainMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: TrendingUp, label: 'Pipeline', href: '/pipeline' },
];

const adminMenuItems = [
  { icon: Building2, label: 'Clients', href: '/clients' },
  { icon: BookOpen, label: 'Ressources', href: '/resources' },
  { icon: FileSignature, label: 'Contrats', href: '/contracts' },
  { icon: Users, label: 'Utilisateurs', href: '/users', adminOnly: true },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
];

// ─── Sidebar Component ──────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = currentUser.role === 'admin';
  const { isCollapsed, toggleSidebar, collapseSidebar } = useSidebar();
  const [adminOpen, setAdminOpen] = useState(false);

  // Auto-open admin section if we're on one of its pages
  useEffect(() => {
    const adminPaths = adminMenuItems.map(i => i.href);
    if (adminPaths.some(p => pathname === p || (p !== '/' && pathname.startsWith(p)))) {
      setAdminOpen(true);
    }
  }, [pathname]);

  // Auto-collapse sidebar when navigating (on smaller screens)
  useEffect(() => {
    if (window.innerWidth < 1024 && !isCollapsed) {
      collapseSidebar();
    }
  }, [pathname, collapseSidebar, isCollapsed]);

  const renderLink = (item: { icon: React.ElementType; label: string; href: string; adminOnly?: boolean }) => {
    if (item.adminOnly && !isAdmin) return null;

    const isActive = pathname === item.href ||
      (item.href !== '/' && pathname.startsWith(item.href));

    return (
      <li key={item.href + item.label}>
        <Link
          href={item.href}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
            ${isActive
              ? 'bg-wedd-mint/20 text-wedd-mint border-l-2 border-wedd-mint ml-[-1px]'
              : 'text-wedd-gray-400 hover:bg-wedd-black-light hover:text-white'
            }
          `}
          title={isCollapsed ? item.label : undefined}
        >
          <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-wedd-mint' : ''}`} />
          {!isCollapsed && <span className="font-medium">{item.label}</span>}
        </Link>
      </li>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-wedd-black flex flex-col z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-wedd-black-light justify-between">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-wedd-mint rounded flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-wedd-black text-sm font-display">W</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-white whitespace-nowrap font-display tracking-tight">WeDD</span>
          )}
        </Link>
        <div className="flex items-center gap-1">
          {!isCollapsed && <NotificationBell />}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded hover:bg-wedd-black-light transition-colors text-wedd-gray-400 hover:text-white"
            title={isCollapsed ? 'Développer' : 'Réduire'}
          >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 flex flex-col">
        {/* Main items */}
        <ul className="space-y-1">
          {mainMenuItems.map(item => renderLink(item))}
        </ul>

        {/* Dossiers — quick access */}
        <div className="mt-1">
          <ProjectSelector isCollapsed={isCollapsed} />
        </div>

        {/* Separator */}
        <div className="my-3 mx-3 border-t border-wedd-black-light" />

        {/* Administration sub-menu */}
        <div>
          {!isCollapsed ? (
            <>
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded text-wedd-gray-400 hover:text-white hover:bg-wedd-black-light transition-all duration-200"
              >
                <Settings className="w-4 h-4 flex-shrink-0 opacity-60" />
                <span className="text-xs font-semibold uppercase tracking-wider flex-1 text-left">Administration</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
              </button>
              {adminOpen && (
                <ul className="mt-1 space-y-0.5 ml-1">
                  {adminMenuItems.map(item => renderLink(item))}
                </ul>
              )}
            </>
          ) : (
            /* When collapsed, show admin items as regular icons */
            <ul className="space-y-1">
              {adminMenuItems.map(item => renderLink(item))}
            </ul>
          )}
        </div>
      </nav>

      {/* User Badge */}
      <div className="p-3 border-t border-wedd-black-light">
        <div className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-wedd-black-light transition-colors cursor-pointer ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <Avatar
            name={currentUser.name}
            initials={currentUser.initials}
            color={currentUser.color}
            size={isCollapsed ? 'sm' : 'md'}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-wedd-gray-400 truncate">
                {currentUser.title}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
