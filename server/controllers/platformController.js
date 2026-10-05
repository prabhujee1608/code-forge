import User from '../models/User.js';
import {
  fetchCodeforcesData,
  fetchLeetCodeData,
  fetchCodeChefData,
  fetchGeeksForGeeksData,
  fetchHackerRankData,
  fetchAllPlatformStats,
} from '../services/platformFetcher.js';

// @desc    Get student connected coding platform profiles & live stats
// @route   GET /api/coding-profiles
export const getPlatformProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const handles = user.codingHandles || {
      leetcode: 'alexrivera',
      codeforces: 'tourist',
      codechef: 'alex_rivera',
      geeksforgeeks: 'alexrivera',
      hackerrank: 'alexrivera',
    };

    const liveStats = await fetchAllPlatformStats(handles);

    res.json({
      handles,
      stats: liveStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Connect platform handle & sync live progress
// @route   POST /api/coding-profiles/sync
export const syncPlatformHandle = async (req, res) => {
  try {
    const { platform, handle } = req.body;
    if (!platform || !handle) {
      return res.status(400).json({ message: 'Platform name and handle are required' });
    }

    const user = await User.findById(req.user._id);
    if (!user.codingHandles) {
      user.codingHandles = {};
    }

    user.codingHandles[platform.toLowerCase()] = handle;
    await user.save();

    let fetchedData = null;
    const p = platform.toLowerCase();

    if (p === 'codeforces') {
      fetchedData = await fetchCodeforcesData(handle);
    } else if (p === 'leetcode') {
      fetchedData = await fetchLeetCodeData(handle);
    } else if (p === 'codechef') {
      fetchedData = await fetchCodeChefData(handle);
    } else if (p === 'geeksforgeeks') {
      fetchedData = await fetchGeeksForGeeksData(handle);
    } else if (p === 'hackerrank') {
      fetchedData = await fetchHackerRankData(handle);
    }

    res.json({
      message: `Successfully connected ${platform} handle "${handle}"`,
      platform,
      handle,
      data: fetchedData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
