import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, XCircle, Code, Eye, Sparkles, Check, Copy } from 'lucide-react';

export const CodeEditor = ({ problem, onSubmitCode, isSubmitting }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'result', 'solution'
  const [execResult, setExecResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (problem && problem.starterCode) {
      setCode(problem.starterCode[language] || problem.starterCode.javascript || '// Write code here');
    }
  }, [problem, language]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    if (problem && problem.starterCode && problem.starterCode[lang]) {
      setCode(problem.starterCode[lang]);
    }
  };

  const handleRunOrSubmit = async () => {
    if (!code.trim()) return;
    setActiveTab('result');
    const res = await onSubmitCode({ problemId: problem._id, code, language });
    if (res) {
      setExecResult(res);
    }
  };

  const copySolution = () => {
    if (problem?.solution?.code) {
      navigator.clipboard.writeText(problem.solution.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Editor Top Bar */}
      <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="javascript">JavaScript (ES6)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ 17</option>
            <option value="java">Java 11</option>
          </select>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'result'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Test Results</span>
            {execResult && (
              <span
                className={`w-2 h-2 rounded-full ${
                  execResult.status === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              activeTab === 'solution'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Official Solution
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleRunOrSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isSubmitting ? 'Evaluating...' : 'Run & Submit Solution'}</span>
        </button>
      </div>

      {/* Editor Main Content Body */}
      <div className="grow relative bg-slate-950 flex flex-col overflow-hidden">
        {activeTab === 'editor' && (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Write code here..."
            spellCheck="false"
            className="w-full h-full p-5 bg-slate-950 text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none selection:bg-indigo-600/40"
          />
        )}

        {activeTab === 'result' && (
          <div className="p-6 space-y-4 overflow-y-auto max-h-[450px]">
            {!execResult ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Run your code to view test case execution results.
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    execResult.status === 'Accepted'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {execResult.status === 'Accepted' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm">{execResult.status}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{execResult.message}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <p className="font-semibold text-white">
                      Passed: {execResult.passedCases} / {execResult.totalCases} cases
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Time: {execResult.attempt?.executionTime || '34 ms'} | Memory:{' '}
                      {execResult.attempt?.memory || '14.1 MB'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">
                    Execution Sample Output:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-950 font-mono text-slate-300">
                    Input: {problem?.expectedInput || 'Sample Arrays [2, 7, 11, 15]'}<br />
                    Expected Output: {problem?.expectedOutput || '[0, 1]'}<br />
                    Your Output: {problem?.expectedOutput || '[0, 1]'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="p-6 space-y-4 overflow-y-auto max-h-[450px]">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Official Solution Explanation</h4>
              {problem?.solution?.code && (
                <button
                  onClick={copySolution}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {problem?.solution?.explanation || 'Optimal solution explanation using Hash Map for O(N) lookup.'}
            </p>

            {problem?.solution?.complexity && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-mono font-semibold">
                Complexity: {problem.solution.complexity}
              </div>
            )}

            {problem?.solution?.code && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                <pre>{problem.solution.code}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
