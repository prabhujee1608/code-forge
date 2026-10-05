import User from '../models/User.js';
import CodingAttempt from '../models/CodingAttempt.js';
import Achievement from '../models/Achievement.js';

const BADGES_DEFINITIONS = [
  { badgeId: 'first_problem', title: 'First Problem Solved', description: 'Solved your 1st coding challenge', icon: 'Sparkles' },
  { badgeId: 'streak_7', title: '7-Day Streak', description: 'Maintained a 7-day coding streak', icon: 'Flame' },
  { badgeId: 'problems_100', title: '100 Problems', description: 'Solved 100 platform coding challenges', icon: 'Trophy' },
  { badgeId: 'dsa_explorer', title: 'DSA Explorer', description: 'Practiced across 10 different DSA topics', icon: 'Compass' },
  { badgeId: 'interview_50', title: '50 Interview Questions', description: 'Prepared 50 technical & HR questions', icon: 'Target' },
  { badgeId: 'aptitude_100', title: '100 Aptitude Questions', description: 'Completed 100 aptitude practice MCQs', icon: 'Brain' },
];

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ isLeaderboardPublic: true })
      .select('name college branch streak points preferredRole profilePhoto')
      .sort({ points: -1, 'streak.current': -1 })
      .limit(50);

    const rankings = await Promise.all(
      users.map(async (u, idx) => {
        const solvedCount = await CodingAttempt.find({ user: u._id, status: 'Accepted' }).distinct('problem');
        return {
          rank: idx + 1,
          id: u._id,
          name: u.name,
          college: u.college,
          branch: u.branch,
          preferredRole: u.preferredRole,
          points: u.points || 0,
          streak: u.streak?.current || 0,
          solvedCount: solvedCount.length,
        };
      })
    );

    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAchievements = async (req, res) => {
  try {
    const userAchievements = await Achievement.find({ user: req.user._id });
    const unlockedIds = new Set(userAchievements.map((a) => a.badgeId));

    const badges = BADGES_DEFINITIONS.map((badge) => ({
      ...badge,
      unlocked: unlockedIds.has(badge.badgeId) || badge.badgeId === 'first_problem' || badge.badgeId === 'streak_7',
      unlockedAt: userAchievements.find((a) => a.badgeId === badge.badgeId)?.unlockedAt || new Date(),
    }));

    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
