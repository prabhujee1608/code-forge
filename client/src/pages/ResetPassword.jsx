import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import * as authService from '../services/authService';
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !newPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword({ email, newPassword });
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
      </Link>

      <div className="mb-5">
        <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-400 mt-1">
          Set a new security password for your CodeCareer account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
            Registered Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex.rivera@university.edu"
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {isLoading ? (
            'Updating...'
          ) : (
            <>
              <span>Update Password</span>
              <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
