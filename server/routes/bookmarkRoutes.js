import express from 'express';
import { getBookmarks, toggleBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getBookmarks);
router.post('/', protect, toggleBookmark);

export default router;
