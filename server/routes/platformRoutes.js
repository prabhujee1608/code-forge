import express from 'express';
import { getPlatformProfiles, syncPlatformHandle } from '../controllers/platformController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getPlatformProfiles);
router.post('/sync', syncPlatformHandle);

export default router;
