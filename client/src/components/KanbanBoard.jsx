import React from 'react';
import { Badge } from './Badge';
import { formatDate } from '../utils/formatters';
import { ExternalLink, Calendar, MapPin, Building2, MoreHorizontal, ArrowRightLeft } from 'lucide-react';

const COLUMNS = [
  { id: 'Saved', title: 'Saved', color: 'border-slate-500/40 text-slate-400 bg-slate-500/5' },
  { id: 'Applied', title: 'Applied', color: 'border-blue-500/40 text-blue-400 bg-blue-500/5' },
  { id: 'Under Review', title: 'Under Review', color: 'border-amber-500/40 text-amber-400 bg-amber-500/5' },
  { id: 'Shortlisted', title: 'Shortlisted', color: 'border-purple-500/40 text-purple-400 bg-purple-500/5' },
  { id: 'Interview', title: 'Interview', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/5' },
  { id: 'Offer', title: 'Offer Received', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' },
  { id: 'Rejected', title: 'Rejected', color: 'border-rose-500/40 text-rose-400 bg-rose-500/5' },
];

export const KanbanBoard = ({ applications, onStatusChange, onViewDetails }) => {
  const handleDragStart = (e, appId) => {
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('text/plain');
    if (appId) {
      onStatusChange(appId, targetStatus);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
      {COLUMNS.map((col) => {
        const colApps = applications.filter((app) => app.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`min-w-[280px] max-w-[310px] w-full flex-1 rounded-2xl glass-panel p-4 flex flex-col border ${col.color} snap-start`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-slate-200">{col.title}</h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
                  {colApps.length}
                </span>
              </div>
            </div>

            {/* Application Cards Container */}
            <div className="flex-1 space-y-3 overflow-y-auto min-h-[400px] max-h-[680px] pr-1">
              {colApps.length === 0 ? (
                <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500 font-medium">
                  No applications
                </div>
              ) : (
                colApps.map((app) => (
                  <div
                    key={app._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app._id)}
                    className="glass-card p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-grab active:cursor-grabbing transition-all group relative bg-slate-900/80"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="grow cursor-pointer" onClick={() => onViewDetails(app._id)}>
                        <h5 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {app.position}
                        </h5>
                        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {app.company}
                        </p>
                      </div>

                      <select
                        value={app.status}
                        onChange={(e) => onStatusChange(app._id, e.target.value)}
                        className="text-[11px] bg-slate-800 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0"
                        title="Move to status"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge text={app.type} type="jobType" />
                      <Badge text={app.workMode} type="workMode" />
                    </div>

                    {app.requiredSkills && app.requiredSkills.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {app.requiredSkills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                        {app.requiredSkills.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-mono self-center">
                            +{app.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formatDate(app.applicationDate)}
                      </span>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-400 transition-colors p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
