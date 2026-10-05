import express from 'express';
import {
  getCourses,
  getCourseById,
  enrollCourse,
  getCourseProgress,
} from '../controllers/courseController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getCourses);
router.get('/:id', optionalAuth, getCourseById);
router.post('/:id/enroll', protect, enrollCourse);
router.get('/:id/progress', protect, getCourseProgress);

export default router;
