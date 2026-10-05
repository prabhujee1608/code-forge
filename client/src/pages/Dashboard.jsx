import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Star,
  BookOpen,
  Trophy,
  ArrowRight,
  PlayCircle,
  Clock,
  Sparkles,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      coursesEnrolled: 4,
      coursesCompleted: 1,
      lessonsCompleted: 37,
      codingSolved: 24,
      quizAverage: 86,
      xp: 1250,
      currentStreak: 12,
    },
    continueLearning: null,
    recentCourses: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const activityData = [
    { day: 'Mon', lessons: 3, coding: 2 },
    { day: 'Tue', lessons: 4, coding: 3 },
    { day: 'Wed', lessons: 2, coding: 1 },
    { day: 'Thu', lessons: 5, coding: 4 },
    { day: 'Fri', lessons: 3, coding: 2 },
    { day: 'Sat', lessons: 6, coding: 5 },
    { day: 'Sun', lessons: 4, coding: 3 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading your learning dashboard...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const continueLearning = data?.continueLearning || null;
  const recentCourses = data?.recentCourses || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> CODEFORGE PLATFORM
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Good morning, {user?.name || 'Omkar'} 👋
            </h1>
            <p className="mt-2 text-slate-400 max-w-xl text-sm sm:text-base">
              Continue your learning journey. Build full-stack applications, solve coding challenges, and track your daily progress.
            </p>
          </div>

          {continueLearning && (
            <button
              onClick={() => navigate(`/courses/${continueLearning.courseId}/lessons/${continueLearning.lessonId}`)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 shrink-0"
            >
              <PlayCircle className="w-5 h-5" /> Continue Learning
            </button>
          )}
        </div>
      </div>

      {/* Performance Tracking Quick Status Bar */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900/90 border border-indigo-500/30 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/30 shrink-0">
            85
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Overall Performance Score</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Master Tier • Top 4%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High interview readiness across coding algorithms, course milestones & assessment accuracy.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/performance')}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 hover:text-cyan-200 text-xs font-bold flex items-center gap-2 transition-all shrink-0"
        >
          View Full Performance Analytics <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Dynamic Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6 fill-amber-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Streak</span>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{stats?.currentStreak || 12} Days</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Star className="w-6 h-6 fill-cyan-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total XP</span>
            <div className="text-2xl font-black text-cyan-400 mt-0.5">{stats?.xp || 1250} XP</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Courses Enrolled</span>
            <div className="text-2xl font-black text-white mt-0.5">{stats?.coursesEnrolled || 4} Courses</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{stats?.coursesCompleted || 1} Course</div>
          </div>
        </div>
      </div>

      {/* Large Continue Learning Section */}
      {continueLearning && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider inline-block">
                Continue Learning
              </span>

              <h2 className="text-2xl font-bold text-white">{continueLearning.courseTitle}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-cyan-400" /> Current Lesson: <span className="font-bold text-white">"{continueLearning.lessonTitle}"</span>
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Course Completion</span>
                  <span className="text-cyan-400 font-mono font-bold">{continueLearning.progress}%</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${continueLearning.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/courses/${continueLearning.courseId}/lessons/${continueLearning.lessonId}`)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all shrink-0"
            >
              Continue Lesson <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> My Enrolled Courses
          </h2>
          <button
            onClick={() => navigate('/courses')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Explore All Courses →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
              <p className="text-xs text-slate-400">You haven't enrolled in any courses yet.</p>
              <button
                onClick={() => navigate('/courses')}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            recentCourses.map((course) => (
              <div
                key={course._id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 relative">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-cyan-300 border border-slate-700">
                      {course.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Instructor: {course.instructor}</p>
                  </div>

                  {/* Course Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>Progress</span>
                      <span className="text-cyan-400">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" /> View Course & Curriculum
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Weekly Learning Activity Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" /> Weekly Learning Activity
        </h2>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Bar dataKey="lessons" name="Lessons Completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="coding" name="Coding Problems" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
