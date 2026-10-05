import express from 'express';
import { getPerformanceOverview, logStudySession } from '../controllers/performanceController.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', optionalAuth, getPerformanceOverview);
router.post('/log-session', optionalAuth, logStudySession);

export default router;
