import express from 'express';
import {
  getAptitudeQuestions,
  submitAptitudeAttempt,
  getAptitudeHistory,
  createAptitudeQuestion,
} from '../controllers/aptitudeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAptitudeQuestions);
router.post('/attempt', protect, submitAptitudeAttempt);
router.get('/history', protect, getAptitudeHistory);
router.post('/', protect, admin, createAptitudeQuestion);

export default router;
