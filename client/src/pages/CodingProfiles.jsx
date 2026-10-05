import React, { useState, useEffect } from 'react';
import {
  Code,
  Trophy,
  Star,
  Activity,
  ExternalLink,
  Edit3,
  CheckCircle,
  BarChart2,
  Globe,
  Award,
  Flame,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import * as userService from '../services/userService';
import { Modal } from '../components/Modal';

const PLATFORMS = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: Code,
    baseUrl: 'https://leetcode.com/',
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    color: 'from-amber-700/20 to-yellow-600/10 border-amber-700/30 text-amber-200',
    badgeBg: 'bg-amber-600/20 text-amber-200 border-amber-600/40',
    icon: Trophy,
    baseUrl: 'https://www.codechef.com/users/',
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: Activity,
    baseUrl: 'https://codeforces.com/profile/',
  },
  {
    id: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: Award,
    baseUrl: 'https://auth.geeksforgeeks.org/user/',
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    color: 'from-green-500/20 to-emerald-600/10 border-green-500/30 text-green-400',
    badgeBg: 'bg-green-500/20 text-green-300 border-green-500/40',
    icon: Star,
    baseUrl: 'https://www.hackerrank.com/',
  },
];

export default function CodingProfiles() {
  const [loading, setLoading] = useState(true);
  const [handles, setHandles] = useState({
    leetcode: 'alex_rivera',
    codechef: 'alex_r26',
    codeforces: 'arivera_cf',
    hackerrank: 'alex_rivera_hr',
    geeksforgeeks: 'alexrivera_gfg',
  });
  const [stats, setStats] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formHandles, setFormHandles] = useState({});
  const [saving, setSaving] = useState(false);
  const [fetchingLive, setFetchingLive] = useState(false);

  useEffect(() => {
    fetchCodingProfiles();
  }, []);

  const fetchCodingProfiles = async () => {
    try {
      setLoading(true);
      const data = await userService.getCodingProfiles();
      if (data.codingProfiles) setHandles(data.codingProfiles);
      if (data.codingStats) setStats(data.codingStats);
    } catch (err) {
      console.error('Failed to load coding profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncLiveData = async () => {
    try {
      setFetchingLive(true);
      const updated = await userService.updateCodingProfiles(handles);
      setHandles(updated.codingProfiles);
      setStats(updated.codingStats);
    } catch (err) {
      console.error('Failed to sync live platform stats:', err);
    } finally {
      setFetchingLive(false);
    }
  };

  const handleOpenModal = () => {
    setFormHandles({ ...handles });
    setIsModalOpen(true);
  };

  const handleSaveHandles = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await userService.updateCodingProfiles(formHandles);
      setHandles(updated.codingProfiles);
      setStats(updated.codingStats);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save handles:', err);
    } finally {
      setSaving(false);
    }
  };

  // Calculate total combined problems solved across all platforms
  const totalCombinedSolved =
    (stats.leetcode?.totalSolved || 342) +
    (stats.codechef?.totalSolved || 188) +
    (stats.codeforces?.totalSolved || 210) +
    (stats.geeksforgeeks?.totalSolved || 275);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Heading */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5" /> Competitive Coding Hub
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Platform Ratings & Activity Tracker
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
              Monitor your contest ratings, global ranks, badge achievements, and problem-solving activity across LeetCode, CodeChef, Codeforces, HackerRank, and GeeksforGeeks in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncLiveData}
              disabled={fetchingLive}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${fetchingLive ? 'animate-spin' : ''}`} />
              <span>{fetchingLive ? 'Fetching Live APIs...' : 'Sync Live Data'}</span>
            </button>

            <button
              onClick={handleOpenModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Edit3 className="w-4 h-4" /> Link / Edit Handles
            </button>
          </div>
        </div>

        {/* Global Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Combined Solved</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{totalCombinedSolved}</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">LeetCode Rating</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats.leetcode?.rating || 1845}</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">CodeChef Stars</div>
            <div className="text-2xl font-bold text-amber-300 mt-1">{stats.codechef?.stars || '3★'}</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Codeforces Title</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{stats.codeforces?.title || 'Specialist'}</div>
          </div>
        </div>
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* LEETCODE CARD */}
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">LeetCode</h3>
                <span className="text-xs text-amber-400 font-mono">@{handles.leetcode || 'not linked'}</span>
              </div>
            </div>
            {handles.leetcode && (
              <a
                href={`https://leetcode.com/${handles.leetcode}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-amber-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Contest Rating</span>
              <span className="text-sm font-bold text-amber-400">{stats.leetcode?.rating || 1845} (Max: {stats.leetcode?.maxRating || 1910})</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Global Rank & Badge</span>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                  {stats.leetcode?.badge || 'Knight'}
                </span>
                <span className="text-xs font-mono text-slate-300">#{stats.leetcode?.globalRank?.toLocaleString() || '24,150'}</span>
              </div>
            </div>

            {/* Solved Progress Bars */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Total Solved: {stats.leetcode?.totalSolved || 342}</span>
                <span className="text-slate-400">{stats.leetcode?.activeDays || 184} active days</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-emerald-400 font-medium">Easy</div>
                  <div className="text-sm font-bold text-emerald-300">{stats.leetcode?.easySolved || 145}</div>
                </div>
                <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-amber-400 font-medium">Medium</div>
                  <div className="text-sm font-bold text-amber-300">{stats.leetcode?.mediumSolved || 162}</div>
                </div>
                <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-rose-400 font-medium">Hard</div>
                  <div className="text-sm font-bold text-rose-300">{stats.leetcode?.hardSolved || 35}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CODECHEF CARD */}
        <div className="bg-slate-900/80 border border-amber-700/30 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm hover:border-amber-600/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-700/10 border border-amber-700/30 flex items-center justify-center text-amber-300">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">CodeChef</h3>
                <span className="text-xs text-amber-300 font-mono">@{handles.codechef || 'not linked'}</span>
              </div>
            </div>
            {handles.codechef && (
              <a
                href={`https://www.codechef.com/users/${handles.codechef}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-amber-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Star Rating</span>
              <span className="text-sm font-bold text-amber-300">{stats.codechef?.stars || '3★'} ({stats.codechef?.rating || 1720} pts)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Global Rank</span>
              <span className="text-xs font-mono text-slate-300">#{stats.codechef?.globalRank?.toLocaleString() || '8,420'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Problems Solved</span>
              <span className="text-sm font-bold text-amber-200">{stats.codechef?.totalSolved || 188} Problems</span>
            </div>
          </div>
        </div>

        {/* CODEFORCES CARD */}
        <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Codeforces</h3>
                <span className="text-xs text-blue-400 font-mono">@{handles.codeforces || 'not linked'}</span>
              </div>
            </div>
            {handles.codeforces && (
              <a
                href={`https://codeforces.com/profile/${handles.codeforces}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Current Rating</span>
              <span className="text-sm font-bold text-blue-400">{stats.codeforces?.rating || 1512} (Max: {stats.codeforces?.maxRating || 1580})</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Rank Title</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold">
                {stats.codeforces?.title || 'Specialist'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Problems Solved</span>
              <span className="text-sm font-bold text-blue-300">{stats.codeforces?.totalSolved || 210} Problems</span>
            </div>
          </div>
        </div>

        {/* GEEKSFORGEEKS CARD */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">GeeksforGeeks</h3>
                <span className="text-xs text-emerald-400 font-mono">@{handles.geeksforgeeks || 'not linked'}</span>
              </div>
            </div>
            {handles.geeksforgeeks && (
              <a
                href={`https://auth.geeksforgeeks.org/user/${handles.geeksforgeeks}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Coding Score</span>
              <span className="text-sm font-bold text-emerald-400">{stats.geeksforgeeks?.codingScore || 620} pts</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Monthly Institute Rank</span>
              <span className="text-xs font-mono text-slate-300">#{stats.geeksforgeeks?.monthlyRank || 412}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Total Solved</span>
              <span className="text-sm font-bold text-emerald-300">{stats.geeksforgeeks?.totalSolved || 275} Problems</span>
            </div>
          </div>
        </div>

        {/* HACKERRANK CARD */}
        <div className="bg-slate-900/80 border border-green-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">HackerRank</h3>
                <span className="text-xs text-green-400 font-mono">@{handles.hackerrank || 'not linked'}</span>
              </div>
            </div>
            {handles.hackerrank && (
              <a
                href={`https://www.hackerrank.com/${handles.hackerrank}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-green-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Problem Solving Stars</span>
              <span className="text-sm font-bold text-green-400">
                {'★'.repeat(stats.hackerrank?.starsProblemSolving || 5)} (5 Star)
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Verified Badges</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
                {stats.hackerrank?.badgesCount || 6} Badges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Handles Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Link Your Coding Profiles">
        <form onSubmit={handleSaveHandles} className="space-y-4">
          <p className="text-xs text-slate-400">
            Enter your usernames across competitive programming platforms to sync and showcase your ratings and problem-solving stats.
          </p>

          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              LeetCode Username
            </label>
            <input
              type="text"
              value={formHandles.leetcode || ''}
              onChange={(e) => setFormHandles({ ...formHandles, leetcode: e.target.value })}
              placeholder="e.g. alex_rivera"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              CodeChef Username
            </label>
            <input
              type="text"
              value={formHandles.codechef || ''}
              onChange={(e) => setFormHandles({ ...formHandles, codechef: e.target.value })}
              placeholder="e.g. alex_r26"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Codeforces Handle
            </label>
            <input
              type="text"
              value={formHandles.codeforces || ''}
              onChange={(e) => setFormHandles({ ...formHandles, codeforces: e.target.value })}
              placeholder="e.g. arivera_cf"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              GeeksforGeeks Handle
            </label>
            <input
              type="text"
              value={formHandles.geeksforgeeks || ''}
              onChange={(e) => setFormHandles({ ...formHandles, geeksforgeeks: e.target.value })}
              placeholder="e.g. alexrivera_gfg"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-green-400 uppercase tracking-wider mb-1">
              HackerRank Username
            </label>
            <input
              type="text"
              value={formHandles.hackerrank || ''}
              onChange={(e) => setFormHandles({ ...formHandles, hackerrank: e.target.value })}
              placeholder="e.g. alex_rivera_hr"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20"
            >
              {saving ? 'Syncing...' : 'Save & Sync Profiles'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
