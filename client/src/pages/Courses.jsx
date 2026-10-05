import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  BookOpen,
  Star,
  Clock,
  User,
  CheckCircle2,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import * as courseService from '../services/courseService';
import { useToast } from '../hooks/useToast';

const CATEGORIES = [
  'All',
  'Web Development',
  'DSA',
  'Programming',
  'Programming Languages',
  'Database',
  'System Design',
  'DevOps',
  'AI & Data Science',
  'Mobile Development',
];

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchCourses();
  }, [activeCategory]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses({ category: activeCategory, search: searchQuery });
      setCourses(data);
    } catch (err) {
      toast.error('Failed to load courses catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (e, courseId) => {
    e.stopPropagation();
    try {
      await courseService.enrollCourse(courseId);
      toast.success('Successfully enrolled in course!');
      fetchCourses();
      navigate(`/courses/${courseId}`);
    } catch (err) {
      toast.error('Enrollment failed');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" /> COURSE CATALOG
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Explore Courses & Curriculums
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
              Learn full-stack web development, Data Structures, Algorithms, Python, and Databases from industry experts.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </form>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading catalog...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Courses Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/courses/${course._id}`)}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/90 text-cyan-300 border border-slate-700">
                    {course.category}
                  </div>
                  <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/90 text-amber-300 border border-slate-700 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300" /> {course.rating || 4.9}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Course Details Pills */}
                <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> {course.instructor || 'CodeCareer'}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> {course.duration}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                {course.isEnrolled ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course._id}`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4" /> Continue Learning ({course.progress}%)
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleEnroll(e, course._id)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" /> Enroll Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
