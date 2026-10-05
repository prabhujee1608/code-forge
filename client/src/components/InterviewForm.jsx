import React, { useState, useEffect } from 'react';

export const InterviewForm = ({ initialData, applications = [], onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    application: '',
    interviewDate: new Date().toISOString().split('T')[0],
    interviewTime: '10:00 AM',
    interviewType: 'Technical',
    interviewRound: 'Round 1',
    interviewer: '',
    meetingLink: '',
    notes: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        position: initialData.position || '',
        application: initialData.application?._id || initialData.application || '',
        interviewDate: initialData.interviewDate
          ? new Date(initialData.interviewDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        interviewTime: initialData.interviewTime || '10:00 AM',
        interviewType: initialData.interviewType || 'Technical',
        interviewRound: initialData.interviewRound || 'Round 1',
        interviewer: initialData.interviewer || '',
        meetingLink: initialData.meetingLink || '',
        notes: initialData.notes || '',
        status: initialData.status || 'Scheduled',
      });
    }
  }, [initialData]);

  const handleApplicationSelect = (e) => {
    const appId = e.target.value;
    setFormData((prev) => ({ ...prev, application: appId }));

    if (appId) {
      const selected = applications.find((a) => a._id === appId);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          company: selected.company,
          position: selected.position,
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {applications.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Link to Existing Application (Optional)
          </label>
          <select
            name="application"
            value={formData.application}
            onChange={handleApplicationSelect}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
          >
            <option value="">-- Select Application --</option>
            {applications.map((app) => (
              <option key={app._id} value={app._id}>
                {app.company} - {app.position} ({app.status})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Google"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Position *
          </label>
          <input
            type="text"
            name="position"
            required
            value={formData.position}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Date *
          </label>
          <input
            type="date"
            name="interviewDate"
            required
            value={formData.interviewDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Time
          </label>
          <input
            type="text"
            name="interviewTime"
            value={formData.interviewTime}
            onChange={handleChange}
            placeholder="e.g. 02:00 PM EST"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Interview Type
          </label>
          <select
            name="interviewType"
            value={formData.interviewType}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
          >
            <option value="HR">HR Screen</option>
            <option value="Technical">Technical</option>
            <option value="Coding">Coding</option>
            <option value="System Design">System Design</option>
            <option value="Managerial">Managerial</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Final">Final Round</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Interview Round
          </label>
          <input
            type="text"
            name="interviewRound"
            value={formData.interviewRound}
            onChange={handleChange}
            placeholder="e.g. Round 1 / Screen"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Interviewer Name(s)
          </label>
          <input
            type="text"
            name="interviewer"
            value={formData.interviewer}
            onChange={handleChange}
            placeholder="e.g. John Smith (Engineering Lead)"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Meeting Link
          </label>
          <input
            type="url"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Preparation Notes
        </label>
        <textarea
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Topics to review, questions to ask interviewer..."
          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Interview' : 'Schedule Interview'}
        </button>
      </div>
    </form>
  );
};
