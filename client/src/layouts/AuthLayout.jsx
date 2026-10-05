import React from 'react';
import { Outlet } from 'react-router-dom';
import { Code2, Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-6 flex flex-col items-center text-center">
        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 text-white shadow-xl glow-primary mb-3">
          <Code2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">CodeForge</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Learn. Practice. Track Your Progress.
        </p>
      </div>

      <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10 animate-fade-in">
        <Outlet />
      </div>

      <div className="mt-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} CodeForge Platform. All rights reserved.
      </div>
    </div>
  );
};
