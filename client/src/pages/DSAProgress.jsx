import React, { useState, useEffect } from 'react';
import * as progressService from '../services/progressService';
import { useToast } from '../hooks/useToast';
import { BrainCircuit, Info, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

export const DSAProgress = () => {
  const [dsaMatrix, setDsaMatrix] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const fetchDSA = async () => {
      try {
        setLoading(true);
        const data = await progressService.getDSAProgress();
        setDsaMatrix(data);
      } catch (err) {
        toast.error('Failed to load DSA progress');
      } finally {
        setLoading(false);
      }
    };
    fetchDSA();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading DSA Skill Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">DSA Skill Matrix Tracker</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your Data Structures & Algorithms competency across core topics
        </p>
      </div>

      {/* Platform Disclaimer Note */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs text-indigo-200">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-indigo-300">Platform-Based Progress Disclaimer</h4>
          <p className="mt-0.5 text-slate-300 leading-relaxed">
            The percentage progress shown below is calculated strictly from your solved coding challenges and platform practice on CodeCareer. It is designed to help you identify weak areas and structure your practice.
          </p>
        </div>
      </div>

      {/* Grid of DSA Topics Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dsaMatrix.map((item) => (
          <div
            key={item.topic}
            className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">{item.topic}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Solved: <span className="text-cyan-400 font-semibold">{item.solved}</span> problems
                </p>
              </div>

              <span className="text-lg font-extrabold text-indigo-400">
                {item.percentage}%
              </span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
