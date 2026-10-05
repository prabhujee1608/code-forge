import User from '../models/User.js';
import CodingAttempt from '../models/CodingAttempt.js';
import { fetchAllPlatformStats } from '../services/platformFetcher.js';

// @desc    Get user profile with problem solving metrics
// @route   GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compute metrics
    const attempts = await CodingAttempt.find({ user: user._id, status: 'Accepted' }).distinct('problem');
    const totalSolved = attempts.length;

    res.json({
      ...user.toObject(),
      totalSolved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      college,
      degree,
      branch,
      graduationYear,
      currentYear,
      preferredRole,
      experienceLevel,
      skills,
      programmingLanguages,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      isLeaderboardPublic,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (college !== undefined) user.college = college;
    if (degree !== undefined) user.degree = degree;
    if (branch !== undefined) user.branch = branch;
    if (graduationYear !== undefined) user.graduationYear = Number(graduationYear);
    if (currentYear !== undefined) user.currentYear = currentYear;
    if (preferredRole !== undefined) user.preferredRole = preferredRole;
    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
    if (isLeaderboardPublic !== undefined) user.isLeaderboardPublic = isLeaderboardPublic;

    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    }
    if (programmingLanguages !== undefined) {
      user.programmingLanguages = Array.isArray(programmingLanguages)
        ? programmingLanguages
        : programmingLanguages.split(',').map((s) => s.trim());
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user competitive coding platform profiles & ratings
// @route   GET /api/users/coding-profiles
export const getCodingProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('codingProfiles codingStats');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      codingProfiles: user.codingProfiles || {},
      codingStats: user.codingStats || {},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user platform handles & refresh ratings from live platform APIs
// @route   PUT /api/users/coding-profiles
export const updateCodingProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { leetcode, codechef, codeforces, hackerrank, geeksforgeeks } = req.body;

    user.codingProfiles = {
      leetcode: leetcode !== undefined ? leetcode : user.codingProfiles?.leetcode || '',
      codechef: codechef !== undefined ? codechef : user.codingProfiles?.codechef || '',
      codeforces: codeforces !== undefined ? codeforces : user.codingProfiles?.codeforces || '',
      hackerrank: hackerrank !== undefined ? hackerrank : user.codingProfiles?.hackerrank || '',
      geeksforgeeks: geeksforgeeks !== undefined ? geeksforgeeks : user.codingProfiles?.geeksforgeeks || '',
    };

    // Fetch live statistics across external platform APIs
    const liveStats = await fetchAllPlatformStats(user.codingProfiles);
    user.codingStats = liveStats;

    await user.save();

    res.json({
      message: 'Coding platform handles updated and live data synced successfully',
      codingProfiles: user.codingProfiles,
      codingStats: user.codingStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
