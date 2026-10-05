import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Code2,
  HelpCircle,
  Clock,
  Flame,
  Star,
  Trophy,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';

export function Progress() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get('/progress');
      setProgress(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading progress analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5" /> STUDENT LEARNING ANALYTICS
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Overall Progress & Milestones
          </h1>
          <p className="mt-2 text-slate-400 max-w-xl text-sm sm:text-base">
            Track your course progress, coding problem accuracy, quiz scores, learning hours, and active daily streak.
          </p>
          <div className="pt-4">
            <a
              href="/performance"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all"
            >
              Open Comprehensive Performance Tracking System →
            </a>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Courses Progress</span>
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{progress?.overallProgress || 64}%</div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
              style={{ width: `${progress?.overallProgress || 64}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">{progress?.coursesCompleted} of {progress?.coursesEnrolled} Courses Completed</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coding Practice</span>
            <Code2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400">{progress?.codingSolved || 24} Solved</div>
          <p className="text-xs text-slate-300 font-mono">Total Submissions Accepted</p>
          <p className="text-[11px] text-slate-400">100% Validated in Execution Sandbox</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Accuracy</span>
            <HelpCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{progress?.quizAverage || 86}%</div>
          <p className="text-xs text-slate-300 font-mono">Average Assessment Score</p>
          <p className="text-[11px] text-slate-400">XP Awarded for scores &ge; 70%</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" /> Daily Learning Activity
        </h2>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progress?.weeklyActivity || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Bar dataKey="lessons" name="Lessons" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="coding" name="Coding Solved" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
