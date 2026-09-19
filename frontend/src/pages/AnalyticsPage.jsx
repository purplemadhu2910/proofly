import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getSpaceAnalytics } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { RatingStars } from '../components/ui/RatingStars';
import { Skeleton } from '../components/ui/Skeleton';
import { BarChart3, Star, CheckCircle2, MessageSquareQuote, Sparkles } from 'lucide-react';

export const AnalyticsPage = () => {
  const { currentSpace } = useOutletContext();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentSpace) return;
      setLoading(true);
      try {
        const res = await getSpaceAnalytics(currentSpace.id);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Analytics load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [currentSpace]);

  if (!currentSpace) {
    return <div className="text-center py-16 text-slate-400">Select a Space to view analytics.</div>;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton height="h-24" />
        <Skeleton height="h-64" />
      </div>
    );
  }

  const breakdown = analytics?.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const total = analytics?.totalTestimonials || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Space Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Review metrics and star rating distribution for <span className="text-indigo-400 font-bold">{currentSpace.businessName}</span>.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Submissions</span>
          <p className="text-3xl font-extrabold text-white mt-2">{total}</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Average Score</span>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-extrabold text-amber-400">{analytics?.averageRating ?? 0.0}</p>
            <RatingStars rating={analytics?.averageRating || 0} size="sm" />
          </div>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Approved Social Proof</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{analytics?.approvedTestimonials ?? 0}</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Featured Highlights</span>
          <p className="text-3xl font-extrabold text-pink-400 mt-2">{analytics?.featuredTestimonials ?? 0}</p>
        </Card>
      </div>

      {/* Rating Distribution Progress Bars */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <span>Star Rating Distribution</span>
        </h3>

        <div className="space-y-3 max-w-2xl">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star] || 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={star} className="flex items-center gap-4 text-xs font-semibold">
                <span className="w-16 text-slate-300 flex items-center gap-1">
                  {star} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>

                <div className="flex-1 h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full coss-gradient-bg rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-16 text-right text-slate-400">
                  {count} <span className="text-[10px] text-slate-500">({percentage}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
