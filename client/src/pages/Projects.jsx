import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Code2,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  Edit,
  Layers,
  GitBranch,
} from 'lucide-react';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import * as projectService from '../services/projectService';
import { Modal } from '../components/Modal';
import { useToast } from '../hooks/useToast';

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    status: 'In Progress',
    role: 'Full Stack Developer',
    features: '',
  });

  const toast = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load project showcase');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubUrl: '',
      liveUrl: '',
      status: 'In Progress',
      role: 'Full Stack Developer',
      features: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      description: proj.description || '',
      techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : '',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      status: proj.status || 'In Progress',
      role: proj.role || 'Full Stack Developer',
      features: Array.isArray(proj.features) ? proj.features.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const updated = await projectService.updateProject(editingProject._id, formData);
        setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
        toast.success('Project updated successfully!');
      } else {
        const created = await projectService.createProject(formData);
        setProjects((prev) => [created, ...prev]);
        toast.success('New project created!');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success('Project deleted');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const totalReadinessScore = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + (p.readinessScore || 85), 0) / projects.length)
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading projects...</p>
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
              <FolderGit2 className="w-3.5 h-3.5" /> Project Portfolio Manager
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Career Project Showcase & Readiness
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
              Track your full-stack projects, tech stacks, live deployments, and GitHub repositories to boost your recruiter readiness score.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Add New Project
          </button>
        </div>

        {/* Portfolio Readiness Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Projects</div>
            <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Project Readiness</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{totalReadinessScore}%</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Deployed Projects</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">
              {projects.filter((p) => p.status === 'Deployed' || p.liveUrl).length}
            </div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Tech Stack Size</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">
              {projects.length
                ? (
                    projects.reduce((acc, p) => acc + (p.techStack?.length || 0), 0) / projects.length
                  ).toFixed(1)
                : 0}{' '}
              Techs
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Projects Added Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Showcase your web applications, mobile apps, or backend APIs to highlight your hands-on engineering capabilities.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm flex flex-col justify-between hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        proj.status === 'Deployed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : proj.status === 'Completed'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5 line-clamp-1">{proj.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{proj.role || 'Full Stack Developer'}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(proj)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {proj.description || 'Full-stack application built to solve real-world problems.'}
                </p>

                {/* Tech Stack Chips */}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-indigo-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Footer: External Links & Readiness Score */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" /> Code
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Readiness</span>
                  <span className="text-xs font-bold text-emerald-400">{proj.readinessScore || 85}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating & Editing Projects */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project Details' : 'Add New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI-Powered Resume Screening Platform"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Short Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe main features, architecture, and problem solved..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                placeholder="e.g. React, Node.js, MongoDB, Tailwind"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Deployed">Deployed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Live Deployment URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://my-app.vercel.app"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20"
            >
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
