import React, { useState, useEffect } from 'react';

export const ApplicationForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    type: 'Job',
    location: '',
    workMode: 'Remote',
    jobUrl: '',
    applicationDate: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'Applied',
    salary: '',
    hrName: '',
    hrEmail: '',
    notes: '',
    requiredSkills: '',
    resumeVersion: 'Resume V1 – General',
    interviewDate: '',
    followUpDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        position: initialData.position || '',
        type: initialData.type || 'Job',
        location: initialData.location || '',
        workMode: initialData.workMode || 'Remote',
        jobUrl: initialData.jobUrl || '',
        applicationDate: initialData.applicationDate
          ? new Date(initialData.applicationDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().split('T')[0]
          : '',
        status: initialData.status || 'Applied',
        salary: initialData.salary || '',
        hrName: initialData.hrName || '',
        hrEmail: initialData.hrEmail || '',
        notes: initialData.notes || '',
        requiredSkills: Array.isArray(initialData.requiredSkills)
          ? initialData.requiredSkills.join(', ')
          : initialData.requiredSkills || '',
        resumeVersion: initialData.resumeVersion || 'Resume V1 – General',
        interviewDate: initialData.interviewDate
          ? new Date(initialData.interviewDate).toISOString().split('T')[0]
          : '',
        followUpDate: initialData.followUpDate
          ? new Date(initialData.followUpDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Job Details */}
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
            placeholder="e.g. Google, Microsoft"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Job / Internship Title *
          </label>
          <input
            type="text"
            name="position"
            required
            value={formData.position}
            onChange={handleChange}
            placeholder="e.g. Software Engineer Intern"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Application Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
          >
            <option value="Job">Full-time Job</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Work Mode
          </label>
          <select
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
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
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview Scheduled</option>
            <option value="Offer">Offer Received</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA or Remote"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Salary / Stipend
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. $120,000 / year or $45 / hr"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Application Link (URL)
          </label>
          <input
            type="url"
            name="jobUrl"
            value={formData.jobUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Resume Version Used
          </label>
          <select
            name="resumeVersion"
            value={formData.resumeVersion}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
          >
            <option value="Resume V1 – General">Resume V1 – General</option>
            <option value="Resume V2 – Web Development">Resume V2 – Web Development</option>
            <option value="Resume V3 – Data Science / AI">Resume V3 – Data Science / AI</option>
            <option value="Resume V4 – Systems & Backend">Resume V4 – Systems & Backend</option>
          </select>
        </div>
      </div>

      {/* Dates Section */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-4">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          Dates & Timelines
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Application Date
            </label>
            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Interview Date
            </label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Follow-up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg glass-input text-xs"
            />
          </div>
        </div>
      </div>

      {/* HR Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            HR / Recruiter Name
          </label>
          <input
            type="text"
            name="hrName"
            value={formData.hrName}
            onChange={handleChange}
            placeholder="e.g. Jane Doe"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            HR / Recruiter Email
          </label>
          <input
            type="email"
            name="hrEmail"
            value={formData.hrEmail}
            onChange={handleChange}
            placeholder="recruiter@company.com"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Required Skills (Comma separated)
        </label>
        <input
          type="text"
          name="requiredSkills"
          value={formData.requiredSkills}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, TypeScript, Docker"
          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Notes & Key Info
        </label>
        <textarea
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add referral info, interview prep notes, cover letter highlights..."
          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
        />
      </div>

      {/* Buttons */}
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
          {isLoading ? 'Saving...' : initialData ? 'Update Application' : 'Save Application'}
        </button>
      </div>
    </form>
  );
};
