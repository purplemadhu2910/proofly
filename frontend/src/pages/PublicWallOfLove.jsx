import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicSpace, getPublicWall } from '../services/api';
import { RatingStars } from '../components/ui/RatingStars';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Heart, Sparkles, MessageSquareQuote, CheckCircle2 } from 'lucide-react';

export const PublicWallOfLove = () => {
  const { spaceSlug } = useParams();
  const [space, setSpace] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallData = async () => {
      setLoading(true);
      try {
        const [spaceRes, wallRes] = await Promise.all([
          getPublicSpace(spaceSlug),
          getPublicWall(spaceSlug)
        ]);
        setSpace(spaceRes.data);
        setTestimonials(wallRes.data);
      } catch (err) {
        console.error("Wall of love load error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (spaceSlug) fetchWallData();
  }, [spaceSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white p-8 max-w-6xl mx-auto space-y-8">
        <Skeleton height="h-20" width="w-64" className="mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton height="h-48" />
          <Skeleton height="h-48" />
          <Skeleton height="h-48" />
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <MessageSquareQuote className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold">Wall of Love Not Found</h2>
        </div>
      </div>
    );
  }

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans selection:bg-indigo-500 selection:text-white py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            <span>Loved by our customers</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            {space.logo && (
              <img src={space.logo} alt={space.businessName} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {space.businessName} Wall of Love
            </h1>
          </div>

          {space.description && (
            <p className="text-slate-400 text-base max-w-xl mx-auto font-normal leading-relaxed">{space.description}</p>
          )}

          <div className="inline-flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-full px-5 py-2 text-sm font-semibold">
            <RatingStars rating={parseFloat(averageRating)} size="md" />
            <span className="text-white font-bold">{averageRating} / 5.0</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{testimonials.length} Verified Reviews</span>
          </div>
        </div>

        {/* Masonry / Grid Layout */}
        {testimonials.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-lg mx-auto p-8 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Approved Testimonials Yet</h3>
            <p className="text-xs text-slate-400">Approved customer feedback will appear here on the Wall of Love.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className={`break-inside-avoid coss-glass-card rounded-2xl p-6 transition-all hover:scale-[1.01] ${
                  t.isFeatured ? 'coss-featured-glow' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <RatingStars rating={t.rating} size="sm" />
                  {t.isFeatured && (
                    <Badge variant="featured" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-slate-200 font-medium leading-relaxed mb-6 italic">
                  "{t.reviewText}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.customerName} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full coss-gradient-bg text-white font-bold flex items-center justify-center text-sm">
                      {t.customerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{t.customerName}</h4>
                    <p className="text-xs text-slate-400 leading-tight">{t.companyRole || 'Customer'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="text-center pt-8 border-t border-slate-800/80 text-xs text-slate-500">
          Powered by <span className="font-bold text-slate-400">Proofly</span> Social Proof Engine
        </footer>
      </div>
    </div>
  );
};
