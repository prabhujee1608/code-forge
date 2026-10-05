import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import * as progressService from '../services/progressService';
import * as problemService from '../services/problemService';
import { StatCard } from '../components/StatCard';
import { BarChart3, TrendingUp, Code2, CheckCircle2, Target, Zap, AlertTriangle } from 'lucide-react';

const DIFFICULTY_COLORS = {
  Easy: '#10b981',
  Medium: '#f59e0b',
  Hard: '#f43f5e',
};

export const Analytics = () => {
  const [progress, setProgress] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [progressData, attemptsData, analyticsData] = await Promise.all([
          progressService.getOverallProgress(),
          problemService.getAttempts(),
          progressService.getAnalytics(),
        ]);
        setProgress(progressData);
        setAttempts(attemptsData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading performance analytics...</p>
      </div>
    );
  }

  // Difficulty Distribution
  const diffData = [
    { name: 'Easy', value: progress?.easySolved || 3, color: '#10b981' },
    { name: 'Medium', value: progress?.mediumSolved || 2, color: '#f59e0b' },
    { name: 'Hard', value: progress?.hardSolved || 1, color: '#f43f5e' },
  ];

  // Weekly Submissions Simulation
  const weeklyData = [
    { day: 'Mon', submissions: 4 },
    { day: 'Tue', submissions: 6 },
    { day: 'Wed', submissions: 3 },
    { day: 'Thu', submissions: 8 },
    { day: 'Fri', submissions: 5 },
    { day: 'Sat', submissions: 10 },
    { day: 'Sun', submissions: 7 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed metrics on your problem solving accuracy, difficulty split & topic mastery
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Solved"
          value={progress?.totalSolved || 6}
          icon={CheckCircle2}
          color="cyan"
          subtitle="Distinct challenges completed"
        />
        <StatCard
          title="Accuracy Rate"
          value={`${progress?.accuracy || 85}%`}
          icon={Target}
          color="emerald"
          subtitle="Passed vs total submissions"
        />
        <StatCard
          title="Strongest Topic"
          value={analytics?.strongestTopic || 'Arrays'}
          icon={Zap}
          color="indigo"
          subtitle="Highest completion count"
        />
        <StatCard
          title="Weakest Topic"
          value={analytics?.weakestTopic || 'DP'}
          icon={AlertTriangle}
          color="amber"
          subtitle="Needs additional practice"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="font-bold text-white text-base mb-1">Difficulty Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown of Easy, Medium, and Hard solved problems</p>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diffData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {diffData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend formatter={(val) => <span className="text-xs text-slate-300 font-semibold">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Submissions Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="font-bold text-white text-base mb-1">Weekly Submissions</h3>
          <p className="text-xs text-slate-400 mb-4">Submissions made during the past week</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="submissions" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
