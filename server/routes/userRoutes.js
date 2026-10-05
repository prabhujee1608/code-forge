import express from 'express';
import {
  getProfile,
  updateProfile,
  getCodingProfiles,
  updateCodingProfiles,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/coding-profiles', getCodingProfiles);
router.put('/coding-profiles', updateCodingProfiles);

export default router;
