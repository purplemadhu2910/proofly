import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ExternalLink, Sparkles, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ currentSpace, spaces = [], onSelectSpace }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Space Selector & Quick Links */}
      <div className="flex items-center gap-4">
        {spaces.length > 0 ? (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <span className="text-xs text-slate-400 font-medium">Space:</span>
            <select
              value={currentSpace?.id || ''}
              onChange={(e) => {
                const selected = spaces.find((s) => s.id === e.target.value);
                if (selected && onSelectSpace) onSelectSpace(selected);
              }}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer pr-2"
            >
              {spaces.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.businessName} ({s.slug})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white tracking-tight text-lg">Proofly</span>
          </div>
        )}

        {currentSpace && (
          <a
            href={`/collect/${currentSpace.slug}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
          >
            <span>/collect/{currentSpace.slug}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full coss-gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-xs font-semibold text-white coss-gradient-bg px-3.5 py-1.5 rounded-lg shadow-md hover:opacity-90 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
