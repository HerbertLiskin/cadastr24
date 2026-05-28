import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate' | 'crimson';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'indigo',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-display tracking-wide backdrop-blur-md border';
  
  const variantStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
    slate: 'bg-slate-500/10 text-slate-300 border-slate-500/25',
    crimson: 'bg-red-500/10 text-red-300 border-red-500/25',
  };

  return (
    <span
      className={twMerge(clsx(baseStyle, variantStyles[variant], className))}
      {...props}
    >
      {children}
    </span>
  );
};
