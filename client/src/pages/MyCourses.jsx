import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PlayCircle, Trophy, Compass, CheckCircle2 } from 'lucide-react';
import * as courseService from '../services/courseService';

export function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const allCourses = await courseService.getCourses();
      const enrolledOnly = allCourses.filter((c) => c.isEnrolled);
      setCourses(enrolledOnly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading your enrolled courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" /> MY ENROLLED COURSES
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Your Learning Workspace
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
              Track your active enrollments, completed courses, and lesson milestones.
            </p>
          </div>

          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <Compass className="w-4 h-4" /> Explore Catalog
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Enrolled Courses Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't enrolled in any courses. Browse the course catalog to start learning full stack development, algorithms, or databases.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
          >
            Browse Course Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all space-y-4"
            >
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.progress === 100 && (
                    <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{course.instructor}</p>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Course Progress</span>
                    <span className="text-cyan-400 font-mono font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/courses/${course._id}`)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20"
              >
                <PlayCircle className="w-4 h-4" /> Continue Learning
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
