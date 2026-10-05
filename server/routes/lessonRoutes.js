import express from 'express';
import { getLessonById, completeLesson } from '../controllers/lessonController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/courses/:courseId/lessons/:lessonId', optionalAuth, getLessonById);
router.post('/lessons/:id/complete', protect, completeLesson);

export default router;
