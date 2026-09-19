import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquareQuote, Heart, ShieldCheck, ArrowRight, Star, Code, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl coss-gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">Proofly</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>The Ultimate Social Proof Collector for SaaS & Brands</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Collect Testimonials & Show Your <span className="coss-gradient-text">Wall of Love</span> in Minutes
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Create custom feedback links like <code className="text-indigo-400 bg-slate-900 px-2 py-1 rounded-md text-sm border border-slate-800">/collect/instagram</code>. Customers submit ratings and reviews without creating an account. Moderate, feature, and embed anywhere.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
              <span>Start Collecting Free</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/collect/instagram" target="_blank" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
              <span>Try Public Collection Demo</span>
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> No customer signup required</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> 1-Click Embed Snippets</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> Python FastAPI + MongoDB</span>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="coss-glass-card p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Custom Collection Pages</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Get unique shareable URLs for every product. Add custom review questions, ratings, avatars, and custom prompts.
          </p>
        </div>

        <div className="coss-glass-card p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Smart Moderation Suite</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Approve, reject, archive, feature, or like reviews. Search by name or email and filter by star rating.
          </p>
        </div>

        <div className="coss-glass-card p-8 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Wall of Love & Embeds</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Showcase approved feedback on your public Wall of Love page or embed customizable grid, carousel, and badge widgets.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 Proofly — Testimonial & Social Proof Collector. Built with Python FastAPI, MongoDB, & Coss UI React.</p>
      </footer>
    </div>
  );
};
