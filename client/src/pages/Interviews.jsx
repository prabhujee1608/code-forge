import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { InterviewForm } from '../components/InterviewForm';
import { formatDate, getDaysRemaining } from '../utils/formatters';
import * as interviewService from '../services/interviewService';
import * as applicationService from '../services/applicationService';
import { useToast } from '../hooks/useToast';
import {
  CalendarCheck,
  Plus,
  Video,
  User,
  Clock,
  Edit2,
  Trash2,
  ExternalLink,
  Building2,
  FileText,
} from 'lucide-react';

export const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [interviewsData, appsData] = await Promise.all([
        interviewService.getInterviews(),
        applicationService.getApplications(),
      ]);
      setInterviews(interviewsData);
      setApplications(appsData);
    } catch (err) {
      toast.error('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSubmitting(true);
      if (editingInterview) {
        await interviewService.updateInterview(editingInterview._id, formData);
        toast.success('Interview details updated!');
      } else {
        await interviewService.createInterview(formData);
        toast.success('New interview scheduled!');
      }
      setIsModalOpen(false);
      setEditingInterview(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save interview');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview record?')) return;
    try {
      await interviewService.deleteInterview(id);
      setInterviews((prev) => prev.filter((item) => item._id !== id));
      toast.success('Interview deleted');
    } catch (err) {
      toast.error('Failed to delete interview');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setInterviews((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status } : i))
      );
      await interviewService.updateInterview(id, { status });
      toast.success(`Interview marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interview Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep track of technical screens, coding tests, and managerial rounds
          </p>
        </div>

        <button
          onClick={() => {
            setEditingInterview(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading interviews...</p>
        </div>
      ) : interviews.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Interviews Scheduled</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When employers schedule interviews with you, record them here to get reminders and keep notes ready.
          </p>
          <button
            onClick={() => {
              setEditingInterview(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
          >
            <Plus className="w-4 h-4" /> Schedule First Interview
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((item) => {
            const daysInfo = getDaysRemaining(item.interviewDate);

            return (
              <div
                key={item._id}
                className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {item.interviewType}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {item.interviewRound}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-1.5">{item.company}</h3>
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {item.position}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingInterview(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                        title="Edit Interview"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Interview"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Schedule Details Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-2 font-medium">
                        <Clock className="w-4 h-4 text-cyan-400" /> Date & Time:
                      </span>
                      <span className="font-semibold text-white">
                        {formatDate(item.interviewDate)} at {item.interviewTime}
                      </span>
                    </div>

                    {daysInfo && (
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
                        <span className="text-slate-400">Countdown:</span>
                        <span className="font-bold text-indigo-400">{daysInfo.text}</span>
                      </div>
                    )}

                    {item.interviewer && (
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" /> Interviewer:
                        </span>
                        <span className="font-medium text-slate-200">{item.interviewer}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes if any */}
                  {item.notes && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300">
                      <span className="font-semibold text-slate-400 block mb-1">Prep Notes:</span>
                      <p className="line-clamp-2">{item.notes}</p>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    className="text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {item.meetingLink ? (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">No link provided</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInterview(null);
        }}
        title={editingInterview ? 'Edit Interview' : 'Schedule New Interview'}
      >
        <InterviewForm
          initialData={editingInterview}
          applications={applications}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingInterview(null);
          }}
          isLoading={submitting}
        />
      </Modal>
    </div>
  );
};
