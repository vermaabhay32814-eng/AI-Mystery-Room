// client/src/components/ui/Badge.jsx
import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const variantStyles = {
    neutral: 'bg-noir-800 text-noir-300 border-noir-700/60',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    red: 'bg-red-950/60 text-red-300 border-red-800/40',
    blue: 'bg-blue-950/60 text-blue-300 border-blue-800/40',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-800/40'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
        variantStyles[variant] || variantStyles.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
};

