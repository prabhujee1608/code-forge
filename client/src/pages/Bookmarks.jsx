import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, BookOpen, Code2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookmarks');
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (b) => {
    try {
      await api.post('/bookmarks', { itemType: b.itemType, itemId: b.itemId });
      setBookmarks((prev) => prev.filter((x) => x._id !== b._id));
      toast.success('Bookmark removed');
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Bookmark className="w-3.5 h-3.5" /> SAVED CONTENT
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            My Bookmarks & Saved Content
          </h1>
          <p className="mt-2 text-slate-400 max-w-xl text-sm sm:text-base">
            Quickly reference saved lessons, code snippets, and course modules.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading bookmarks...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-slate-400">Bookmark lessons or coding problems while learning to access them here anytime.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((b) => (
            <div
              key={b._id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between hover:border-cyan-500/40 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  {b.itemType} • {b.category}
                </span>
                <h3 className="text-base font-bold text-white">{b.title}</h3>
              </div>

              <button
                onClick={() => handleRemove(b)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
