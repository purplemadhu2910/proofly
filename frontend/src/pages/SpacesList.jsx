import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { deleteSpace } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { Dialog } from '../components/ui/Dialog';
import { Boxes, PlusCircle, ExternalLink, Copy, Trash2, Edit3, MessageSquareQuote } from 'lucide-react';

export const SpacesList = () => {
  const { spaces, setSpaces, setCurrentSpace } = useOutletContext();
  const [toast, setToast] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const copyLink = (slug) => {
    const url = `${window.location.origin}/collect/${slug}`;
    navigator.clipboard.writeText(url);
    setToast(`Collection URL copied: /collect/${slug}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteSpace(deleteId);
      const updated = spaces.filter((s) => s.id !== deleteId);
      setSpaces(updated);
      if (updated.length > 0) setCurrentSpace(updated[0]);
      setToast('Space deleted successfully.');
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <Dialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Space"
        description="Are you sure you want to delete this space and all associated testimonials? This action cannot be undone."
        confirmText="Delete Space"
        confirmVariant="danger"
        onConfirm={handleDelete}
        loading={deleting}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Business Spaces</h1>
          <p className="text-sm text-slate-400 mt-1">Manage all business products collecting feedback and testimonials.</p>
        </div>

        <Link to="/dashboard/spaces/new">
          <Button variant="primary">
            <PlusCircle className="w-4 h-4" />
            <span>Create Space</span>
          </Button>
        </Link>
      </div>

      {spaces.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 mb-4">
            <Boxes className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Spaces Created Yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mt-1 mb-6">Create a Space to generate your unique `/collect/:slug` public review link.</p>
          <Link to="/dashboard/spaces/new">
            <Button variant="primary">Create First Space</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Card key={space.id} className="flex flex-col justify-between">
              <div>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {space.logo ? (
                      <img src={space.logo} alt={space.businessName} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl coss-gradient-bg text-white font-bold flex items-center justify-center text-lg shadow-md">
                        {space.businessName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{space.businessName}</CardTitle>
                      <span className="text-xs text-indigo-400 font-mono">/collect/{space.slug}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteId(space.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                    title="Delete space"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardHeader>

                <CardContent className="space-y-3">
                  {space.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{space.description}</p>
                  )}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                    <p className="text-slate-400 font-medium">Custom Prompt:</p>
                    <p className="text-slate-200 italic">"{space.customPrompt}"</p>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="gap-2">
                <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => copyLink(space.slug)}>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </Button>
                <a
                  href={`/collect/${space.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                  title="Open public collection page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
