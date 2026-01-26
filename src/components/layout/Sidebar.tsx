'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Users, Settings } from 'lucide-react';
import { currentUser } from '@/data';
import Avatar from '@/components/ui/Avatar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: FolderKanban, label: 'Projets', href: '/' },
  { icon: Users, label: 'Utilisateurs', href: '/users', adminOnly: true },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = currentUser.role === 'admin';

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-omni-yellow rounded-lg flex items-center justify-center">
            <span className="font-bold text-omni-black text-sm">O</span>
          </div>
          <span className="font-bold text-xl text-omni-black">OMNI</span>
          <span className="text-xs text-gray-500 mt-1">Advisory</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
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
                    ${isActive
                      ? 'bg-omni-yellow/20 text-omni-black border-l-2 border-omni-yellow ml-[-1px]'
                      : 'text-gray-600 hover:bg-omni-gray-light hover:text-omni-black'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-omni-yellow-dark' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Badge */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-omni-gray-light transition-colors cursor-pointer">
          <Avatar
            name={currentUser.name}
            initials={currentUser.initials}
            color={currentUser.color}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-omni-black truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser.title}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
