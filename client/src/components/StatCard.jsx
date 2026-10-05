import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle, onClick }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400 icon-bg-indigo-500/20',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400 icon-bg-blue-500/20',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400 icon-bg-amber-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400 icon-bg-purple-500/20',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400 icon-bg-cyan-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400 icon-bg-emerald-500/20',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400 icon-bg-rose-500/20',
    slate: 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-300 icon-bg-slate-500/20',
  };

  const currentStyle = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl bg-gradient-to-br border ${currentStyle} ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-current shadow-inner">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
