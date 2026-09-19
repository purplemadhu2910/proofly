import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'coss-gradient-bg text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 active:scale-[0.98]',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 active:scale-[0.98]',
    outline: 'border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400 active:scale-[0.98]',
    danger: 'bg-rose-600/90 text-white hover:bg-rose-600 shadow-lg shadow-rose-600/20 active:scale-[0.98]',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};
