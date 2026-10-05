import express from 'express';
import { submitAttempt, getAttempts } from '../controllers/attemptController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', submitAttempt);
router.get('/', getAttempts);

export default router;
