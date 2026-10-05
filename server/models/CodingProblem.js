import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' },
});

const codingProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    statement: {
      type: String,
      required: [true, 'Problem statement is required'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    topic: {
      type: String,
      enum: [
        'Arrays',
        'Strings',
        'Linked List',
        'Stack',
        'Queue',
        'Binary Search',
        'Sorting',
        'Hashing',
        'Recursion',
        'Backtracking',
        'Trees',
        'BST',
        'Heap',
        'Graph',
        'Dynamic Programming',
        'Greedy',
        'Bit Manipulation',
      ],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    constraints: {
      type: [String],
      default: [],
    },
    examples: [exampleSchema],
    expectedInput: {
      type: String,
      default: '',
    },
    expectedOutput: {
      type: String,
      default: '',
    },
    hints: {
      type: [String],
      default: [],
    },
    starterCode: {
      javascript: { type: String, default: 'function solution(input) {\n  // Write your code here\n}' },
      python: { type: String, default: 'def solution(input):\n    # Write your code here\n    pass' },
      cpp: { type: String, default: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}' },
      java: { type: String, default: 'public class Solution {\n    public static void main(String[] args) {\n    }\n}' },
    },
    solution: {
      explanation: { type: String, default: '' },
      code: { type: String, default: '' },
      complexity: { type: String, default: '' },
    },
    points: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);
export default CodingProblem;
