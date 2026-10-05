import React, { useState, useEffect } from 'react';
import * as aptitudeService from '../services/aptitudeService';
import { useToast } from '../hooks/useToast';
import {
  Calculator,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Play,
  RotateCcw,
  Award,
} from 'lucide-react';

const CATEGORIES = [
  'Quantitative Aptitude',
  'Logical Reasoning',
  'Verbal Ability',
  'Data Interpretation',
];

export const AptitudePrep = () => {
  const [selectedCategory, setSelectedCategory] = useState('Quantitative Aptitude');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({}); // { qId: optionIndex }
  const [submittedResult, setSubmittedResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await aptitudeService.getAptitudeQuestions({ category: selectedCategory });
      setQuestions(data);
      setUserAnswers({});
      setSubmittedResult(null);
    } catch (err) {
      toast.error('Failed to load aptitude questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const hist = await aptitudeService.getAptitudeHistory();
      setHistory(hist);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchHistory();
  }, [selectedCategory]);

  const handleSelectOption = (qId, optionIdx) => {
    if (submittedResult) return; // Locked after submission
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitTest = async () => {
    if (Object.keys(userAnswers).length === 0) {
      toast.error('Please answer at least one question before submitting!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await aptitudeService.submitAptitudeAttempt({
        category: selectedCategory,
        userAnswers,
      });
      setSubmittedResult(res);
      toast.success(`Test Completed! Accuracy: ${res.summary.accuracy}%`);
      fetchHistory();
    } catch (err) {
      toast.error('Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Aptitude & MCQ Practice</h1>
          <p className="text-xs text-slate-400 mt-1">
            Quantitative, Logical Reasoning, and Verbal practice for campus placement screening tests
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Split: Test Area vs Attempt History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Test Questions Area */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Loading aptitude questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
              <Calculator className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Aptitude Questions Available</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Select another category or check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Test Header Result Banner */}
              {submittedResult && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Test Completed! 🎉</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Score: <span className="font-bold text-amber-400">{submittedResult.summary.score} Pts</span> | Correct: {submittedResult.summary.correctCount} / {submittedResult.summary.totalQuestions}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">
                      {submittedResult.summary.accuracy}%
                    </span>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">Accuracy Rate</p>
                  </div>
                </div>
              )}

              {/* Questions List */}
              {questions.map((q, qIdx) => {
                const selected = userAnswers[q._id];
                const resItem = submittedResult?.results?.find((r) => r.questionId === q._id);

                return (
                  <div
                    key={q._id}
                    className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Question {qIdx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{q.topic}</span>
                    </div>

                    <h3 className="font-bold text-base text-white">{q.question}</h3>

                    {/* MCQ Options */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        let optStyle = 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800';

                        if (submittedResult && resItem) {
                          if (optIdx === resItem.correctIndex) {
                            optStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-bold';
                          } else if (optIdx === selected && !resItem.isCorrect) {
                            optStyle = 'bg-rose-950/60 border-rose-500/60 text-rose-300 font-bold';
                          }
                        } else if (selected === optIdx) {
                          optStyle = 'bg-amber-600/20 border-amber-500/50 text-amber-300 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q._id, optIdx)}
                            className={`w-full p-3.5 rounded-2xl border text-xs text-left transition-all flex items-center justify-between ${optStyle}`}
                          >
                            <span>
                              <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                            </span>
                            {submittedResult && optIdx === resItem?.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission */}
                    {submittedResult && resItem && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-300">
                        <span className="font-bold text-amber-400 uppercase tracking-wider block">
                          Explanation:
                        </span>
                        <p>{q.explanation || 'Option ' + String.fromCharCode(65 + resItem.correctIndex) + ' is the correct answer.'}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit / Reset Button */}
              <div className="flex justify-end pt-2">
                {!submittedResult ? (
                  <button
                    onClick={handleSubmitTest}
                    disabled={submitting}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Submit Aptitude Test'}
                  </button>
                ) : (
                  <button
                    onClick={fetchQuestions}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> Retake Test
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Attempt History */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Recent Test History
          </h3>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No aptitude tests taken yet.</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {history.map((h) => (
                <div
                  key={h._id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{h.category}</span>
                    <span className="font-bold text-amber-400">{h.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Correct: {h.correctAnswers} / {h.totalQuestions}</span>
                    <span>Score: {h.score} Pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
