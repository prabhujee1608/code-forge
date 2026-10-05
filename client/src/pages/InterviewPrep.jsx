import React, { useState, useEffect } from 'react';
import * as interviewService from '../services/interviewService';
import { useToast } from '../hooks/useToast';
import {
  MessageSquareCode,
  Search,
  BookOpen,
  Edit2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const TECHNICAL_TOPICS = [
  'All Technical Topics',
  'OOP',
  'DBMS',
  'OS',
  'Networks',
  'SQL',
  'DSA',
  'JavaScript',
  'React',
  'Node.js',
  'CS Fundamentals',
];

export const InterviewPrep = () => {
  const [category, setCategory] = useState('Technical'); // 'Technical' or 'HR'
  const [selectedTopic, setSelectedTopic] = useState('All Technical Topics');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [editingAnswers, setEditingAnswers] = useState({}); // { qId: text }

  const toast = useToast();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await interviewService.getInterviewQuestions({
        category: category === 'Technical' ? 'Technical' : 'HR',
        topic: category === 'Technical' && selectedTopic !== 'All Technical Topics' ? selectedTopic : '',
      });
      setQuestions(data);

      // Populate editingAnswers state
      const initialAnswers = {};
      data.forEach((q) => {
        initialAnswers[q._id] = q.customAnswer || '';
      });
      setEditingAnswers(initialAnswers);
    } catch (err) {
      toast.error('Failed to load interview questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, selectedTopic]);

  const handleSaveAnswer = async (id, status) => {
    try {
      const customAnswer = editingAnswers[id] || '';
      await interviewService.saveUserAnswer(id, { customAnswer, status });
      toast.success('Your answer & status updated!');
      fetchQuestions();
    } catch (err) {
      toast.error('Failed to save answer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interview Preparation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Master Technical CS Fundamentals & HR Behavioral Interview Questions
          </p>
        </div>

        {/* Category Toggle Tabs */}
        <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
          <button
            onClick={() => {
              setCategory('Technical');
              setSelectedTopic('All Technical Topics');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              category === 'Technical'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Technical Interviews
          </button>
          <button
            onClick={() => setCategory('HR')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              category === 'HR'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HR & Behavioral
          </button>
        </div>
      </div>

      {/* Topic Filters for Technical */}
      {category === 'Technical' && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TECHNICAL_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTopic === topic
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <MessageSquareCode className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Questions Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try selecting a different topic or category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const isExpanded = expandedId === q._id;

            return (
              <div
                key={q._id}
                className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                        {q.topic}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-white">{q.question}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={q.status}
                      onChange={(e) => handleSaveAnswer(q._id, e.target.value)}
                      className="text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Learning">Learning</option>
                      <option value="Practicing">Practicing</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q._id)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Important Concepts tags */}
                {q.importantConcepts && q.importantConcepts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {q.importantConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-900 text-[11px] text-slate-400 border border-slate-800 font-mono"
                      >
                        #{concept}
                      </span>
                    ))}
                  </div>
                )}

                {/* Collapsible Answer & Student Practice Notes */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-800 space-y-4 animate-fade-in">
                    {/* Model Answer */}
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-300">
                      <span className="font-bold text-cyan-400 uppercase tracking-wider block">
                        Model Explanation / Key Answer:
                      </span>
                      <p className="leading-relaxed whitespace-pre-wrap">{q.answer}</p>
                    </div>

                    {/* Student Custom Answer Editor */}
                    <div className="space-y-2">
                      <span className="font-bold text-xs text-indigo-400 uppercase tracking-wider block">
                        Your Tailored Response / Personal Notes:
                      </span>
                      <textarea
                        rows="3"
                        value={editingAnswers[q._id] || ''}
                        onChange={(e) =>
                          setEditingAnswers((prev) => ({ ...prev, [q._id]: e.target.value }))
                        }
                        placeholder="Draft your response using the STAR method or custom project examples..."
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSaveAnswer(q._id, q.status)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
                        >
                          Save My Answer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
