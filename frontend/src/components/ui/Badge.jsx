import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    archived: 'bg-slate-700/40 text-slate-400 border-slate-600/40',
    featured: 'bg-pink-500/15 text-pink-300 border-pink-500/40 shadow-sm shadow-pink-500/20',
    indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border capitalize transition-colors ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};
