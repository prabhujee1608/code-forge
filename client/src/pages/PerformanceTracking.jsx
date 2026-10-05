import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  ExternalLink,
  Flame,
  Globe,
  HelpCircle,
  Layers,
  Play,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  Terminal,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import * as performanceService from '../services/performanceService';
import { useToast } from '../hooks/useToast';

export function PerformanceTracking() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: '',
    activityType: 'coding',
    durationMinutes: 45,
    category: 'Algorithms & DSA',
  });
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const res = await performanceService.getPerformanceOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load performance metrics', err);
      toast.error('Could not fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!sessionForm.title.trim()) {
      toast.error('Please enter a session title');
      return;
    }

    try {
      setIsSubmittingLog(true);
      const res = await performanceService.logStudySession(sessionForm);
      toast.success(`Logged ${res.durationMinutes} mins! +${res.xpEarned} XP awarded 🚀`);
      setIsLogModalOpen(false);
      setSessionForm({
        title: '',
        activityType: 'coding',
        durationMinutes: 45,
        category: 'Algorithms & DSA',
      });
      // Refresh metrics
      fetchPerformanceData();
    } catch (err) {
      toast.error('Failed to log study session');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <BrainCircuit className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-slate-400 tracking-wide">
          Computing multi-area performance analytics...
        </p>
      </div>
    );
  }

  const score = data?.overallScore || 85;
  const rank = data?.rankTier || { title: 'Master Developer', tier: 'Tier 1 (Top 4%)' };
  const coding = data?.coding;
  const curriculum = data?.curriculum;
  const quizzes = data?.quizzes;
  const consistency = data?.consistency;
  const platforms = data?.competitivePlatforms;

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Top Banner / Executive Performance Scorecard */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Info */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Comprehensive Performance Tracking System
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineering Velocity & Skill Readiness
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real-time multi-dimensional tracking across coding problem solving, full-stack curriculum velocity, assessment precision, and competitive platform rankings.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Readiness: <strong className="text-cyan-400">{data?.interviewReadiness}</strong>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Standing: <strong className="text-amber-400">{data?.percentile}</strong>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Streak: <strong className="text-orange-400">{consistency?.currentStreak} Days</strong>
              </span>
            </div>
          </div>

          {/* Right: Giant Glowing Score Dial & CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/60 border border-slate-800/80 p-5 rounded-3xl backdrop-blur-md shrink-0">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-indigo-500 transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white">{score}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  / 100 Index
                </span>
              </div>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div>
                <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  Performance Tier
                </div>
                <div className="text-lg font-black text-white tracking-tight">{rank.title}</div>
                <div className="text-xs text-cyan-400 font-semibold">{rank.tier}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Session
                </button>
                <button
                  onClick={fetchPerformanceData}
                  title="Refresh analytics"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards across 4 Primary Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Coding Mastery */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-5 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
            <span>Coding Practice</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
            {coding?.totalSolved}
            <span className="text-xs font-semibold text-slate-400">
              / {coding?.totalProblems} Solved
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Accuracy Rate</span>
            <span className="text-cyan-400 font-bold">{coding?.accuracyRate}%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-cyan-400 h-full rounded-full"
              style={{ width: `${coding?.accuracyRate}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Curriculum Velocity */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-5 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
            <span>Course Velocity</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
            {curriculum?.lessonsCompleted}
            <span className="text-xs font-semibold text-slate-400">
              / {curriculum?.totalLessons} Lessons
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Total Study Hours</span>
            <span className="text-indigo-400 font-bold">{curriculum?.studyHours} hrs</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-indigo-500 h-full rounded-full"
              style={{ width: `${curriculum?.averageProgress}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Assessment Precision */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-5 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
            <span>Quiz Precision</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
            {quizzes?.averageScore}%
            <span className="text-xs font-semibold text-slate-400">Average</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Pass Rate</span>
            <span className="text-amber-400 font-bold">{quizzes?.passRate}% (&ge;70%)</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-amber-400 h-full rounded-full"
              style={{ width: `${quizzes?.averageScore}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Consistency & XP */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-5 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
            <span>Habit & Rank</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
            {consistency?.totalXP}
            <span className="text-xs font-semibold text-emerald-400">XP</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Level {consistency?.currentLevel}</span>
            <span className="text-emerald-400 font-bold">{consistency?.xpProgress}%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${consistency?.xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Area Switcher Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-none gap-2">
        {[
          { id: 'overview', label: 'Executive Overview & AI Radar', icon: BrainCircuit },
          { id: 'coding', label: 'Coding & Algorithmic Practice', icon: Code2 },
          { id: 'curriculum', label: 'Course & Learning Velocity', icon: BookOpen },
          { id: 'quizzes', label: 'Assessments & Quizzes', icon: HelpCircle },
          { id: 'platforms', label: 'External Competitive Standing', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW & RADAR */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 6-Dimension Radar Chart */}
            <div className="lg:col-span-7 glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    Engineering Competency Radar
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculated score across 6 key full-stack engineering dimensions
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                  Target: 80+ Each
                </span>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data?.skillRadar || []}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                    <Radar
                      name="Your Competency"
                      dataKey="score"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Breakdown Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                {(data?.skillRadar || []).map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-[11px] text-slate-400 truncate">{item.subject}</div>
                    <div className="text-sm font-black text-cyan-400 mt-0.5">{item.score}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Diagnostics: Strengths & Weaknesses */}
            <div className="lg:col-span-5 space-y-4">
              {/* Strengths */}
              <div className="glass-panel border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Top Engineering Strengths
                </div>

                <div className="space-y-2.5">
                  {(data?.strengths || []).map((st, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{st.area}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          {st.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{st.insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses / AI Recommendations */}
              <div className="glass-panel border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4" /> AI Growth Recommendations
                </div>

                <div className="space-y-2.5">
                  {(data?.weaknesses || []).map((wk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{wk.area}</span>
                        <span className="text-[10px] text-amber-400 font-mono">Priority</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{wk.issue}</p>
                      <Link
                        to={wk.actionLink}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                      >
                        {wk.actionText} <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Learning Intensity Chart */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Weekly Learning Velocity & Study Intensity
                </h3>
                <p className="text-xs text-slate-400">
                  Daily study hours, coding problems solved, and XP generated
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Study Hours
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Coding Solved
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consistency?.activityTrend || []}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCoding" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    name="Study Hours"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                  <Area
                    type="monotone"
                    dataKey="coding"
                    name="Coding Solved"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#colorCoding)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CODING PERFORMANCE */}
      {activeTab === 'coding' && (
        <div className="space-y-6">
          {/* Difficulty Breakdown & Speed Benchmark */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Easy */}
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Easy Problems
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {coding?.easy?.solved} / {coding?.easy?.total}
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                {Math.round((coding?.easy?.solved / Math.max(coding?.easy?.total, 1)) * 100)}%
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (coding?.easy?.solved / Math.max(coding?.easy?.total, 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Foundational arrays, strings & basic math</p>
            </div>

            {/* Medium */}
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Medium Problems
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {coding?.medium?.solved} / {coding?.medium?.total}
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                {Math.round((coding?.medium?.solved / Math.max(coding?.medium?.total, 1)) * 100)}%
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (coding?.medium?.solved / Math.max(coding?.medium?.total, 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Trees, BST, DP & Two Pointers</p>
            </div>

            {/* Hard */}
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Hard Problems
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {coding?.hard?.solved} / {coding?.hard?.total}
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                {Math.round((coding?.hard?.solved / Math.max(coding?.hard?.total, 1)) * 100)}%
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (coding?.hard?.solved / Math.max(coding?.hard?.total, 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Complex dynamic programming & graphs</p>
            </div>
          </div>

          {/* Topic Mastery Grid */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Topic Mastery & Solved Ratio
                </h3>
                <p className="text-xs text-slate-400">
                  Target: Complete at least 70% of problems in each topic to unlock interview mastery
                </p>
              </div>
              <Link
                to="/coding"
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                Browse All 30 Problems <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(coding?.topicBreakdown || []).map((t, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.topic}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.mastery >= 75
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : t.mastery >= 50
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs text-slate-400">
                    <span>
                      {t.solved} / {t.total} Solved
                    </span>
                    <span className="font-bold text-slate-200">{t.mastery}%</span>
                  </div>

                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        t.mastery >= 75 ? 'bg-emerald-400' : t.mastery >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${t.mastery}%` }}
                    />
                  </div>

                  <button
                    onClick={() => navigate(`/coding?topic=${t.topic}`)}
                    className="w-full mt-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Practice {t.topic}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Efficiency & Language Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" /> Runtime & Execution Speed
              </h3>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Average Runtime</span>
                  <span className="text-lg font-mono font-bold text-amber-400">
                    {coding?.avgRuntime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Speed Benchmark</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {coding?.speedPercentile}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Memory Usage</span>
                  <span className="text-xs font-mono text-slate-300">4.2 MB (Optimal)</span>
                </div>
              </div>
            </div>

            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" /> Language Distribution
              </h3>
              <div className="space-y-3">
                {(coding?.languageStats || []).map((lang, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">{lang.name}</span>
                      <span className="text-slate-400 font-mono">
                        {lang.count} submissions ({lang.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ backgroundColor: lang.color, width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM VELOCITY */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Enrolled Courses
              </span>
              <div className="text-3xl font-black text-white">
                {curriculum?.coursesEnrolled} Courses
              </div>
              <p className="text-xs text-slate-400">
                {curriculum?.coursesCompleted} Courses Completely Finished
              </p>
            </div>

            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lessons Finished
              </span>
              <div className="text-3xl font-black text-indigo-400">
                {curriculum?.lessonsCompleted} / {curriculum?.totalLessons}
              </div>
              <p className="text-xs text-slate-400">
                Pacing at ~8 lessons / week (Fast Progression)
              </p>
            </div>

            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Course Bank Available
              </span>
              <div className="text-3xl font-black text-cyan-400">
                {curriculum?.totalCoursesAvailable} Comprehensive Courses
              </div>
              <p className="text-xs text-slate-400">MERN, React 19, Python, System Design, DSA</p>
            </div>
          </div>

          <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Active Course Progress & Milestones
                </h3>
                <p className="text-xs text-slate-400">
                  Track completion trajectories and lesson milestones
                </p>
              </div>
              <Link
                to="/courses"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                Explore All 10 Courses <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Full Stack Web Development (MERN)</h4>
                  <span className="text-xs font-bold text-cyan-400">80% Complete</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '80%' }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Instructor: Omkar Nath Prabhujee</span>
                  <Link
                    to="/courses/full-stack-web-development"
                    className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1"
                  >
                    Continue <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Modern JavaScript & ES6+ Deep Dive</h4>
                  <span className="text-xs font-bold text-indigo-400">65% Complete</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Instructor: Sarah Chen</span>
                  <Link
                    to="/courses/javascript-fundamentals"
                    className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1"
                  >
                    Continue <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Data Structures & Algorithmic Thinking</h4>
                  <span className="text-xs font-bold text-amber-400">40% Complete</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '40%' }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Instructor: Prof. Alan Turing</span>
                  <Link
                    to="/courses/dsa-fundamentals"
                    className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1"
                  >
                    Continue <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">System Design & Distributed Architectures</h4>
                  <span className="text-xs font-bold text-rose-400">15% Complete</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '15%' }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Instructor: Marcus Sterling</span>
                  <Link
                    to="/courses/system-design-architectures"
                    className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1"
                  >
                    Continue <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUIZZES & ASSESSMENTS */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Assessment Domain Accuracy
              </h3>
              <div className="space-y-3">
                {(quizzes?.categories || []).map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">{cat.category}</span>
                      <span className="text-amber-400 font-bold">{cat.score}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-cyan-400" /> Take Diagnostic Evaluation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluate your strengths and discover knowledge gaps before technical interviews. Quizzes grant XP and directly recalculate your performance readiness index.
                </p>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-300 font-semibold">Next Diagnostic Test:</div>
                  <div className="text-sm font-bold text-white">Full Stack Engineering & System Design</div>
                  <div className="text-[11px] text-slate-400">5 Questions • 10 Minutes • +30 XP</div>
                </div>
              </div>

              <Link
                to="/quizzes"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs text-center shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" /> Start Assessment Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXTERNAL PLATFORMS */}
      {activeTab === 'platforms' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* LeetCode */}
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-400">LeetCode</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  {platforms?.leetcode?.badge || 'Knight'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-white">{platforms?.leetcode?.rating}</div>
                <div className="text-xs text-slate-400">
                  Contest Rating (Max: {platforms?.leetcode?.maxRating})
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950">
                  <div className="text-emerald-400 font-bold">{platforms?.leetcode?.easySolved}</div>
                  <div className="text-[10px] text-slate-500">Easy</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950">
                  <div className="text-amber-400 font-bold">{platforms?.leetcode?.mediumSolved}</div>
                  <div className="text-[10px] text-slate-500">Med</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950">
                  <div className="text-rose-400 font-bold">{platforms?.leetcode?.hardSolved}</div>
                  <div className="text-[10px] text-slate-500">Hard</div>
                </div>
              </div>
            </div>

            {/* Codeforces */}
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-cyan-400">Codeforces</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                  {platforms?.codeforces?.title || 'Specialist'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-white">{platforms?.codeforces?.rating}</div>
                <div className="text-xs text-slate-400">
                  Max Rating: {platforms?.codeforces?.maxRating}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                <span>Problems Solved</span>
                <span className="font-bold text-cyan-400">{platforms?.codeforces?.totalSolved}</span>
              </div>
            </div>

            {/* CodeChef */}
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-500">CodeChef</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {platforms?.codechef?.stars || '3★'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-white">{platforms?.codechef?.rating}</div>
                <div className="text-xs text-slate-400">Division 2 Competitor</div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                <span>Global Rank</span>
                <span className="font-bold text-amber-400">#{platforms?.codechef?.globalRank}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Study Session Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" /> Log Study Session
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Session Title / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Practiced Dynamic Programming & React Hooks"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={sessionForm.activityType}
                    onChange={(e) => setSessionForm({ ...sessionForm, activityType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="coding">Coding Practice</option>
                    <option value="lesson">Course Video Lesson</option>
                    <option value="quiz">Quiz / Assessment</option>
                    <option value="study_session">System Design / Reading</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <select
                    value={sessionForm.durationMinutes}
                    onChange={(e) =>
                      setSessionForm({ ...sessionForm, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value={15}>15 mins (+10 XP)</option>
                    <option value={30}>30 mins (+20 XP)</option>
                    <option value={45}>45 mins (+30 XP)</option>
                    <option value={60}>60 mins (+40 XP)</option>
                    <option value={90}>90 mins (+60 XP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Primary Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic Programming, Backend, Full Stack"
                  value={sessionForm.category}
                  onChange={(e) => setSessionForm({ ...sessionForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLog}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {isSubmittingLog ? 'Saving...' : 'Record & Award XP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceTracking;
