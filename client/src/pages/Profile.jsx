import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import * as userService from '../services/userService';
import {
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Code,
  Share2,
  Globe,
  Tag,
  Save,
  Flame,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUserLocal } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    degree: '',
    branch: '',
    graduationYear: '',
    currentYear: '',
    preferredRole: '',
    experienceLevel: '',
    skills: '',
    programmingLanguages: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          college: data.college || '',
          degree: data.degree || '',
          branch: data.branch || '',
          graduationYear: data.graduationYear || '',
          currentYear: data.currentYear || '',
          preferredRole: data.preferredRole || 'Full Stack Developer',
          experienceLevel: data.experienceLevel || 'Intermediate',
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
          programmingLanguages: Array.isArray(data.programmingLanguages)
            ? data.programmingLanguages.join(', ')
            : data.programmingLanguages || '',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          portfolioUrl: data.portfolioUrl || '',
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await userService.updateProfile(formData);
      updateUserLocal(updated);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl ring-4 ring-cyan-500/20 shrink-0">
          {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
        </div>

        <div className="text-center sm:text-left grow">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{formData.name}</h1>
          <p className="text-xs text-cyan-400 font-semibold mt-0.5">{formData.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-300">
            <span className="flex items-center gap-1 font-semibold">
              <GraduationCap className="w-4 h-4 text-slate-400" /> {formData.college}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-slate-400" /> {formData.degree} ({formData.branch})
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              🔥 {user?.streak?.current || 12} Day Streak
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              🪙 {user?.points || 150} Practice Points
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="font-bold text-lg text-white">Student Academic & Professional Details</h3>
          <p className="text-xs text-slate-400">
            Update your college, target role, programming languages, and portfolio links
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm opacity-60 bg-slate-950 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              College / University
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="Stanford University"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Branch / Major
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="Computer Science"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Graduation Year
            </label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="2026"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Current Year
            </label>
            <select
              name="currentYear"
              value={formData.currentYear}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduated">Graduated / Fresher</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Target Job Role
            </label>
            <select
              name="preferredRole"
              value={formData.preferredRole}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
            >
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, Python, TypeScript, MongoDB"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Programming Languages
            </label>
            <input
              type="text"
              name="programmingLanguages"
              value={formData.programmingLanguages}
              onChange={handleChange}
              placeholder="JavaScript, Python, C++, Java"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Portfolio links */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Online Profiles & Portfolio Links
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Portfolio Website
              </label>
              <input
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://alexrivera.dev"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
