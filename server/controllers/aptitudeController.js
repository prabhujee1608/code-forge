import AptitudeQuestion from '../models/AptitudeQuestion.js';
import AptitudeAttempt from '../models/AptitudeAttempt.js';

// @desc    Get aptitude questions by category
// @route   GET /api/aptitude
export const getAptitudeQuestions = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const questions = await AptitudeQuestion.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit aptitude test answers and score attempt
// @route   POST /api/aptitude/attempt
export const submitAptitudeAttempt = async (req, res) => {
  try {
    const { category, userAnswers } = req.body; // userAnswers: { questionId: selectedIndex }

    if (!userAnswers || typeof userAnswers !== 'object') {
      return res.status(400).json({ message: 'User answers object is required' });
    }

    const questionIds = Object.keys(userAnswers);
    const questions = await AptitudeQuestion.find({ _id: { $in: questionIds } });

    let correctCount = 0;
    const results = questions.map((q) => {
      const selectedIndex = userAnswers[q._id.toString()];
      const isCorrect = selectedIndex === q.correctOptionIndex;
      if (isCorrect) correctCount += 1;

      return {
        questionId: q._id,
        question: q.question,
        options: q.options,
        selectedIndex,
        correctIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = questions.length || 1;
    const accuracy = Number(((correctCount / totalQuestions) * 100).toFixed(1));
    const score = correctCount * 10;

    const attempt = await AptitudeAttempt.create({
      user: req.user._id,
      category: category || 'General Aptitude',
      totalQuestions,
      correctAnswers: correctCount,
      score,
      accuracy,
    });

    res.json({
      attempt,
      results,
      summary: {
        totalQuestions,
        correctCount,
        score,
        accuracy,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user aptitude history
// @route   GET /api/aptitude/history
export const getAptitudeHistory = async (req, res) => {
  try {
    const history = await AptitudeAttempt.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create aptitude question (Admin)
// @route   POST /api/aptitude
export const createAptitudeQuestion = async (req, res) => {
  try {
    const { category, topic, question, options, correctOptionIndex, explanation, difficulty } = req.body;

    if (!category || !question || !options || correctOptionIndex === undefined) {
      return res.status(400).json({ message: 'Category, question, options, and correct index are required' });
    }

    const newQuestion = await AptitudeQuestion.create({
      category,
      topic: topic || 'General',
      question,
      options: Array.isArray(options) ? options : [],
      correctOptionIndex: Number(correctOptionIndex),
      explanation: explanation || '',
      difficulty: difficulty || 'Medium',
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
