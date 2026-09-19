import React from 'react';

export const Card = ({ children, className = '', glow = false, ...props }) => {
  return (
    <div
      className={`coss-glass-card rounded-2xl p-6 ${glow ? 'coss-featured-glow' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-white tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-400 mt-1 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between ${className}`}>
    {children}
  </div>
);
