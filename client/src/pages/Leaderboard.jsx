import React, { useState, useEffect } from 'react';
import * as progressService from '../services/progressService';
import * as userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Award, Flame, Coins, Shield, Info, CheckCircle2 } from 'lucide-react';

export const Leaderboard = () => {
  const { user, updateUserLocal } = useAuth();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(user?.isLeaderboardPublic ?? true);

  const toast = useToast();

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await progressService.getLeaderboard();
      setRankings(data);
    } catch (err) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleToggleVisibility = async () => {
    try {
      const updated = await userService.updateProfile({ isLeaderboardPublic: !isPublic });
      setIsPublic(!isPublic);
      updateUserLocal(updated);
      toast.success(
        !isPublic ? 'You are now visible on the public leaderboard!' : 'Opted out of public leaderboard.'
      );
      fetchLeaderboard();
    } catch (err) {
      toast.error('Failed to update visibility settings');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Leaderboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Peer rankings based on platform coding practice points, streak, and solved problems
          </p>
        </div>

        {/* Opt-out Toggle */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
          <span className="text-xs font-semibold text-slate-300">Public Visibility:</span>
          <button
            onClick={handleToggleVisibility}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              isPublic
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isPublic ? 'Public' : 'Hidden (Private)'}
          </button>
        </div>
      </div>

      {/* Activity Disclaimer */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs text-indigo-200">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-indigo-300">Platform Activity Disclaimer</h4>
          <p className="mt-0.5 text-slate-300 leading-relaxed">
            Leaderboard points and rankings represent practice activity on CodeCareer and do not predict coding ability, interview outcomes, or job eligibility.
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading leaderboard rankings...</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Rank</th>
                  <th className="px-5 py-3.5 font-semibold">Student</th>
                  <th className="px-5 py-3.5 font-semibold">College / Role</th>
                  <th className="px-5 py-3.5 font-semibold">Streak</th>
                  <th className="px-5 py-3.5 font-semibold">Problems Solved</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Practice Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rankings.map((r) => {
                  const isMe = r.id === user?._id;

                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors ${
                        isMe
                          ? 'bg-indigo-600/20 font-semibold text-indigo-200 border-indigo-500/40'
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <td className="px-5 py-4 font-black">
                        {r.rank === 1 ? (
                          <span className="text-amber-400">🥇 1</span>
                        ) : r.rank === 2 ? (
                          <span className="text-slate-300">🥈 2</span>
                        ) : r.rank === 3 ? (
                          <span className="text-amber-600">🥉 3</span>
                        ) : (
                          `#${r.rank}`
                        )}
                      </td>

                      <td className="px-5 py-4 font-bold text-white flex items-center gap-2">
                        <span>{r.name}</span>
                        {isMe && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            You
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-400">
                        <div className="text-slate-200">{r.college}</div>
                        <div className="text-[11px] text-cyan-400">{r.preferredRole}</div>
                      </td>

                      <td className="px-5 py-4 text-xs font-bold text-amber-400">
                        🔥 {r.streak}d
                      </td>

                      <td className="px-5 py-4 text-xs font-bold text-slate-200">
                        {r.solvedCount} Solved
                      </td>

                      <td className="px-5 py-4 text-right text-xs font-black text-indigo-400">
                        🪙 {r.points} Pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
