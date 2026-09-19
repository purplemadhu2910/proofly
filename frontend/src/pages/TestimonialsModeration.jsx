import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getTestimonials, updateTestimonial, deleteTestimonial, exportTestimonialsCsv } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { RatingStars } from '../components/ui/RatingStars';
import { Toast } from '../components/ui/Toast';
import { Dialog } from '../components/ui/Dialog';
import { Skeleton } from '../components/ui/Skeleton';
import {
  MessageSquareQuote,
  Search,
  Filter,
  Check,
  X,
  Archive,
  Star,
  Heart,
  Trash2,
  Clock,
  CheckCircle2,
  Sparkles,
  Download
} from 'lucide-react';

export const TestimonialsModeration = () => {
  const { currentSpace } = useOutletContext();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [statusTab, setStatusTab] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = async () => {
    if (!currentSpace) return;
    setLoading(true);
    try {
      const params = {
        spaceId: currentSpace.id,
        status: statusTab !== 'all' ? statusTab : undefined,
        rating: ratingFilter !== 'all' ? parseInt(ratingFilter, 10) : undefined,
        search: searchQuery.trim() || undefined,
      };
      const res = await getTestimonials(params);
      setTestimonials(res.data.testimonials);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentSpace, statusTab, ratingFilter, searchQuery]);

  const handleExportCsv = async () => {
    if (!currentSpace) return;
    setExporting(true);
    try {
      const res = await exportTestimonialsCsv(currentSpace.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `proofly_${currentSpace.slug}_testimonials.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast('CSV Report downloaded successfully.');
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateTestimonial(id, { status: newStatus });
      setToast(`Testimonial status updated to ${newStatus}.`);
      fetchTestimonials();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const handleToggleFeatured = async (id, currentVal) => {
    try {
      await updateTestimonial(id, { isFeatured: !currentVal });
      setToast(!currentVal ? 'Testimonial marked as Featured.' : 'Featured status removed.');
      fetchTestimonials();
    } catch (err) {
      console.error("Toggle featured error:", err);
    }
  };

  const handleToggleLiked = async (id, currentVal) => {
    try {
      await updateTestimonial(id, { isLiked: !currentVal });
      fetchTestimonials();
    } catch (err) {
      console.error("Toggle liked error:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteTestimonial(deleteId);
      setToast('Testimonial deleted successfully.');
      setDeleteId(null);
      fetchTestimonials();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Reviews' },
    { id: 'pending', label: 'Pending', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'approved', label: 'Approved', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'archived', label: 'Archived', icon: <Archive className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <Dialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Testimonial"
        description="Are you sure you want to delete this customer review? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        loading={deleting}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Testimonial Moderation</h1>
          <p className="text-sm text-slate-400 mt-1">Review, approve, reject, feature, and manage social proof.</p>
        </div>

        <Button variant="secondary" size="sm" onClick={handleExportCsv} loading={exporting}>
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <Tabs tabs={tabs} activeTab={statusTab} onChange={setStatusTab} className="max-w-md" />

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, email, review..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Rating Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-2"
            >
              <option value="all" className="bg-slate-900">All Ratings</option>
              <option value="5" className="bg-slate-900">5 Stars</option>
              <option value="4" className="bg-slate-900">4 Stars</option>
              <option value="3" className="bg-slate-900">3 Stars</option>
              <option value="2" className="bg-slate-900">2 Stars</option>
              <option value="1" className="bg-slate-900">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Card / Table List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton height="h-24" />
          <Skeleton height="h-24" />
          <Skeleton height="h-24" />
        </div>
      ) : testimonials.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500 mb-3">
            <MessageSquareQuote className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Testimonials Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search query or status filter.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <Card key={t.id} glow={t.isFeatured} className="p-6 transition-all hover:border-slate-700">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                {/* Customer Details & Review */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.customerName} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-base border border-slate-700">
                        {t.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{t.customerName}</h4>
                        {t.isFeatured && (
                          <Badge variant="featured" size="sm">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {t.companyRole || 'Customer'} • <span className="text-slate-500">{t.customerEmail}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <RatingStars rating={t.rating} size="sm" showScore />
                    <span className="text-[11px] text-slate-500">
                      Submitted on {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 font-medium leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 italic">
                    "{t.reviewText}"
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 shrink-0">
                  <Badge variant={t.status}>{t.status}</Badge>

                  <div className="flex items-center gap-2 mt-2">
                    {t.status !== 'approved' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(t.id, 'approved')}
                        title="Approve Review"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </Button>
                    )}

                    {t.status !== 'archived' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUpdateStatus(t.id, 'archived')}
                        title="Archive Review"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </Button>
                    )}

                    <button
                      onClick={() => handleToggleFeatured(t.id, t.isFeatured)}
                      className={`p-2 rounded-xl border transition-colors ${
                        t.isFeatured
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title="Toggle Featured"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleLiked(t.id, t.isLiked)}
                      className={`p-2 rounded-xl border transition-colors ${
                        t.isLiked
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title="Like Testimonial"
                    >
                      <Heart className={`w-4 h-4 ${t.isLiked ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="p-2 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
