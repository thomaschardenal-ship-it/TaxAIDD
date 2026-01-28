'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'mint';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  showArrow?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-wedd-black hover:bg-wedd-black-light text-white',
  secondary: 'bg-wedd-mint hover:bg-wedd-mint-dark text-wedd-black',
  outline: 'border border-wedd-gray-300 hover:border-wedd-black bg-white text-wedd-black',
  ghost: 'hover:bg-wedd-gray-100 text-wedd-black',
  mint: 'bg-wedd-mint hover:bg-wedd-mint-dark text-wedd-black font-semibold',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  showArrow = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded
        transition-all duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {showArrow && <ArrowUpRight className="w-4 h-4 ml-1" />}
    </button>
  );
}
