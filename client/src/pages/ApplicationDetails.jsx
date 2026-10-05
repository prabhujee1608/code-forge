import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ApplicationForm } from '../components/ApplicationForm';
import { formatDate } from '../utils/formatters';
import * as applicationService from '../services/applicationService';
import { useToast } from '../hooks/useToast';
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  ExternalLink,
  DollarSign,
  User,
  Mail,
  FileText,
  Clock,
  Edit2,
  Trash2,
  Tag,
  CheckCircle,
  Briefcase,
} from 'lucide-react';

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplicationById(id);
      setApplication(data);
    } catch (err) {
      toast.error('Application not found');
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setApplication((prev) => ({ ...prev, status: newStatus }));
      await applicationService.updateApplication(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
      fetchDetail();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await applicationService.deleteApplication(id);
      toast.success('Application deleted');
      navigate('/applications');
    } catch (err) {
      toast.error('Failed to delete application');
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const updated = await applicationService.updateApplication(id, formData);
      setApplication(updated);
      toast.success('Application updated successfully!');
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error('Failed to update application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading application details...</p>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/applications"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Applications List
      </Link>

      {/* Main Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge text={application.type} type="jobType" />
              <Badge text={application.workMode} type="workMode" />
              <Badge text={application.status} type="status" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {application.position}
            </h1>
            <p className="text-lg font-semibold text-indigo-400 flex items-center gap-2 mt-1">
              <Building2 className="w-5 h-5 text-slate-400" />
              {application.company}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Edit2 className="w-4 h-4 text-amber-400" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-400" /> Delete
            </button>
          </div>
        </div>

        {/* Quick Status Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-400">Quick Change Application Status:</span>
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Left Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Application Metadata
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" /> Applied Date
                </span>
                <span className="font-semibold text-slate-200">
                  {formatDate(application.applicationDate)}
                </span>
              </div>

              {application.deadline && (
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-400 text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" /> Deadline
                  </span>
                  <span className="font-semibold text-amber-400">
                    {formatDate(application.deadline)}
                  </span>
                </div>
              )}

              {application.location && (
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-400 text-xs flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" /> Location
                  </span>
                  <span className="font-medium text-slate-200">{application.location}</span>
                </div>
              )}

              {application.salary && (
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-400 text-xs flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Salary / Compensation
                  </span>
                  <span className="font-semibold text-emerald-400">{application.salary}</span>
                </div>
              )}

              {application.jobUrl && (
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-400 text-xs flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-400" /> Posting URL
                  </span>
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Open Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Resume & Interview Dates */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> Resume Version Used
                </span>
                <span className="font-semibold text-indigo-300">{application.resumeVersion}</span>
              </div>

              {application.interviewDate && (
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-400 text-xs flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" /> Scheduled Interview
                  </span>
                  <span className="font-semibold text-cyan-300">
                    {formatDate(application.interviewDate)}
                  </span>
                </div>
              )}

              {application.followUpDate && (
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                  <span className="text-slate-400 text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" /> Follow-Up Reminder
                  </span>
                  <span className="font-semibold text-purple-300">
                    {formatDate(application.followUpDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recruiter & Notes
            </h3>

            {/* HR Info */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" /> Recruiter Name
                </span>
                <span className="font-medium text-slate-200">
                  {application.hrName || 'Not specified'}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                <span className="text-slate-400 text-xs flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" /> Recruiter Email
                </span>
                {application.hrEmail ? (
                  <a
                    href={`mailto:${application.hrEmail}`}
                    className="text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    {application.hrEmail}
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">Not specified</span>
                )}
              </div>
            </div>

            {/* Skills */}
            {application.requiredSkills && application.requiredSkills.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-500" /> Target Skills
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {application.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Notes & Reflections
              </span>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pt-1">
                {application.notes || 'No custom notes added for this application.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Application"
      >
        <ApplicationForm
          initialData={application}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={submitting}
        />
      </Modal>
    </div>
  );
};
