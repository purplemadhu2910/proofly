import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { PublicWallOfLove } from './PublicWallOfLove';
import { Button } from '../components/ui/Button';
import { ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import { Toast } from '../components/ui/Toast';

export const WallOfLovePreview = () => {
  const { currentSpace } = useOutletContext();
  const [toast, setToast] = useState('');

  if (!currentSpace) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Please select a space to view Wall of Love.</p>
      </div>
    );
  }

  const copyWallLink = () => {
    const url = `${window.location.origin}/wall/${currentSpace.slug}`;
    navigator.clipboard.writeText(url);
    setToast('Wall of Love link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Wall of Love Preview</h1>
          <p className="text-sm text-slate-400 mt-1">Live preview of your public social proof showcase for <span className="text-indigo-400 font-bold">{currentSpace.businessName}</span>.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={copyWallLink}>
            <Copy className="w-4 h-4" />
            <span>Copy Wall Link</span>
          </Button>
          <a
            href={`/wall/${currentSpace.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl coss-gradient-bg text-white shadow-md hover:opacity-95"
          >
            <span>Open Standalone Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#090d16] overflow-hidden shadow-2xl">
        <PublicWallOfLove />
      </div>
    </div>
  );
};
