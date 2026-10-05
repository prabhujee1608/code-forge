import express from 'express';
import { getLeaderboard, getAchievements } from '../controllers/leaderboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/leaderboard', getLeaderboard);
router.get('/achievements', getAchievements);

export default router;
