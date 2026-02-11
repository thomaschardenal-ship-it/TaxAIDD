'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, BookOpen, Building2, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { currentUser } from '@/data';
import Avatar from '@/components/ui/Avatar';
import { useSidebar } from '@/context/SidebarContext';
import NotificationBell from './NotificationBell';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: TrendingUp, label: 'Pipeline', href: '/pipeline' },
  { icon: Building2, label: 'Clients', href: '/clients' },
  { icon: BookOpen, label: 'Ressources', href: '/resources' },
  { icon: Users, label: 'Utilisateurs', href: '/users', adminOnly: true },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = currentUser.role === 'admin';
  const { isCollapsed, toggleSidebar, collapseSidebar } = useSidebar();

  // Auto-collapse sidebar when navigating (on smaller screens or when clicking a link)
  useEffect(() => {
    // Auto-collapse on navigation for mobile/tablet
    if (window.innerWidth < 1024 && !isCollapsed) {
      collapseSidebar();
    }
  }, [pathname, collapseSidebar, isCollapsed]);

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
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded
                    transition-all duration-200
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
          })}
        </ul>
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
