import React, { useState, useEffect } from 'react';
import * as progressService from '../services/progressService';
import { useToast } from '../hooks/useToast';
import { Map, CheckCircle2, Circle, TrendingUp, Sparkles, BookOpen } from 'lucide-react';

export const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const data = await progressService.getRoadmap();
      setRoadmap(data);
    } catch (err) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleTogglePhase = async (phaseNumber, currentCompleted) => {
    try {
      await progressService.updateRoadmapPhase({
        phaseNumber,
        completed: !currentCompleted,
      });
      toast.success(`Phase ${phaseNumber} status updated!`);
      fetchRoadmap();
    } catch (err) {
      toast.error('Failed to update phase status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading Job Preparation Roadmap...</p>
      </div>
    );
  }

  const phases = roadmap?.phases || [];
  const completedCount = phases.filter((p) => p.completed).length;
  const progressPercent = Math.round((completedCount / (phases.length || 1)) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {roadmap?.role || 'Full Stack Developer'} Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            10-Phase structured preparation path from fundamentals to placement offer
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold text-slate-400">Roadmap Progress:</span>
          <span className="text-lg font-extrabold text-cyan-400">{progressPercent}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Roadmap Phase Timeline */}
      <div className="space-y-4">
        {phases.map((phase) => (
          <div
            key={phase.phaseNumber}
            className={`glass-card p-6 rounded-3xl border transition-all ${
              phase.completed
                ? 'border-emerald-500/30 bg-emerald-950/10'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleTogglePhase(phase.phaseNumber, phase.completed)}
                  className="mt-1"
                >
                  {phase.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400 shrink-0 transition-colors" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                      Phase {phase.phaseNumber}
                    </span>
                    <h3 className="font-bold text-lg text-white">{phase.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{phase.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {phase.topics?.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium"
                      >
                        ✓ {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTogglePhase(phase.phaseNumber, phase.completed)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  phase.completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {phase.completed ? 'Completed' : 'Mark Completed'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
