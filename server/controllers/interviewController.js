import InterviewQuestion from '../models/InterviewQuestion.js';

// @desc    Get all interview questions filtered by category and topic
// @route   GET /api/interviews
export const getInterviewQuestions = async (req, res) => {
  try {
    const { category, topic, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (topic) query.topic = topic;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }

    const questions = await InterviewQuestion.find(query).sort({ createdAt: -1 });

    // Enrich with user's saved answer & status if authenticated
    const enriched = questions.map((q) => {
      const qObj = q.toObject();
      const userAns = qObj.userAnswers?.find((ua) => ua.user?.toString() === req.user._id.toString());

      return {
        ...qObj,
        customAnswer: userAns?.customAnswer || '',
        status: userAns?.status || 'Not Started',
      };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/update user's custom answer and status for interview question
// @route   POST /api/interviews/:id/answer
export const saveUserAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { customAnswer, status } = req.body;

    const question = await InterviewQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Interview question not found' });
    }

    const existingIdx = question.userAnswers.findIndex(
      (ua) => ua.user.toString() === req.user._id.toString()
    );

    if (existingIdx > -1) {
      if (customAnswer !== undefined) question.userAnswers[existingIdx].customAnswer = customAnswer;
      if (status !== undefined) question.userAnswers[existingIdx].status = status;
      question.userAnswers[existingIdx].updatedAt = Date.now();
    } else {
      question.userAnswers.push({
        user: req.user._id,
        customAnswer: customAnswer || '',
        status: status || 'Learning',
        updatedAt: Date.now(),
      });
    }

    await question.save();
    res.json({ message: 'Answer updated successfully', questionId: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create interview question (Admin)
// @route   POST /api/interviews
export const createInterviewQuestion = async (req, res) => {
  try {
    const { category, topic, question, difficulty, answer, importantConcepts } = req.body;

    if (!category || !topic || !question || !answer) {
      return res.status(400).json({ message: 'Category, topic, question and answer are required' });
    }

    const newQuestion = await InterviewQuestion.create({
      category,
      topic,
      question,
      difficulty: difficulty || 'Medium',
      answer,
      importantConcepts: Array.isArray(importantConcepts) ? importantConcepts : [],
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview question (Admin)
// @route   PUT /api/interviews/:id
export const updateInterviewQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Interview question not found' });
    }

    const fields = ['category', 'topic', 'question', 'difficulty', 'answer', 'importantConcepts'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        question[field] = req.body[field];
      }
    });

    const updated = await question.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete interview question (Admin)
// @route   DELETE /api/interviews/:id
export const deleteInterviewQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
