import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Label = ({ children, required = false, className = '' }) => (
  <label className={`block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 ${className}`}>
    {children}
    {required && <span className="text-rose-400 ml-1">*</span>}
  </label>
);

export const Input = React.forwardRef(({ label, error, helper, required, className = '', type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = type === 'password';

  const computedType = isPasswordInput ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        <input
          ref={ref}
          type={computedType}
          className={`w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm ${
            isPasswordInput ? 'pr-11' : ''
          } ${error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500' : ''} ${className}`}
          {...props}
        />
        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus:outline-none"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
      {helper && !error && <p className="text-xs text-slate-500 mt-1.5">{helper}</p>}
    </div>
  );
});

export const Textarea = React.forwardRef(({ label, error, helper, required, rows = 4, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <Label required={required}>{label}</Label>}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 text-sm resize-y ${error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
      {helper && !error && <p className="text-xs text-slate-500 mt-1.5">{helper}</p>}
    </div>
  );
});
