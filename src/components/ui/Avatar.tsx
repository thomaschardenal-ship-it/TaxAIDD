'use client';

import React from 'react';

interface AvatarProps {
  name: string;
  initials: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
};

export default function Avatar({ name, initials, color = '#6B00E0', size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{ name: string; initials: string; color: string }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const displayed = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {displayed.map((user, index) => (
        <Avatar
          key={index}
          name={user.name}
          initials={user.initials}
          color={user.color}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`flex items-center justify-center rounded-full bg-taxaidd-gray text-taxaidd-black font-medium ring-2 ring-white ${sizeClasses[size]}`}
          title={`+${remaining} autres`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
