import React, { useState, useEffect } from 'react';

export const SavedJobForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    url: '',
    location: '',
    workMode: 'Remote',
    type: 'Job',
    salary: '',
    deadline: '',
    skills: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        position: initialData.position || '',
        url: initialData.url || '',
        location: initialData.location || '',
        workMode: initialData.workMode || 'Remote',
        type: initialData.type || 'Job',
        salary: initialData.salary || '',
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().split('T')[0]
          : '',
        skills: Array.isArray(initialData.skills)
          ? initialData.skills.join(', ')
          : initialData.skills || '',
        notes: initialData.notes || '',
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="e.g. Airbnb, Stripe"
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
            placeholder="e.g. Graduate Frontend Engineer"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
          >
            <option value="Job">Job</option>
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
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
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
            placeholder="e.g. San Francisco, CA"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Expected Salary / Stipend
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. $130k / year"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Opportunity URL
        </label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Required Skills (Comma separated)
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g. React, TypeScript, GraphQL"
          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
          Notes / Referral Info
        </label>
        <textarea
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Contact details, application strategy..."
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
          {isLoading ? 'Saving...' : initialData ? 'Update Saved Opportunity' : 'Save Opportunity'}
        </button>
      </div>
    </form>
  );
};
