import Course from '../models/Course.js';
import User from '../models/User.js';
import CodingProblem from '../models/CodingProblem.js';

// @desc    Admin: Create new course with modules & lessons
// @route   POST /api/admin/courses
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, thumbnail, duration, instructor, modules } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const course = await Course.create({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      category: category || 'Web Development',
      difficulty: difficulty || 'Beginner',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      duration: duration || '10 Hours',
      instructor: instructor || req.user.name,
      modules: modules || [
        {
          title: 'Module 1: Fundamentals',
          description: 'Getting started with core concepts',
          order: 1,
          lessons: [
            {
              title: 'Introduction & Setup',
              slug: 'intro-setup',
              description: 'Environment setup and initial concepts',
              content: 'Welcome to this course! In this lesson we cover basic setup.',
              duration: '15 mins',
              order: 1,
            },
          ],
        },
      ],
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Update course details
// @route   PUT /api/admin/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Delete course
// @route   DELETE /api/admin/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get list of registered students
// @route   GET /api/admin/students
export const getStudentsList = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
