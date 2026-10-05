import React, { useState, useEffect } from 'react';
import * as progressService from '../services/progressService';
import { useToast } from '../hooks/useToast';
import { FileText, Plus, Trash2, Edit2 } from 'lucide-react';

export const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [itemType, setItemType] = useState('General');

  const toast = useToast();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await progressService.getNotes();
      setNotes(data);
    } catch (err) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await progressService.createNote({ title, content, itemType });
      toast.success('Note saved!');
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (err) {
      toast.error('Failed to save note');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await progressService.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note deleted');
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Personal Notes</h1>
        <p className="text-xs text-slate-400 mt-1">
          Keep track of lower_bound tips, DSA algorithmic intuition & interview cheat sheets
        </p>
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleCreateNote} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title (e.g. Binary Search Edge Cases)"
              className="w-full px-4 py-2 rounded-xl glass-input text-xs sm:text-sm"
            />
          </div>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs bg-slate-900"
          >
            <option value="General">General Note</option>
            <option value="CodingProblem">Coding Tip</option>
            <option value="InterviewQuestion">Interview Cheat Sheet</option>
            <option value="DSATopic">DSA Summary</option>
          </select>
        </div>

        <textarea
          rows="3"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your study notes or code snippet hints..."
          className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Save Note
          </button>
        </div>
      </form>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Notes Saved</h3>
          <p className="text-xs text-slate-400 mt-1">
            Create personal study notes to review algorithms and interview concepts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((n) => (
            <div
              key={n._id}
              className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono">
                    {n.itemType}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(n._id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-white">{n.title}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">
                  {n.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                Created: {new Date(n.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
