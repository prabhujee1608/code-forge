import Course from '../models/Course.js';
import LessonProgress from '../models/LessonProgress.js';
import Enrollment from '../models/Enrollment.js';
import XPTransaction from '../models/XPTransaction.js';
import User from '../models/User.js';

// @desc    Get lesson content and navigation
// @route   GET /api/courses/:courseId/lessons/:lessonId
export const getLessonById = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find lesson and module position
    let targetLesson = null;
    let targetModule = null;
    let allLessonsFlat = [];

    course.modules.forEach((mod) => {
      mod.lessons.forEach((les) => {
        allLessonsFlat.push({
          ...les.toObject(),
          moduleId: mod._id,
          moduleTitle: mod.title,
        });
        if (les._id.toString() === lessonId || les.slug === lessonId) {
          targetLesson = les;
          targetModule = mod;
        }
      });
    });

    if (!targetLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Calculate previous & next lesson IDs
    const currentIndex = allLessonsFlat.findIndex(
      (l) => l._id.toString() === targetLesson._id.toString()
    );

    const prevLesson = currentIndex > 0 ? allLessonsFlat[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessonsFlat.length - 1 ? allLessonsFlat[currentIndex + 1] : null;

    // Check progress
    let progressRecord = null;
    if (req.user) {
      progressRecord = await LessonProgress.findOne({
        user: req.user._id,
        course: course._id,
        lessonId: targetLesson._id.toString(),
      });

      if (!progressRecord) {
        progressRecord = await LessonProgress.create({
          user: req.user._id,
          course: course._id,
          lessonId: targetLesson._id.toString(),
          status: 'IN_PROGRESS',
        });
      }

      // Update enrollment last view
      await Enrollment.findOneAndUpdate(
        { user: req.user._id, course: course._id },
        { lastLessonId: targetLesson._id.toString(), lastViewedAt: new Date() },
        { upsert: true }
      );
    }

    res.json({
      course: {
        _id: course._id,
        title: course.title,
      },
      module: {
        _id: targetModule._id,
        title: targetModule.title,
      },
      lesson: targetLesson,
      isCompleted: progressRecord ? progressRecord.status === 'COMPLETED' : false,
      prevLessonId: prevLesson ? prevLesson._id : null,
      nextLessonId: nextLesson ? nextLesson._id : null,
      totalLessons: allLessonsFlat.length,
      currentLessonNumber: currentIndex + 1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark lesson completed
// @route   POST /api/lessons/:id/complete
export const completeLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let progress = await LessonProgress.findOne({
      user: req.user._id,
      course: courseId,
      lessonId,
    });

    const isFirstTime = !progress || progress.status !== 'COMPLETED';

    if (!progress) {
      progress = new LessonProgress({
        user: req.user._id,
        course: courseId,
        lessonId,
        status: 'COMPLETED',
        completedAt: new Date(),
      });
    } else {
      progress.status = 'COMPLETED';
      progress.completedAt = new Date();
    }
    await progress.save();

    // Recalculate Course Progress Percentage
    let totalLessons = 0;
    course.modules.forEach((m) => {
      totalLessons += m.lessons.length;
    });

    const completedCount = await LessonProgress.countDocuments({
      user: req.user._id,
      course: courseId,
      status: 'COMPLETED',
    });

    const newPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const isCourseFinished = newPercentage === 100;

    await Enrollment.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      {
        progress: newPercentage,
        status: isCourseFinished ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isCourseFinished ? new Date() : null,
      },
      { upsert: true }
    );

    // Award +10 XP if first time completed
    if (isFirstTime) {
      await XPTransaction.create({
        user: req.user._id,
        amount: 10,
        reason: 'Completed Lesson',
      });

      // Update User streak & total XP
      const userDoc = await User.findById(req.user._id);
      if (userDoc) {
        userDoc.points += 10;
        
        // Handle streak logic
        const now = new Date();
        const lastActive = userDoc.streak?.lastActiveDate ? new Date(userDoc.streak.lastActiveDate) : null;
        
        if (!lastActive) {
          userDoc.streak = { current: 1, longest: 1, lastActiveDate: now };
        } else {
          const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            userDoc.streak.current += 1;
            if (userDoc.streak.current > userDoc.streak.longest) {
              userDoc.streak.longest = userDoc.streak.current;
            }
          } else if (diffDays > 1) {
            userDoc.streak.current = 1;
          }
          userDoc.streak.lastActiveDate = now;
        }

        await userDoc.save();
      }
    }

    res.json({
      message: 'Lesson completed successfully',
      progress: newPercentage,
      xpGained: isFirstTime ? 10 : 0,
      completedLessons: completedCount,
      totalLessons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
