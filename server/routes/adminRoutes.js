import express from 'express';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getStudentsList,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.get('/students', getStudentsList);

export default router;
