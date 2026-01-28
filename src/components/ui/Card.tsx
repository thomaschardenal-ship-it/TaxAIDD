'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'dark' | 'mint';
}

export function Card({ children, className = '', hover = false, onClick, variant = 'default' }: CardProps) {
  const variantClasses = {
    default: 'bg-white border border-wedd-gray-200',
    dark: 'bg-wedd-black text-white',
    mint: 'bg-wedd-mint-50 border border-wedd-mint/30',
  };

  return (
    <div
      className={`
        rounded shadow-sm
        ${variantClasses[variant]}
        ${hover ? 'card-hover cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-5 py-4 border-b border-wedd-gray-200 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-5 py-4 border-t border-wedd-gray-200 bg-wedd-gray-100 rounded-b ${className}`}>
      {children}
    </div>
  );
}
