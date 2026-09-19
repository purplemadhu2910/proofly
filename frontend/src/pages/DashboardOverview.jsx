import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { getSpaceAnalytics, getTestimonials } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RatingStars } from '../components/ui/RatingStars';
import { Badge } from '../components/ui/Badge';
import { Toast } from '../components/ui/Toast';
import {
  MessageSquareQuote,
  Clock,
  CheckCircle2,
  Star,
  Sparkles,
  Copy,
  ExternalLink,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

export const DashboardOverview = () => {
  const { currentSpace } = useOutletContext();
  const [analytics, setAnalytics] = useState(null);
  const [recentTestimonials, setRecentTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentSpace) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [analyticsRes, testimonialsRes] = await Promise.all([
          getSpaceAnalytics(currentSpace.id),
          getTestimonials({ spaceId: currentSpace.id, limit: 5 })
        ]);
        setAnalytics(analyticsRes.data);
        setRecentTestimonials(testimonialsRes.data.testimonials);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentSpace]);

  const copyCollectionLink = () => {
    if (!currentSpace) return;
    const url = `${window.location.origin}/collect/${currentSpace.slug}`;
    navigator.clipboard.writeText(url);
    setToast('Collection link copied to clipboard!');
  };

  if (!currentSpace && !loading) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">No Space Selected</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">Create your first business Space to start collecting customer testimonials.</p>
        <Link to="/dashboard/spaces/new">
          <Button variant="primary">Create Space</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Overview</h1>
            {currentSpace && <Badge variant="indigo">{currentSpace.businessName}</Badge>}
          </div>
          <p className="text-sm text-slate-400 mt-1">Real-time performance summary and review moderation.</p>
        </div>

        {currentSpace && (
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={copyCollectionLink}>
              <Copy className="w-4 h-4" />
              <span>Copy Public Link</span>
            </Button>
            <a
              href={`/collect/${currentSpace.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl coss-gradient-bg text-white shadow-md hover:opacity-95"
            >
              <span>View Collection Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
            <MessageSquareQuote className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{analytics?.totalTestimonials ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Submitted Reviews</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pending</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 mt-3">{analytics?.pendingTestimonials ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting Review</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-3">{analytics?.approvedTestimonials ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Live on Wall of Love</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Featured</span>
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-3xl font-extrabold text-pink-400 mt-3">{analytics?.featuredTestimonials ?? 0}</p>
          <p className="text-[11px] text-slate-500 mt-1">Highlighted Reviews</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Average</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {analytics?.averageRating ? analytics.averageRating.toFixed(1) : '0.0'}
            <span className="text-xs text-slate-500 font-normal"> / 5.0</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Customer Satisfaction</p>
        </Card>
      </div>

      {/* Main Content Grid: Recent Feed & Quick Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Testimonial Submissions</h3>
            <Link to="/dashboard/testimonials" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
              <span>Moderate All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTestimonials.length === 0 ? (
              <Card className="text-center py-10">
                <p className="text-slate-400 text-sm">No testimonials submitted yet for this space.</p>
                <p className="text-xs text-slate-500 mt-1">Share your collection URL to start gathering customer feedback!</p>
              </Card>
            ) : (
              recentTestimonials.map((t) => (
                <Card key={t.id} className="p-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.customerName} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-sm border border-slate-700">
                          {t.customerName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{t.customerName}</h4>
                        <p className="text-xs text-slate-400 leading-tight">{t.companyRole || 'Customer'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={t.rating} size="sm" />
                      <Badge variant={t.status}>{t.status}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 italic">"{t.reviewText}"</p>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Share & Wall Preview Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Public Collection Page</span>
            </h3>
            <p className="text-xs text-slate-400">
              Send this link directly to customers via email, live chat, or social media to collect feedback without requiring them to log in.
            </p>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-indigo-300 break-all">
              {window.location.origin}/collect/{currentSpace?.slug}
            </div>

            <Button variant="primary" className="w-full text-xs" onClick={copyCollectionLink}>
              <Copy className="w-4 h-4" />
              <span>Copy Collection Link</span>
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Wall of Love</span>
            </h3>
            <p className="text-xs text-slate-400">
              Your public showcase page displays all approved testimonials in a beautiful responsive grid layout.
            </p>
            <a
              href={`/wall/${currentSpace?.slug}`}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>View Wall of Love Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};
