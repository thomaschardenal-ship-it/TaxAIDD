'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Upload, MessageSquare, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { notifications as initialNotifications, getUnreadCount, type Notification } from '@/data/notifications';

const typeIcons: Record<Notification['type'], React.ElementType> = {
  document_uploaded: Upload,
  review_request: MessageSquare,
  deadline: Clock,
  task_assigned: CheckCircle,
  status_change: RefreshCw,
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes}min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays === 1) return 'hier';
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<Notification[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notificationList.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded hover:bg-wedd-black-light transition-colors text-wedd-gray-400 hover:text-white"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-full top-0 ml-2 w-80 bg-white rounded shadow-lg border border-wedd-gray-200 z-50 max-h-[28rem] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-wedd-gray-200">
            <h3 className="text-sm font-semibold text-wedd-black">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-wedd-mint-dark hover:text-wedd-mint font-medium transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            {notificationList.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-wedd-gray-400">
                Aucune notification
              </div>
            ) : (
              notificationList.map((notification) => {
                const Icon = typeIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-wedd-gray-100 transition-colors cursor-pointer ${
                      !notification.read ? 'border-l-2 border-l-blue-500 bg-blue-50/30' : 'border-l-2 border-l-transparent'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <Icon className={`w-4 h-4 ${!notification.read ? 'text-wedd-mint-dark' : 'text-wedd-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${!notification.read ? 'font-semibold text-wedd-black' : 'font-medium text-wedd-gray-500'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-wedd-gray-400 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-wedd-gray-300 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
