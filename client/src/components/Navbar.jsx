import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, Flame, Coins, Code2, User } from 'lucide-react';

export const Navbar = ({ toggleSidebar, title = 'Job Readiness' }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            Target Role: <span className="text-cyan-400 font-semibold">{user?.preferredRole || 'Software Engineer'}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{user?.streak?.current || 12}d Streak</span>
        </div>

        {/* Points Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
          <Coins className="w-4 h-4 text-indigo-400" />
          <span>{user?.points || 150} Pts</span>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* User Profile Avatar Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-cyan-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <span className="text-xs font-semibold text-slate-200 hidden md:inline">
            {user?.name || 'Student'}
          </span>
        </Link>
      </div>
    </header>
  );
};
