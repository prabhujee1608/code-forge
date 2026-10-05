import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Code2,
  HelpCircle,
  BarChart3,
  Bookmark,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  Flame,
  Star,
  Globe,
  Activity,
} from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Performance Tracker', path: '/performance', icon: Activity, badge: 'PRO' },
    { label: 'My Courses', path: '/my-courses', icon: BookOpen },
    { label: 'Explore Courses', path: '/courses', icon: Compass },
    { label: 'Coding Practice', path: '/coding', icon: Code2 },
    { label: 'Platform Ratings', path: '/coding-profiles', icon: Globe },
    { label: 'Quizzes', path: '/quizzes', icon: HelpCircle },
    { label: 'Progress Analytics', path: '/progress', icon: BarChart3 },
    { label: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  ];

  const secondaryNav = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 glass-panel border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* Logo */}
          <div className="p-5 flex items-center gap-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg glow-primary">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1">
                CODEFORGE
              </h1>
              <p className="text-[11px] text-cyan-400 font-semibold">Learn. Practice. Track.</p>
            </div>
          </div>

          {/* User Streak & XP Quick Pill */}
          <div className="mx-4 my-3 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
              <span>{user?.streak?.current || 12}d Streak</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-cyan-400" />
              <span>{user?.points || 1250} XP</span>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="px-3 py-2 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Learning Ecosystem
            </div>
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => isOpen && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            <div className="px-3 pt-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Account
            </div>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => isOpen && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* Admin Panel Link */}
            {isAdmin && (
              <div className="pt-2">
                <NavLink
                  to="/admin"
                  onClick={() => isOpen && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-rose-400 hover:bg-rose-500/10'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Admin / CMS</span>
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-100 truncate">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.role === 'admin' ? 'Admin' : 'Student'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
