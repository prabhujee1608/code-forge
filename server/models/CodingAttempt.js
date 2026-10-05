import mongoose from 'mongoose';

const codingAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProblem',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'javascript',
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Attempted'],
      default: 'Accepted',
    },
    passedCases: {
      type: Number,
      default: 1,
    },
    totalCases: {
      type: Number,
      default: 1,
    },
    executionTime: {
      type: String,
      default: '45 ms',
    },
    memory: {
      type: String,
      default: '14.2 MB',
    },
  },
  {
    timestamps: true,
  }
);

const CodingAttempt = mongoose.model('CodingAttempt', codingAttemptSchema);
export default CodingAttempt;
