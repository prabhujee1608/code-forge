import express from 'express';
import {
  getInterviewQuestions,
  saveUserAnswer,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion,
} from '../controllers/interviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getInterviewQuestions);
router.post('/:id/answer', protect, saveUserAnswer);
router.post('/', protect, createInterviewQuestion);
router.put('/:id', protect, admin, updateInterviewQuestion);
router.delete('/:id', protect, admin, deleteInterviewQuestion);

export default router;
