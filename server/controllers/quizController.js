import QuizAttempt from '../models/QuizAttempt.js';
import XPTransaction from '../models/XPTransaction.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { initialQuizzes } from '../data/quizzesData.js';

// @desc    Get all available quizzes
// @route   GET /api/quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const list = initialQuizzes.map((q, idx) => ({
      _id: `diagnostic-${idx}`,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      description: q.description,
      questionCount: q.questions.length,
      xpReward: q.questions.length * 10,
    }));

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sample quiz or lesson attached quiz
// @route   GET /api/quizzes/:id
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check pre-configured diagnostic quizzes
    if (id.startsWith('diagnostic-')) {
      const idx = parseInt(id.replace('diagnostic-', ''), 10);
      if (initialQuizzes[idx]) {
        return res.json({
          _id: id,
          title: initialQuizzes[idx].title,
          category: initialQuizzes[idx].category,
          description: initialQuizzes[idx].description,
          questions: initialQuizzes[idx].questions,
        });
      }
    }

    if (id === 'dsa') {
      return res.json({ _id: 'diagnostic-1', ...initialQuizzes[1] });
    }
    if (id === 'system-design') {
      return res.json({ _id: 'diagnostic-2', ...initialQuizzes[2] });
    }

    // Search inside courses for lesson with quiz
    const courses = await Course.find();
    let foundQuiz = null;

    for (const c of courses) {
      if (c.modules) {
        for (const m of c.modules) {
          if (m.lessons) {
            for (const l of m.lessons) {
              if ((l._id.toString() === id || l.slug === id) && l.quiz) {
                foundQuiz = {
                  _id: l._id,
                  courseId: c._id,
                  title: l.quiz.title || `${l.title} Quiz`,
                  questions: l.quiz.questions,
                };
                break;
              }
            }
          }
          if (foundQuiz) break;
        }
      }
      if (foundQuiz) break;
    }

    if (!foundQuiz) {
      // Default to first diagnostic quiz
      foundQuiz = {
        _id: id || 'diagnostic-0',
        ...initialQuizzes[0],
      };
    }

    res.json(foundQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz answers and score server-side
// @route   POST /api/quizzes/:id/submit
export const submitQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, quizTitle, courseId } = req.body;

    let totalQuestions = 3;
    let correctCount = 0;

    if (answers && Array.isArray(answers)) {
      answers.forEach((ans) => {
        if (ans.isCorrect) correctCount++;
      });
      totalQuestions = answers.length;
    }

    const percentage = Math.round((correctCount / Math.max(totalQuestions, 1)) * 100);
    const xpGained = correctCount * 10;

    let attempt = null;
    if (req.user) {
      attempt = await QuizAttempt.create({
        user: req.user._id,
        course: courseId || null,
        quizTitle: quizTitle || 'Full Stack Assessment Quiz',
        score: correctCount,
        totalQuestions,
        percentage,
      });

      // Award XP
      if (xpGained > 0) {
        await XPTransaction.create({
          user: req.user._id,
          amount: xpGained,
          reason: `Completed Quiz: ${quizTitle || 'Assessment'} (${percentage}%)`,
        });

        await User.findByIdAndUpdate(req.user._id, {
          $inc: { points: xpGained },
          $set: { 'streak.lastActiveDate': new Date() },
        });
      }
    }

    res.json({
      attemptId: attempt?._id,
      score: correctCount,
      totalQuestions,
      percentage,
      xpGained,
      passed: percentage >= 70,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
