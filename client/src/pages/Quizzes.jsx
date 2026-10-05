import React, { useState, useEffect } from 'react';
import { HelpCircle, Star, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import * as quizService from '../services/quizService';
import { useToast } from '../hooks/useToast';

export function Quizzes() {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizById('general');
      setQuiz(data);
    } catch (err) {
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx, oIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    let correct = 0;
    const formattedAnswers = quiz.questions.map((q, idx) => {
      const selected = answers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correct++;
      return { questionIndex: idx, selected, isCorrect };
    });

    try {
      const res = await quizService.submitQuizAttempt(quiz._id || 'general', {
        quizTitle: quiz.title,
        answers: formattedAnswers,
      });

      setResult(res);
      setSubmitted(true);
      toast.success(`Quiz Completed! Score: ${res.score}/${res.totalQuestions} (+${res.xpGained} XP)`);
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading quiz assessment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> QUIZ & KNOWLEDGE EVALUATION
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Course Quizzes & Assessments
          </h1>
          <p className="mt-2 text-slate-400 max-w-xl text-sm sm:text-base">
            Test your understanding of full-stack engineering, React hooks, database fundamentals, and computer science concepts.
          </p>
        </div>
      </div>

      {quiz && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> {quiz.title}
          </h2>

          <div className="space-y-6">
            {quiz.questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-white">
                  {qIdx + 1}. {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[qIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(qIdx, oIdx)}
                        disabled={submitted}
                        className={`p-3.5 rounded-xl text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {!submitted ? (
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-amber-500/20 transition-all"
              >
                Submit Quiz Answers
              </button>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Quiz Evaluation Completed</h3>
                <p className="text-xs text-emerald-300">
                  You scored {result?.score} / {result?.totalQuestions} ({result?.percentage}%)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
