import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ApplicationForm } from '../components/ApplicationForm';
import * as applicationService from '../services/applicationService';
import { useToast } from '../hooks/useToast';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const AddApplication = () => {
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const created = await applicationService.createApplication(formData);
      toast.success('Application added successfully!');
      navigate(`/applications/${created._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link
        to="/applications"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Applications List
      </Link>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Add New Application</h1>
            <p className="text-xs text-slate-400">
              Record a newly submitted job or internship application
            </p>
          </div>
        </div>

        <ApplicationForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/applications')}
          isLoading={submitting}
        />
      </div>
    </div>
  );
};
