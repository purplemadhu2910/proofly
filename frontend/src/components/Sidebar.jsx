import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareQuote,
  Boxes,
  HeartHandshake,
  Code2,
  BarChart3,
  Settings,
  Sparkles,
  PlusCircle
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Testimonials', path: '/dashboard/testimonials', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { label: 'Spaces', path: '/dashboard/spaces', icon: <Boxes className="w-4 h-4" /> },
    { label: 'Wall of Love', path: '/dashboard/wall', icon: <HeartHandshake className="w-4 h-4" /> },
    { label: 'Embed Generator', path: '/dashboard/embed', icon: <Code2 className="w-4 h-4" /> },
    { label: 'Analytics', path: '/dashboard/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Settings', path: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl coss-gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight leading-none">Proofly</h1>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Social Proof Suite</span>
          </div>
        </div>

        {/* Quick Create Action */}
        <Link
          to="/dashboard/spaces/new"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl coss-gradient-bg text-white font-semibold text-xs shadow-md hover:opacity-90 transition-all group"
        >
          <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Create New Space</span>
        </Link>

        {/* Main Navigation */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 text-center">
        <p className="text-xs font-bold text-indigo-300">Need Integration Help?</p>
        <p className="text-[11px] text-slate-400 mt-1">Copy collection & embed widgets in 1-click.</p>
      </div>
    </aside>
  );
};
