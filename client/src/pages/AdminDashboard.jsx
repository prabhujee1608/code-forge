import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Edit,
  BookOpen,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { Modal } from '../components/Modal';
import { useToast } from '../hooks/useToast';

export function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Beginner',
    instructor: 'CodeCareer Instructor',
    duration: '12 Hours',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  });

  const toast = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [coursesRes, studentsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/admin/students'),
      ]);
      setCourses(coursesRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      toast.error('Failed to load admin management data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/courses', formData);
      setCourses((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      toast.success('New Course Published successfully!');
    } catch (err) {
      toast.error('Failed to publish course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course from catalog?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success('Course deleted');
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading admin CMS panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/20 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldAlert className="w-3.5 h-3.5" /> ADMIN MANAGEMENT CONTROL PANEL
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Course CMS & Student Directory
            </h1>
            <p className="mt-2 text-slate-400 max-w-xl text-sm sm:text-base">
              Publish new courses, add modules & lessons, inspect enrolled student profiles, and manage learning content.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Create New Course
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-400" /> Active Course Catalog ({courses.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  {course.category} • {course.difficulty}
                </span>
                <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
                <p className="text-xs text-slate-400">Instructor: {course.instructor}</p>
              </div>

              <button
                onClick={() => handleDeleteCourse(course._id)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Students Directory */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" /> Enrolled Students Directory ({students.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-white font-bold text-sm">
                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{student.name}</h3>
                <p className="text-xs text-slate-400">{student.email}</p>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  XP: {student.points || 1250} • Streak: {student.streak?.current || 12}d
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Creating Course */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish New Course"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Next.js 15 & Server Actions Masterclass"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Overview of curriculum and key takeaways..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Web Development">Web Development</option>
                <option value="Programming">Programming</option>
                <option value="DSA">DSA</option>
                <option value="Database">Database</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-rose-500/20"
            >
              Publish Course
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
