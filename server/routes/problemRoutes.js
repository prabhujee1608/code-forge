import express from 'express';
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getProblems);
router.get('/:id', protect, getProblemById);
router.post('/', protect, createProblem);
router.put('/:id', protect, admin, updateProblem);
router.delete('/:id', protect, admin, deleteProblem);

export default router;
