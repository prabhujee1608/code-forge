import express from 'express';
import { getAllQuizzes, getQuizById, submitQuizAttempt } from '../controllers/quizController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAllQuizzes);
router.get('/:id', optionalAuth, getQuizById);
router.post('/:id/submit', optionalAuth, submitQuizAttempt);

export default router;
