import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  loading = false,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${maxWidth} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden relative transform transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {title && <h3 className="text-lg font-bold text-white pr-8">{title}</h3>}
        {description && <p className="text-sm text-slate-400 mt-1.5">{description}</p>}

        <div className="mt-4">{children}</div>

        {(onConfirm || onClose) && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
