import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getSpaceEmbedCode } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Input';
import { Toast } from '../components/ui/Toast';
import { Code2, Copy, Check, LayoutGrid, Sliders, Sun, Moon, BadgeAlert } from 'lucide-react';

export const EmbedGenerator = () => {
  const { currentSpace } = useOutletContext();
  const [layout, setLayout] = useState('grid');
  const [theme, setTheme] = useState('dark');
  const [embedData, setEmbedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchEmbed = async () => {
      if (!currentSpace) return;
      setLoading(true);
      try {
        const res = await getSpaceEmbedCode(currentSpace.id, { layout, theme });
        setEmbedData(res.data);
      } catch (err) {
        console.error("Embed load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmbed();
  }, [currentSpace, layout, theme]);

  const copyEmbedCode = () => {
    if (!embedData) return;
    navigator.clipboard.writeText(embedData.iframeSnippet);
    setCopied(true);
    setToast('Iframe embed code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentSpace) {
    return (
      <div className="text-center py-16 text-slate-400">
        Please select a Space to generate embed codes.
      </div>
    );
  }

  const embedUrl = `${window.location.origin}/embed/${currentSpace.slug}?layout=${layout}&theme=${theme}`;
  const iframeSnippet = `<iframe src="${embedUrl}" width="100%" height="${layout === 'badge' ? '120' : '600'}" frameborder="0" scrolling="no" style="border:none; border-radius:16px; overflow:hidden;"></iframe>`;

  return (
    <div className="space-y-8 animate-fade-in">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Embed Generator</h1>
        <p className="text-sm text-slate-400 mt-1">Customize visual widget layout & copy 1-click iframe code for your website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Embed Configuration Controls */}
        <Card className="space-y-6">
          <CardHeader className="p-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>Widget Customizer</span>
            </CardTitle>
            <CardDescription>Select layout display & color palette.</CardDescription>
          </CardHeader>

          {/* Layout Selector */}
          <div className="space-y-2">
            <Label>Layout Format</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'grid', label: 'Grid', icon: <LayoutGrid className="w-4 h-4" /> },
                { id: 'carousel', label: 'Carousel', icon: <Sliders className="w-4 h-4" /> },
                { id: 'badge', label: 'Badge', icon: <BadgeAlert className="w-4 h-4" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLayout(item.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition-all ${
                    layout === item.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-2">
            <Label>Color Theme</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Theme</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Theme</span>
              </button>
            </div>
          </div>

          {/* Generated Code Output */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <Label>HTML Iframe Embed Code</Label>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-indigo-300 break-all select-all max-h-32 overflow-y-auto">
              {iframeSnippet}
            </div>

            <Button variant="primary" className="w-full text-xs mt-3" onClick={copyEmbedCode}>
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Code Copied!' : 'Copy Embed Code'}</span>
            </Button>
          </div>
        </Card>

        {/* Live Interactive Sandbox Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Live Embed Sandbox Preview</h3>
            <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
              {layout} • {theme}
            </span>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center">
            <iframe
              src={embedUrl}
              className="w-full rounded-2xl border-0 transition-all duration-300"
              style={{
                height: layout === 'badge' ? '140px' : '550px',
                border: 'none',
              }}
              title="Proofly Social Proof Embed Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
