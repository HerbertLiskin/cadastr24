import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'indigo' | 'violet' | 'none';
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-panel rounded-2xl p-6 relative overflow-hidden',
          glow === 'indigo' && 'glow-indigo',
          glow === 'violet' && 'glow-violet',
          hoverable && 'glass-panel-hover',
          className
        )
      )}
      {...props}
    >
      {/* Decorative ambient subtle top border reflection */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
};
