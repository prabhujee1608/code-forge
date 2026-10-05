import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { SavedJobForm } from '../components/SavedJobForm';
import { Badge } from '../components/Badge';
import { formatDate } from '../utils/formatters';
import * as savedJobService from '../services/savedJobService';
import { useToast } from '../hooks/useToast';
import {
  Bookmark,
  Plus,
  ExternalLink,
  Building2,
  Calendar,
  Send,
  Edit2,
  Trash2,
  MapPin,
  DollarSign,
  Tag,
} from 'lucide-react';

export const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const data = await savedJobService.getSavedJobs();
      setSavedJobs(data);
    } catch (err) {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSubmitting(true);
      if (editingJob) {
        await savedJobService.updateSavedJob(editingJob._id, formData);
        toast.success('Opportunity updated!');
      } else {
        await savedJobService.createSavedJob(formData);
        toast.success('Opportunity saved!');
      }
      setIsModalOpen(false);
      setEditingJob(null);
      fetchSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this saved opportunity?')) return;
    try {
      await savedJobService.deleteSavedJob(id);
      setSavedJobs((prev) => prev.filter((item) => item._id !== id));
      toast.success('Opportunity removed');
    } catch (err) {
      toast.error('Failed to remove opportunity');
    }
  };

  const handleConvertToApp = async (id) => {
    try {
      const result = await savedJobService.convertSavedJobToApplication(id);
      toast.success('Moved to active applications!');
      setSavedJobs((prev) => prev.filter((item) => item._id !== id));
      navigate(`/applications/${result.application._id}`);
    } catch (err) {
      toast.error('Failed to convert saved opportunity');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Saved Opportunities</h1>
          <p className="text-xs text-slate-400 mt-1">
            Bookmark interesting jobs & internships before officially submitting your application
          </p>
        </div>

        <button
          onClick={() => {
            setEditingJob(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Save Opportunity</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading saved jobs...</p>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Saved Opportunities</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Save job postings you find online to apply later when your resume or cover letter is ready.
          </p>
          <button
            onClick={() => {
              setEditingJob(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
          >
            <Plus className="w-4 h-4" /> Save First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJobs.map((job) => (
            <div
              key={job._id}
              className="glass-card p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge text={job.type} type="jobType" />
                      <Badge text={job.workMode} type="workMode" />
                    </div>
                    <h3 className="font-bold text-lg text-white">{job.position}</h3>
                    <p className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {job.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingJob(job);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs text-slate-300">
                  {job.location && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location}</span>
                    </div>
                  )}

                  {job.salary && (
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{job.salary}</span>
                    </div>
                  )}

                  {job.deadline && (
                    <div className="flex items-center gap-2 text-amber-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Deadline: {formatDate(job.deadline)}</span>
                    </div>
                  )}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {job.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
                  >
                    <ExternalLink className="w-4 h-4" /> Posting
                  </a>
                ) : (
                  <span />
                )}

                <button
                  onClick={() => handleConvertToApp(job._id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>I Applied Now!</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        title={editingJob ? 'Edit Saved Opportunity' : 'Bookmark New Opportunity'}
      >
        <SavedJobForm
          initialData={editingJob}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingJob(null);
          }}
          isLoading={submitting}
        />
      </Modal>
    </div>
  );
};
