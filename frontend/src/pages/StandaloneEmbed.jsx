import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getPublicSpace, getPublicWall } from '../services/api';
import { RatingStars } from '../components/ui/RatingStars';
import { Sparkles, ChevronLeft, ChevronRight, Heart, ArrowUpRight } from 'lucide-react';

export const StandaloneEmbed = () => {
  const { spaceSlug } = useParams();
  const [searchParams] = useSearchParams();
  const layout = searchParams.get('layout') || 'grid';
  const theme = searchParams.get('theme') || 'dark';

  const [space, setSpace] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchEmbedData = async () => {
      setLoading(true);
      try {
        const [spaceRes, wallRes] = await Promise.all([
          getPublicSpace(spaceSlug),
          getPublicWall(spaceSlug)
        ]);
        setSpace(spaceRes.data);
        setTestimonials(wallRes.data);
      } catch (err) {
        console.error("Embed load error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (spaceSlug) fetchEmbedData();
  }, [spaceSlug]);

  if (loading) {
    return (
      <div className={`min-h-full p-4 flex items-center justify-center ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-[#090d16] text-white'}`}>
        <p className="text-xs animate-pulse font-medium">Loading social proof...</p>
      </div>
    );
  }

  if (!space || testimonials.length === 0) {
    return (
      <div className={`p-4 text-center rounded-xl text-xs font-medium ${theme === 'light' ? 'bg-slate-50 text-slate-600' : 'bg-slate-900 text-slate-400'}`}>
        No approved testimonials available yet.
      </div>
    );
  }

  const isLight = theme === 'light';
  const bgClass = isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#090d16] text-white';
  const cardBg = isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900/90 border-slate-800 text-white';
  const subText = isLight ? 'text-slate-500' : 'text-slate-400';

  const averageRating = (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1);

  // Badge Layout
  if (layout === 'badge') {
    return (
      <div className={`p-3 rounded-2xl border flex items-center justify-between gap-4 font-sans ${cardBg}`}>
        <div className="flex items-center gap-3">
          {space.logo ? (
            <img src={space.logo} alt={space.businessName} className="w-10 h-10 rounded-xl object-cover border border-slate-300" />
          ) : (
            <div className="w-10 h-10 rounded-xl coss-gradient-bg text-white font-bold flex items-center justify-center text-sm">
              {space.businessName.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <RatingStars rating={parseFloat(averageRating)} size="sm" />
              <span className="text-xs font-bold">{averageRating}</span>
            </div>
            <p className={`text-[11px] font-medium ${subText}`}>
              Loved by <span className="font-bold">{testimonials.length} customers</span> on Proofly
            </p>
          </div>
        </div>

        <a
          href={`${window.location.origin}/wall/${space.slug}`}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 text-xs font-bold rounded-xl coss-gradient-bg text-white hover:opacity-90 shrink-0 inline-flex items-center gap-1"
        >
          <span>View Wall</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // Carousel Layout
  if (layout === 'carousel') {
    const current = testimonials[activeSlide] || testimonials[0];
    const prevSlide = () => setActiveSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    const nextSlide = () => setActiveSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

    return (
      <div className={`p-6 rounded-2xl border font-sans relative ${cardBg} ${bgClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RatingStars rating={current.rating} size="sm" />
            <span className={`text-xs ${subText}`}>({activeSlide + 1} of {testimonials.length})</span>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={prevSlide} className={`p-1.5 rounded-lg border ${isLight ? 'hover:bg-slate-100 border-slate-200' : 'hover:bg-slate-800 border-slate-700'}`}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextSlide} className={`p-1.5 rounded-lg border ${isLight ? 'hover:bg-slate-100 border-slate-200' : 'hover:bg-slate-800 border-slate-700'}`}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed italic mb-6">
          "{current.reviewText}"
        </p>

        <div className="flex items-center gap-3">
          {current.avatar ? (
            <img src={current.avatar} alt={current.customerName} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
          ) : (
            <div className="w-10 h-10 rounded-full coss-gradient-bg text-white font-bold flex items-center justify-center text-sm">
              {current.customerName.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold leading-tight">{current.customerName}</h4>
            <p className={`text-[11px] ${subText}`}>{current.companyRole || 'Customer'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout (Default)
  return (
    <div className={`p-4 font-sans space-y-4 ${bgClass}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.slice(0, 6).map((t) => (
          <div key={t.id} className={`p-4 rounded-xl border ${cardBg}`}>
            <div className="flex items-center justify-between mb-2">
              <RatingStars rating={t.rating} size="sm" />
              {t.isFeatured && <span className="text-[10px] font-bold text-pink-400">Featured</span>}
            </div>
            <p className="text-xs font-medium leading-relaxed mb-4 italic">
              "{t.reviewText}"
            </p>
            <div className="flex items-center gap-2.5">
              {t.avatar ? (
                <img src={t.avatar} alt={t.customerName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full coss-gradient-bg text-white font-bold flex items-center justify-center text-xs">
                  {t.customerName.charAt(0)}
                </div>
              )}
              <div>
                <h5 className="text-xs font-bold leading-tight">{t.customerName}</h5>
                <p className={`text-[10px] ${subText}`}>{t.companyRole || 'Customer'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
