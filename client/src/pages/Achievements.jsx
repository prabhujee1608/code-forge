import React, { useState, useEffect } from 'react';
import * as progressService from '../services/progressService';
import { useToast } from '../hooks/useToast';
import { Trophy, Award, Flame, Sparkles, Brain, Target, CheckCircle2 } from 'lucide-react';

export const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const data = await progressService.getAchievements();
        setAchievements(data);
      } catch (err) {
        toast.error('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading achievements...</p>
      </div>
    );
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gamification & Badges</h1>
          <p className="text-xs text-slate-400 mt-1">
            Unlock preparation milestones as you practice coding, aptitude, and technical interviews
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-400">Badges Unlocked:</span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            🏆 {unlockedCount} / {achievements.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((badge) => (
          <div
            key={badge.badgeId}
            className={`glass-card p-6 rounded-3xl border space-y-4 flex flex-col justify-between transition-all ${
              badge.unlocked
                ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/20 to-slate-900 glow-amber'
                : 'border-slate-800 opacity-60 grayscale'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div
                  className={`p-3.5 rounded-2xl border ${
                    badge.unlocked
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                >
                  <Trophy className="w-7 h-7" />
                </div>
                {badge.unlocked && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Unlocked
                  </span>
                )}
              </div>

              <h3 className="font-bold text-lg text-white mt-4">{badge.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
              {badge.unlocked ? `Earned on ${new Date(badge.unlockedAt).toLocaleDateString()}` : 'Locked Milestone'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
