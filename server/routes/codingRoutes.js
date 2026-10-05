import express from 'express';
import {
  getProblems,
  getProblemById,
  runCode,
  submitCode,
} from '../controllers/codingController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/problems', optionalAuth, getProblems);
router.get('/problems/:id', optionalAuth, getProblemById);
router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);

export default router;
