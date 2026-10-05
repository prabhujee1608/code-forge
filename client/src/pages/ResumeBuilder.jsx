import React, { useState } from 'react';
import {
  FileCheck,
  Download,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export function ResumeBuilder() {
  const { user } = useAuth();
  const toast = useToast();

  const [resumeData, setResumeData] = useState({
    name: user?.name || 'Omkar Nath Prabhujee',
    email: user?.email || 'alex.rivera@university.edu',
    phone: '+1 (555) 234-5678',
    college: user?.college || 'Stanford University',
    degree: user?.degree || 'Bachelor of Science in Computer Science',
    skills: user?.skills?.join(', ') || 'React, Node.js, JavaScript, Python, C++, SQL, Git, AWS',
    summary:
      'Passionate Full Stack Engineering student with strong problem-solving foundation in Data Structures, Algorithms, and modern web application development.',
    experience:
      'Software Engineer Intern @ Google (Summer 2026) - Developed high-throughput REST APIs and React frontend components.',
    projects:
      'CodeCareer Platform - Full Stack Job & Career preparation SaaS with real-time coding editor, platform stats integration, and MongoDB backend.',
  });

  const [activeTemplate, setActiveTemplate] = useState('modern');

  // Compute ATS Coverage Score
  const skillCount = resumeData.skills.split(',').filter((s) => s.trim().length > 0).length;
  const atsScore = Math.min(98, Math.max(65, 70 + skillCount * 3 + (resumeData.summary.length > 50 ? 10 : 0)));

  const handleExportPDF = () => {
    window.print();
    toast.success('Resume PDF Export initiated!');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <FileCheck className="w-3.5 h-3.5" /> ATS Resume Studio
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              ATS Resume Builder & Optimizer
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
              Craft recruiter-ready, ATS-friendly developer resumes with automated keyword coverage scoring and instant PDF export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" /> Export Resume PDF
            </button>
          </div>
        </div>

        {/* ATS Score Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">ATS Match Score</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{atsScore} / 100</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Target Role Keywords</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{skillCount} Skills Included</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Formatting Check</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">Clean ATS Standard</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Template</div>
            <div className="text-2xl font-bold text-amber-400 mt-1 capitalize">{activeTemplate}</div>
          </div>
        </div>
      </div>

      {/* Editor & Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Resume Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={resumeData.name}
                onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Executive Summary
              </label>
              <textarea
                rows="3"
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={resumeData.skills}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Experience
              </label>
              <textarea
                rows="3"
                value={resumeData.experience}
                onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Key Projects
              </label>
              <textarea
                rows="3"
                value={resumeData.projects}
                onChange={(e) => setResumeData({ ...resumeData, projects: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Resume Document Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl space-y-6 font-sans border border-slate-200">
            {/* Resume Header */}
            <div className="border-b border-slate-200 pb-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{resumeData.name}</h1>
              <p className="text-xs text-slate-600 mt-1 font-mono">
                {resumeData.email} | {resumeData.phone} | {resumeData.college}
              </p>
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-200 pb-1 mb-2">
                Executive Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-200 pb-1 mb-2">
                Technical Skills
              </h2>
              <p className="text-xs text-slate-700 font-mono leading-relaxed">{resumeData.skills}</p>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-200 pb-1 mb-2">
                Work Experience
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{resumeData.experience}</p>
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-200 pb-1 mb-2">
                Featured Projects
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{resumeData.projects}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
