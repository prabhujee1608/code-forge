import express from 'express';
import {
  getSavedJobs,
  createSavedJob,
  updateSavedJob,
  deleteSavedJob,
  convertToApplication,
} from '../controllers/savedJobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getSavedJobs);
router.post('/', createSavedJob);
router.put('/:id', updateSavedJob);
router.delete('/:id', deleteSavedJob);
router.post('/:id/apply', convertToApplication);

export default router;
