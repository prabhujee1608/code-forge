import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import LessonProgress from '../models/LessonProgress.js';

// @desc    Get all courses with optional category filter
// @route   GET /api/courses
export const getCourses = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });

    // If authenticated student, attach enrollment status & progress
    let enrollmentsMap = {};
    if (req.user) {
      const enrollments = await Enrollment.find({ user: req.user._id });
      enrollments.forEach((e) => {
        if (e.course) {
          enrollmentsMap[e.course.toString()] = e;
        }
      });
    }

    const formattedCourses = courses.map((course) => {
      let totalLessons = 0;
      if (course.modules) {
        course.modules.forEach((mod) => {
          totalLessons += mod.lessons ? mod.lessons.length : 0;
        });
      }

      const enrollment = enrollmentsMap[course._id.toString()];

      return {
        _id: course._id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        difficulty: course.difficulty,
        instructor: course.instructor,
        duration: course.duration,
        rating: course.rating,
        totalLessons,
        modulesCount: course.modules ? course.modules.length : 0,
        isEnrolled: !!enrollment,
        progress: enrollment ? enrollment.progress : 0,
        lastLessonId: enrollment ? enrollment.lastLessonId : null,
      };
    });

    res.json(formattedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID or Slug with student progress
// @route   GET /api/courses/:id
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    let course = await Course.findById(id);

    if (!course) {
      course = await Course.findOne({ slug: id });
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check enrollment
    let enrollment = null;
    let completedLessonIds = [];

    if (req.user) {
      enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
      const completedProgress = await LessonProgress.find({
        user: req.user._id,
        course: course._id,
        status: 'COMPLETED',
      });
      completedLessonIds = completedProgress.map((lp) => lp.lessonId);
    }

    // Calculate total lessons
    let totalLessons = 0;
    const modulesWithStatus = (course.modules || []).map((mod) => {
      const lessons = (mod.lessons || []).map((les) => {
        totalLessons++;
        const isCompleted = completedLessonIds.includes(les._id.toString());
        return {
          _id: les._id,
          title: les.title,
          slug: les.slug,
          duration: les.duration,
          order: les.order,
          isCompleted,
          hasQuiz: !!(les.quiz && les.quiz.questions && les.quiz.questions.length > 0),
        };
      });
      return {
        _id: mod._id,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons,
      };
    });

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

    res.json({
      _id: course._id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category,
      difficulty: course.difficulty,
      instructor: course.instructor,
      duration: course.duration,
      rating: course.rating,
      totalLessons,
      completedLessonsCount: completedLessonIds.length,
      progressPercentage,
      isEnrolled: !!enrollment,
      lastLessonId: enrollment ? enrollment.lastLessonId : null,
      modules: modulesWithStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll student in course
// @route   POST /api/courses/:id/enroll
export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });

    if (!enrollment) {
      // Find first lesson ID
      let firstLessonId = null;
      if (course.modules && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
        firstLessonId = course.modules[0].lessons[0]._id.toString();
      }

      enrollment = await Enrollment.create({
        user: req.user._id,
        course: courseId,
        progress: 0,
        lastLessonId: firstLessonId,
      });

      // Increment student count
      course.studentsEnrolled += 1;
      await course.save();
    }

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course progress calculation
// @route   GET /api/courses/:id/progress
export const getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let totalLessons = 0;
    if (course.modules) {
      course.modules.forEach((mod) => {
        totalLessons += mod.lessons ? mod.lessons.length : 0;
      });
    }

    const completedProgress = await LessonProgress.find({
      user: req.user._id,
      course: courseId,
      status: 'COMPLETED',
    });

    const completedLessons = completedProgress.length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });

    res.json({
      courseId,
      totalLessons,
      completedLessons,
      progress,
      lastLessonId: enrollment ? enrollment.lastLessonId : null,
      status: progress === 100 ? 'COMPLETED' : 'IN_PROGRESS',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
