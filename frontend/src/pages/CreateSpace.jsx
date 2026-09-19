import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { createSpace, uploadPublicFile } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input, Textarea, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { Sparkles, Plus, Trash2, Copy, ExternalLink, CheckCircle2, Upload } from 'lucide-react';

export const CreateSpace = () => {
  const { spaces, setSpaces, setCurrentSpace } = useOutletContext();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [customPrompt, setCustomPrompt] = useState('How has our product/service helped you achieve your goals?');
  const [showAvatar, setShowAvatar] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [customQuestions, setCustomQuestions] = useState(['What feature do you use most?']);
  const [newQuestion, setNewQuestion] = useState('');

  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState('');
  const [createdSpace, setCreatedSpace] = useState(null);
  const [toast, setToast] = useState('');

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const res = await uploadPublicFile(file);
      setLogo(res.data.url);
      setToast('Logo uploaded successfully!');
    } catch (err) {
      console.error("Logo upload error:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const addCustomQuestion = () => {
    if (!newQuestion.trim()) return;
    setCustomQuestions([...customQuestions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const removeCustomQuestion = (index) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        businessName,
        slug: slug.trim() || undefined,
        logo: logo.trim() || undefined,
        description: description.trim() || undefined,
        customPrompt: customPrompt.trim() || 'How has our product/service helped you achieve your goals?',
        showAvatar,
        showRating,
        customQuestions
      };

      const res = await createSpace(payload);
      setCreatedSpace(res.data);
      const updated = [res.data, ...spaces];
      setSpaces(updated);
      setCurrentSpace(res.data);
      setToast('Space created successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create space. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const copyCollectionLink = () => {
    if (!createdSpace) return;
    const url = `${window.location.origin}/collect/${createdSpace.slug}`;
    navigator.clipboard.writeText(url);
    setToast('Collection URL copied to clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Create New Space</h1>
        <p className="text-sm text-slate-400 mt-1">Configure your product feedback collector and custom questions.</p>
      </div>

      {createdSpace ? (
        <Card className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">{createdSpace.businessName} Created!</h2>
            <p className="text-sm text-slate-400">Your collection link is live and ready to receive customer reviews.</p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <Label>Your Public Collection Link</Label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`${window.location.origin}/collect/${createdSpace.slug}`}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-indigo-300 font-mono"
              />
              <Button variant="primary" size="sm" onClick={copyCollectionLink}>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <a
              href={`/collect/${createdSpace.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl coss-gradient-bg text-white font-semibold text-sm shadow-md hover:opacity-90"
            >
              <span>Open Collection Page</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Button variant="secondary" onClick={() => navigate('/dashboard/testimonials')}>
              Go to Testimonials
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <Input
              label="Business / Product Name"
              placeholder="e.g. Instagram, Acme Corp, SaaSify"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <Input
              label="Custom URL Slug (Optional)"
              placeholder="e.g. instagram"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helper="Will generate link /collect/your-slug"
            />

            <div>
              <Label>Business Logo / Avatar</Label>
              <div className="flex items-center gap-4 mt-1">
                {logo ? (
                  <img src={logo} alt="Logo preview" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-xs font-bold">
                    Logo
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="https://example.com/logo.png"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingLogo ? 'Uploading...' : 'Upload Image File'}</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Textarea
              label="Description (Optional)"
              placeholder="Brief summary of your product or service..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />

            <Textarea
              label="Custom Review Question / Header Prompt"
              placeholder="e.g. How has Instagram helped you achieve your goals?"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={2}
              required
            />

            {/* Display Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAvatar}
                  onChange={(e) => setShowAvatar(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Allow Customer Avatar</span>
                  <span className="text-[10px] text-slate-400">Permit optional image upload</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRating}
                  onChange={(e) => setShowRating(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Require Star Rating</span>
                  <span className="text-[10px] text-slate-400">Collect 1–5 star scores</span>
                </div>
              </label>
            </div>

            {/* Custom Questions List */}
            <div className="space-y-3">
              <Label>Custom Extra Questions (Optional)</Label>
              {customQuestions.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200">
                  <span>{q}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomQuestion(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add another custom question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <Button type="button" variant="secondary" size="md" onClick={addCustomQuestion}>
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </Button>
              </div>
            </div>

            <CardFooter className="px-0 pb-0">
              <Button type="submit" variant="primary" loading={loading} className="w-full">
                <Sparkles className="w-4 h-4" />
                <span>Create Space & Generate Collection Link</span>
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};
