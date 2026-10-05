import CodingProblem from '../models/CodingProblem.js';
import CodingAttempt from '../models/CodingAttempt.js';
import Bookmark from '../models/Bookmark.js';

// Helper slug generator
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// @desc    Get coding problems list with filters (topic, difficulty, search)
// @route   GET /api/problems
export const getProblems = async (req, res) => {
  try {
    const { topic, difficulty, search } = req.query;
    const query = {};

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const problems = await CodingProblem.find(query).sort({ createdAt: -1 });

    // Attach solved status & bookmark status if authenticated
    let solvedProblemIds = new Set();
    let bookmarkedIds = new Set();

    if (req.user) {
      const acceptedAttempts = await CodingAttempt.find({
        user: req.user._id,
        status: 'Accepted',
      }).distinct('problem');
      solvedProblemIds = new Set(acceptedAttempts.map((id) => id.toString()));

      const bookmarks = await Bookmark.find({
        user: req.user._id,
        itemType: 'CodingProblem',
      }).select('itemId');
      bookmarkedIds = new Set(bookmarks.map((b) => b.itemId?.toString()));
    }

    const enrichedProblems = problems.map((p) => ({
      ...p.toObject(),
      isSolved: solvedProblemIds.has(p._id.toString()),
      isBookmarked: bookmarkedIds.has(p._id.toString()),
    }));

    res.json(enrichedProblems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single problem by ID or slug
// @route   GET /api/problems/:id
export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    let problem = await CodingProblem.findById(id).catch(() => null);

    if (!problem) {
      problem = await CodingProblem.findOne({ slug: id });
    }

    if (!problem) {
      return res.status(404).json({ message: 'Coding problem not found' });
    }

    let isSolved = false;
    let isBookmarked = false;

    if (req.user) {
      const accepted = await CodingAttempt.findOne({
        user: req.user._id,
        problem: problem._id,
        status: 'Accepted',
      });
      isSolved = !!accepted;

      const bookmark = await Bookmark.findOne({
        user: req.user._id,
        itemType: 'CodingProblem',
        itemId: problem._id,
      });
      isBookmarked = !!bookmark;
    }

    res.json({
      ...problem.toObject(),
      isSolved,
      isBookmarked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create coding problem (Admin)
// @route   POST /api/problems
export const createProblem = async (req, res) => {
  try {
    const { title, statement, difficulty, topic, tags, constraints, examples, expectedInput, expectedOutput, hints, starterCode, solution, points } = req.body;

    if (!title || !statement || !topic) {
      return res.status(400).json({ message: 'Title, statement, and topic are required' });
    }

    const slug = createSlug(title);

    const problem = await CodingProblem.create({
      title,
      slug,
      statement,
      difficulty: difficulty || 'Easy',
      topic,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      constraints: Array.isArray(constraints) ? constraints : [],
      examples: Array.isArray(examples) ? examples : [],
      expectedInput: expectedInput || '',
      expectedOutput: expectedOutput || '',
      hints: Array.isArray(hints) ? hints : hints ? hints.split(',').map((h) => h.trim()) : [],
      starterCode: starterCode || {},
      solution: solution || {},
      points: points || (difficulty === 'Hard' ? 30 : difficulty === 'Medium' ? 20 : 10),
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update coding problem (Admin)
// @route   PUT /api/problems/:id
export const updateProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const fields = [
      'title',
      'statement',
      'difficulty',
      'topic',
      'constraints',
      'examples',
      'expectedInput',
      'expectedOutput',
      'starterCode',
      'solution',
      'points',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        problem[field] = req.body[field];
      }
    });

    if (req.body.title) {
      problem.slug = createSlug(req.body.title);
    }
    if (req.body.tags) {
      problem.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(',').map((t) => t.trim());
    }
    if (req.body.hints) {
      problem.hints = Array.isArray(req.body.hints)
        ? req.body.hints
        : req.body.hints.split(',').map((h) => h.trim());
    }

    const updated = await problem.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete coding problem (Admin)
// @route   DELETE /api/problems/:id
export const deleteProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
