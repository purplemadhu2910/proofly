import React from 'react';

export const Skeleton = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-800/80 rounded-lg ${height} ${width} ${className}`}
    />
  );
};
