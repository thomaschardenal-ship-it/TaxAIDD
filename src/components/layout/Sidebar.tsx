'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { currentUser } from '@/data';
import Avatar from '@/components/ui/Avatar';
import { useSidebar } from '@/context/SidebarContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: FolderKanban, label: 'Projets', href: '/' },
  { icon: Users, label: 'Utilisateurs', href: '/users', adminOnly: true },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = currentUser.role === 'admin';
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 justify-between">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-taxaidd-yellow rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-taxaidd-black text-sm">T</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-taxaidd-black whitespace-nowrap">TaxAIDD</span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-taxaidd-gray-light transition-colors text-gray-500 hover:text-taxaidd-black"
          title={isCollapsed ? 'Développer' : 'Réduire'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
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
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${isCollapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'bg-taxaidd-yellow/20 text-taxaidd-black border-l-2 border-taxaidd-yellow ml-[-1px]'
                      : 'text-gray-600 hover:bg-taxaidd-gray-light hover:text-taxaidd-black'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-taxaidd-yellow-dark' : ''}`} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Badge */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-taxaidd-gray-light transition-colors cursor-pointer ${
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
              <p className="text-sm font-medium text-taxaidd-black truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.title}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
