import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Code2,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import * as codingService from '../services/codingService';
import { useToast } from '../hooks/useToast';

export function CodingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProblemDetail();
  }, [id]);

  const fetchProblemDetail = async () => {
    try {
      setLoading(true);
      const data = await codingService.getProblemById(id);
      setProblem(data);

      const starter =
        data.starterCode?.[language] ||
        (language === 'javascript'
          ? 'function solution(input) {\n  // Write your code here\n  return input;\n}'
          : 'def solution(input):\n    # Write your code here\n    return input');
      setCode(starter);
    } catch (err) {
      toast.error('Failed to load coding problem');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    try {
      setRunning(true);
      setOutput(null);
      const res = await codingService.runCode({ problemId: id, language, code });
      setOutput(res);
      toast.success('Test Cases Executed!');
    } catch (err) {
      toast.error('Code execution failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    try {
      setSubmitting(true);
      const res = await codingService.submitCode({ problemId: id, language, code });
      setOutput(res);
      toast.success(`Submission Accepted! +${res.xpGained} XP Awarded 🔥`);
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading coding environment...</p>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/coding')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Coding Problems
        </button>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ 17</option>
            <option value="java">Java 17</option>
          </select>
        </div>
      </div>

      {/* Editor & Statement Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Statement */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                  problem.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : problem.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {problem.difficulty}
              </span>
              <span className="text-xs font-mono text-cyan-400">{problem.topic}</span>
            </div>

            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-3">
            <p>{problem.statement}</p>

            {problem.constraints && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Constraints:
                </span>
                {problem.constraints.map((c, idx) => (
                  <code key={idx} className="block text-[11px] text-cyan-300 font-mono">
                    • {c}
                  </code>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Results */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-2">
              <span className="text-xs font-mono text-slate-400">solution.{language === 'python' ? 'py' : 'js'}</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Interactive Editor</span>
            </div>

            <textarea
              rows="14"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs text-cyan-300 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed shadow-inner"
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleRunCode}
                disabled={running || submitting}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> {running ? 'Running...' : 'Run Test Cases'}
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={running || submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> {submitting ? 'Submitting...' : 'Submit Solution (+25 XP)'}
              </button>
            </div>
          </div>

          {/* Test Case Execution Output Window */}
          {output && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  {output.status === 'Accepted' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  Verdict: <span className={output.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}>{output.status}</span>
                </span>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> {output.runtime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" /> {output.memory}
                  </span>
                </div>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap">
                {output.output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
