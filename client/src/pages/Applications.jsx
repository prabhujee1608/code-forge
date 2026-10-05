import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KanbanBoard } from '../components/KanbanBoard';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ApplicationForm } from '../components/ApplicationForm';
import { formatDate } from '../utils/formatters';
import * as applicationService from '../services/applicationService';
import { useToast } from '../hooks/useToast';
import {
  Search,
  Filter,
  Plus,
  KanbanSquare,
  List,
  Building2,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  
  // Search & Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('');
  const [sortBy, setSortBy] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const fetchApps = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplications({
        search,
        status: statusFilter,
        type: typeFilter,
        workMode: workModeFilter,
        sortBy,
        sortOrder,
      });
      setApplications(data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [search, statusFilter, typeFilter, workModeFilter, sortBy, sortOrder]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic update
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
      await applicationService.updateApplication(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
      fetchApps();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await applicationService.deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast.success('Application deleted');
    } catch (err) {
      toast.error('Failed to delete application');
    }
  };

  const handleCreateSubmit = async (formData) => {
    try {
      setSubmitting(true);
      if (editingApp) {
        await applicationService.updateApplication(editingApp._id, formData);
        toast.success('Application updated!');
      } else {
        await applicationService.createApplication(formData);
        toast.success('New application added!');
      }
      setIsAddModalOpen(false);
      setEditingApp(null);
      fetchApps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Application Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your full-time job & internship applications across all stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KanbanSquare className="w-4 h-4" />
              <span>Kanban Board</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingApp(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, role, skills..."
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs sm:text-sm bg-slate-900"
          >
            <option value="">All Statuses</option>
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs sm:text-sm bg-slate-900"
          >
            <option value="">All Types (Job & Internship)</option>
            <option value="Job">Job</option>
            <option value="Internship">Internship</option>
          </select>

          {/* Work Mode Filter */}
          <select
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs sm:text-sm bg-slate-900"
          >
            <option value="">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Main View Render: List or Kanban */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading applications...</p>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          applications={applications}
          onStatusChange={handleStatusChange}
          onViewDetails={(id) => navigate(`/applications/${id}`)}
        />
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Applications Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No entries match your search filters or you haven't added any applications yet.
          </p>
          <button
            onClick={() => {
              setEditingApp(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Company & Position</th>
                  <th className="px-5 py-3.5 font-semibold">Type</th>
                  <th className="px-5 py-3.5 font-semibold">Location</th>
                  <th className="px-5 py-3.5 font-semibold">Applied Date</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        <Link to={`/applications/${app._id}`}>{app.position}</Link>
                      </div>
                      <div className="text-xs text-indigo-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{app.company}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Badge text={app.type} type="jobType" />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge text={app.workMode} type="workMode" />
                        {app.location && (
                          <span className="text-[11px] text-slate-400">{app.location}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-400">
                      {formatDate(app.applicationDate)}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/applications/${app._id}`}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingApp(app);
                            setIsAddModalOpen(true);
                          }}
                          title="Edit"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Application Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApp(null);
        }}
        title={editingApp ? 'Edit Application' : 'Add New Application'}
      >
        <ApplicationForm
          initialData={editingApp}
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setIsAddModalOpen(false);
            setEditingApp(null);
          }}
          isLoading={submitting}
        />
      </Modal>
    </div>
  );
};
