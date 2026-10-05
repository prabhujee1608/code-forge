import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  HelpCircle,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Flame,
  Star,
} from 'lucide-react';
import * as courseService from '../services/courseService';
import * as quizService from '../services/quizService';
import { useToast } from '../hooks/useToast';

export function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    fetchLessonData();
  }, [courseId, lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      setQuizSubmitted(false);
      setQuizAnswers({});
      const res = await courseService.getLessonById(courseId, lessonId);
      setData(res);

      if (res.lesson?.quiz && res.lesson.quiz.questions?.length > 0) {
        setActiveQuiz(res.lesson.quiz);
      } else {
        setActiveQuiz(null);
      }
    } catch (err) {
      toast.error('Failed to load lesson content');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    try {
      setCompleting(true);
      const res = await courseService.completeLesson(lessonId, courseId);
      toast.success(`Lesson Completed! +${res.xpGained} XP Gained 🔥`);
      setData((prev) => ({ ...prev, isCompleted: true }));

      if (data?.nextLessonId) {
        navigate(`/courses/${courseId}/lessons/${data.nextLessonId}`);
      }
    } catch (err) {
      toast.error('Failed to complete lesson');
    } finally {
      setCompleting(false);
    }
  };

  const handleOptionSelect = (qIdx, oIdx) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleQuizSubmit = async () => {
    if (!activeQuiz) return;

    let correct = 0;
    const formattedAnswers = activeQuiz.questions.map((q, idx) => {
      const selected = quizAnswers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correct++;
      return { questionIndex: idx, selected, isCorrect };
    });

    try {
      const res = await quizService.submitQuizAttempt(lessonId, {
        quizTitle: activeQuiz.title || 'Lesson Quiz',
        answers: formattedAnswers,
        courseId,
      });

      setQuizScore(res);
      setQuizSubmitted(true);
      toast.success(`Quiz Submitted! Score: ${res.score}/${res.totalQuestions} (+${res.xpGained} XP)`);
    } catch (err) {
      toast.error('Quiz submission failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading lesson workspace...</p>
      </div>
    );
  }

  if (!data || !data.lesson) return null;

  const { lesson, course, isCompleted, prevLessonId, nextLessonId, currentLessonNumber, totalLessons } = data;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {course.title}
        </button>

        <div className="text-xs text-slate-400 font-mono">
          Lesson <span className="text-cyan-400 font-bold">{currentLessonNumber}</span> of {totalLessons}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
              {data.module?.title || 'Lesson Module'}
            </span>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{lesson.title}</h1>
            <p className="text-xs text-slate-400 mt-1">{lesson.description}</p>
          </div>

          {isCompleted && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-4 h-4" /> Lesson Completed
            </div>
          )}
        </div>

        {/* Video Player if Available */}
        {lesson.videoUrl && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {/* Markdown & Text Content */}
        <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 whitespace-pre-wrap font-sans">
            {lesson.content}
          </div>
        </div>

        {/* Lesson Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson Attachments & Links</span>
            <div className="flex flex-wrap gap-3">
              {lesson.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 hover:text-white hover:border-cyan-500 transition-all font-mono"
                >
                  📄 {res.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {activeQuiz && (
          <div className="mt-8 border-t border-slate-800/80 pt-6 space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">{activeQuiz.title || 'Lesson Assessment Quiz'}</h2>
            </div>

            <div className="space-y-6">
              {activeQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white">
                    {qIdx + 1}. {q.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = quizAnswers[qIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(qIdx, oIdx)}
                          disabled={quizSubmitted}
                          className={`p-3 rounded-xl text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                              : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  ✓ Quiz Completed! Score: {quizScore?.score} / {quizScore?.totalQuestions} ({quizScore?.percentage}%)
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Lesson Action Bar */}
      <div className="fixed bottom-4 left-0 right-0 z-30 px-4 max-w-7xl mx-auto pointer-events-none">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center justify-between pointer-events-auto">
          {prevLessonId ? (
            <button
              onClick={() => navigate(`/courses/${courseId}/lessons/${prevLessonId}`)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Lesson
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleCompleteLesson}
            disabled={completing}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center gap-2 ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {completing ? 'Updating...' : isCompleted ? 'Completed (Next →)' : 'Mark as Complete (+10 XP)'}
          </button>

          {nextLessonId ? (
            <button
              onClick={() => navigate(`/courses/${courseId}/lessons/${nextLessonId}`)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Next Lesson <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
