import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import * as authService from '../services/authService';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email address');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.forgotPassword({ email });
      setSentMessage(res.message);
      toast.success('Password reset link generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link.');
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
        <h2 className="text-xl font-bold text-white tracking-tight">Forgot Password</h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your email to receive a password reset link
        </p>
      </div>

      {sentMessage ? (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-3">
          <p className="font-semibold">{sentMessage}</p>
          <Link
            to="/reset-password"
            className="block text-center py-2 px-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-md"
          >
            Proceed to Reset Password Page
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@university.edu"
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
              'Sending...'
            ) : (
              <>
                <span>Send Reset Link</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
