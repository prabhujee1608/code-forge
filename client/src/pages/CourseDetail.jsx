import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Clock,
  User,
  Star,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import * as courseService from '../services/courseService';
import { useToast } from '../hooks/useToast';

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourseById(id);
      setCourse(data);

      // Expand all modules by default
      if (data.modules) {
        const initial = {};
        data.modules.forEach((mod) => (initial[mod._id] = true));
        setExpandedModules(initial);
      }
    } catch (err) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnroll = async () => {
    try {
      await courseService.enrollCourse(course._id);
      toast.success('Successfully enrolled!');
      fetchCourseDetail();
    } catch (err) {
      toast.error('Enrollment failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading course curriculum...</p>
      </div>
    );
  }

  if (!course) return null;

  // Find first lesson to start/continue
  let firstLessonId = null;
  if (course.modules && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
    firstLessonId = course.modules[0].lessons[0]._id;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Course Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              {course.category} • {course.difficulty}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              {course.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1 font-semibold text-slate-200">
                <User className="w-4 h-4 text-indigo-400" /> Instructor: {course.instructor}
              </span>
              <span className="flex items-center gap-1 font-mono text-cyan-400">
                <Clock className="w-4 h-4" /> {course.duration}
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-300">
                <Star className="w-4 h-4 fill-amber-300" /> {course.rating} Rating
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 shrink-0 w-full md:w-72 text-center">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Course Status</span>
              <div className="text-2xl font-bold text-white">
                {course.isEnrolled ? `${course.progressPercentage}% Completed` : 'Not Enrolled'}
              </div>
            </div>

            {course.isEnrolled && (
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                  style={{ width: `${course.progressPercentage}%` }}
                />
              </div>
            )}

            {course.isEnrolled ? (
              <button
                onClick={() =>
                  navigate(`/courses/${course._id}/lessons/${course.lastLessonId || firstLessonId}`)
                }
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" /> Start / Resume Lessons
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Enroll in Course
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Module Hierarchy */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Course Curriculum & Lessons
        </h2>

        <div className="space-y-4">
          {course.modules?.map((mod, modIdx) => {
            const isExpanded = expandedModules[mod._id];
            return (
              <div
                key={mod._id}
                className="border border-slate-800/80 rounded-2xl bg-slate-950/60 overflow-hidden"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(mod._id)}
                  className="w-full p-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-left hover:bg-slate-900 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      Module {modIdx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{mod.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">
                      {mod.lessons.length} Lessons
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Lesson Items */}
                {isExpanded && (
                  <div className="divide-y divide-slate-800/50">
                    {mod.lessons.map((les) => (
                      <div
                        key={les._id}
                        onClick={() => navigate(`/courses/${course._id}/lessons/${les._id}`)}
                        className="p-4 flex items-center justify-between hover:bg-slate-900/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {les.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-colors">
                            {les.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                          {les.hasQuiz && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" /> Quiz
                            </span>
                          )}
                          <span>{les.duration || '15 mins'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
