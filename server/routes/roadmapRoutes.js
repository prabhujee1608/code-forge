import express from 'express';
import { getRoadmap, updateRoadmapPhase } from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getRoadmap);
router.put('/phase', updateRoadmapPhase);

export default router;
