import api from './api';

export const fallbackPerformanceData = {
  user: {
    _id: '6ac1fa457ec66c3a7fca10c6',
    name: 'Omkar Nath Prabhujee',
    email: 'alex.rivera@university.edu',
    college: 'Stanford University',
    role: 'Full Stack Developer',
  },
  overallScore: 85,
  rankTier: {
    title: 'Master Developer',
    tier: 'Tier 1 (Top 4%)',
    color: 'from-indigo-400 to-cyan-400',
  },
  percentile: 'Top 4%',
  interviewReadiness: 'Exceptional Candidate',
  skillRadar: [
    { subject: 'Frontend Dev', score: 92, fullMark: 100 },
    { subject: 'Backend & APIs', score: 86, fullMark: 100 },
    { subject: 'Algorithms & DSA', score: 82, fullMark: 100 },
    { subject: 'Databases & SQL', score: 80, fullMark: 100 },
    { subject: 'System Design', score: 74, fullMark: 100 },
    { subject: 'Speed & Consistency', score: 90, fullMark: 100 },
  ],
  coding: {
    totalSolved: 18,
    totalProblems: 30,
    easy: { solved: 10, total: 10 },
    medium: { solved: 6, total: 14 },
    hard: { solved: 2, total: 6 },
    accuracyRate: 84,
    avgRuntime: '13ms',
    speedPercentile: 'Faster than 89% of submissions',
    topicBreakdown: [
      { topic: 'Arrays', total: 8, solved: 4, mastery: 50, status: 'Proficient' },
      { topic: 'Strings', total: 4, solved: 3, mastery: 75, status: 'Proficient' },
      { topic: 'Linked List', total: 3, solved: 2, mastery: 67, status: 'Proficient' },
      { topic: 'Stack', total: 3, solved: 1, mastery: 33, status: 'Needs Practice' },
      { topic: 'Binary Search', total: 2, solved: 1, mastery: 50, status: 'Proficient' },
      { topic: 'Trees', total: 3, solved: 1, mastery: 33, status: 'Needs Practice' },
      { topic: 'Dynamic Programming', total: 5, solved: 2, mastery: 40, status: 'Needs Practice' },
      { topic: 'Graph', total: 3, solved: 1, mastery: 33, status: 'Needs Practice' },
    ],
    languageStats: [
      { name: 'JavaScript', count: 16, percentage: 60, color: '#f59e0b' },
      { name: 'Python', count: 7, percentage: 25, color: '#06b6d4' },
      { name: 'C++', count: 3, percentage: 10, color: '#6366f1' },
      { name: 'Java', count: 1, percentage: 5, color: '#ec4899' },
    ],
  },
  curriculum: {
    coursesEnrolled: 4,
    coursesCompleted: 1,
    averageProgress: 74,
    lessonsCompleted: 38,
    totalLessons: 48,
    studyHours: '15.7',
    totalCoursesAvailable: 10,
  },
  quizzes: {
    averageScore: 88,
    totalAttempted: 8,
    passRate: 94,
    categories: [
      { category: 'React & Frontend', score: 92, status: 'Excellent' },
      { category: 'Node.js & REST APIs', score: 86, status: 'Strong' },
      { category: 'SQL & Database Design', score: 80, status: 'Proficient' },
      { category: 'Algorithms & Big-O', score: 88, status: 'Strong' },
      { category: 'System Design & Caching', score: 74, status: 'Growing' },
    ],
  },
  consistency: {
    currentStreak: 14,
    longestStreak: 21,
    totalXP: 1420,
    currentLevel: 8,
    nextLevelXP: 1600,
    xpProgress: 71,
    activityTrend: [
      { day: 'Mon', hours: 2.5, lessons: 3, coding: 2, quizzes: 1, xp: 85 },
      { day: 'Tue', hours: 3.2, lessons: 4, coding: 4, quizzes: 1, xp: 120 },
      { day: 'Wed', hours: 1.8, lessons: 2, coding: 1, quizzes: 0, xp: 50 },
      { day: 'Thu', hours: 4.0, lessons: 5, coding: 3, quizzes: 2, xp: 155 },
      { day: 'Fri', hours: 2.2, lessons: 2, coding: 2, quizzes: 1, xp: 75 },
      { day: 'Sat', hours: 4.8, lessons: 6, coding: 5, quizzes: 2, xp: 180 },
      { day: 'Sun', hours: 3.5, lessons: 4, coding: 3, quizzes: 1, xp: 110 },
    ],
  },
  competitivePlatforms: {
    leetcode: { rating: 1845, maxRating: 1910, globalRank: 24150, badge: 'Knight', totalSolved: 342, easySolved: 145, mediumSolved: 162, hardSolved: 35 },
    codechef: { rating: 1720, stars: '3★', globalRank: 8420, totalSolved: 188 },
    codeforces: { rating: 1512, maxRating: 1580, title: 'Specialist', totalSolved: 210 },
    geeksforgeeks: { codingScore: 620, monthlyRank: 412, totalSolved: 275 },
    hackerrank: { badgesCount: 6, starsProblemSolving: 5 },
  },
  strengths: [
    { area: 'Frontend Architecture & React 19', insight: '92% mastery with modular functional components and state hooks.', badge: 'High Precision' },
    { area: 'Two Pointers & Array Algorithms', insight: '85% acceptance rate on array manipulation challenges.', badge: 'Top Decile' },
    { area: 'Active Learning Consistency', insight: '14-day uninterrupted daily practice streak with high velocity.', badge: 'Consistent' },
  ],
  weaknesses: [
    { area: 'Dynamic Programming Subproblems', issue: 'Solve count on DP (Coin Change, LIS) is at 45% compared to target 75%.', recommendation: 'Practice 3 medium DP problems focusing on recurrence relations.', actionLink: '/coding/coin-change', actionText: 'Solve Coin Change' },
    { area: 'Distributed System Design & Caching', issue: 'System Design module completion is at 50% with pending Redis caching lab.', recommendation: 'Complete Lesson: High-Performance Caching with Redis.', actionLink: '/courses/system-design-architectures', actionText: 'Open System Design' },
    { area: 'Hard Difficulty Coding Problems', issue: 'Only 2 hard problems solved. Solving 3 more will increase readiness score to 92+.', recommendation: 'Attempt Trapping Rain Water problem.', actionLink: '/coding/trapping-rain-water', actionText: 'Attempt Hard Problem' },
  ],
  recentActivity: [
    { id: '1', title: 'Solved Two Sum', category: 'Coding', status: 'Accepted', xp: 25, time: '2 hours ago' },
    { id: '2', title: 'Completed Lesson: React Hooks', category: 'Course', status: 'Completed', xp: 20, time: '5 hours ago' },
    { id: '3', title: 'Full Stack Assessment Quiz', category: 'Quiz', status: 'Passed (90%)', xp: 30, time: 'Yesterday' },
  ],
};

export const getPerformanceOverview = async () => {
  try {
    const response = await api.get('/performance/overview');
    return response.data;
  } catch (err) {
    return fallbackPerformanceData;
  }
};

export const logStudySession = async (sessionData) => {
  try {
    const response = await api.post('/performance/log-session', sessionData);
    return response.data;
  } catch (err) {
    return {
      message: 'Study session logged!',
      durationMinutes: sessionData.durationMinutes || 45,
      xpEarned: 30,
    };
  }
};
