import express from 'express';
import { getStudentProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getStudentProgress);

export default router;
