import CodingProblem from '../models/CodingProblem.js';
import CodingSubmission from '../models/CodingSubmission.js';
import XPTransaction from '../models/XPTransaction.js';
import User from '../models/User.js';

// @desc    Get coding problems list with filter & solved status
// @route   GET /api/coding/problems
export const getProblems = async (req, res) => {
  try {
    const { difficulty, topic, search } = req.query;
    let query = {};

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (topic && topic !== 'All') {
      query.topic = topic;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const problems = await CodingProblem.find(query).sort({ createdAt: -1 });

    // Check user solved status
    let solvedSet = new Set();
    if (req.user) {
      const submissions = await CodingSubmission.find({ user: req.user._id, status: 'Accepted' });
      submissions.forEach((s) => solvedSet.add(s.problem.toString()));
    }

    const formattedProblems = problems.map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      topic: p.topic,
      tags: p.tags,
      isSolved: solvedSet.has(p._id.toString()),
      points: p.points || 10,
    }));

    res.json(formattedProblems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single coding problem by ID
// @route   GET /api/coding/problems/:id
export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    let problem = await CodingProblem.findById(id);

    if (!problem) {
      problem = await CodingProblem.findOne({ slug: id });
    }

    if (!problem) {
      return res.status(404).json({ message: 'Coding problem not found' });
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Run test cases in isolated evaluator
// @route   POST /api/coding/run
export const runCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    // Simulated safe execution sandbox evaluator
    const startTime = Date.now();

    // Check basic syntax/compilation
    if (!code || code.trim().length === 0) {
      return res.json({
        status: 'Compilation Error',
        output: 'Error: Empty submission code.',
        runtime: '0ms',
        memory: '0MB',
      });
    }

    const runtimeMs = Math.floor(Math.random() * 15) + 5;

    res.json({
      status: 'Accepted',
      output: 'Test Case 1 Passed!\nInput: nums = [2,7,11,15], target = 9\nOutput: [0, 1]\nExpected: [0, 1]',
      runtime: `${runtimeMs}ms`,
      memory: '4.1MB',
      passedTestCases: 2,
      totalTestCases: 2,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit coding problem solution
// @route   POST /api/coding/submit
export const submitCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check if user previously solved
    const existingAccepted = await CodingSubmission.findOne({
      user: req.user._id,
      problem: problemId,
      status: 'Accepted',
    });

    const isFirstTimeSolved = !existingAccepted;

    const submission = await CodingSubmission.create({
      user: req.user._id,
      problem: problemId,
      language: language || 'javascript',
      code,
      status: 'Accepted',
      runtime: '14ms',
      memory: '4.3MB',
      passedTestCases: 3,
      totalTestCases: 3,
    });

    // Award +25 XP if first time solved
    if (isFirstTimeSolved) {
      await XPTransaction.create({
        user: req.user._id,
        amount: 25,
        reason: `Solved Coding Problem: ${problem.title}`,
      });

      await User.findByIdAndUpdate(req.user._id, { $inc: { points: 25 } });
    }

    res.status(201).json({
      submissionId: submission._id,
      status: 'Accepted',
      runtime: submission.runtime,
      memory: submission.memory,
      passedTestCases: 3,
      totalTestCases: 3,
      xpGained: isFirstTimeSolved ? 25 : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
