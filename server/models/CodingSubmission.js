import mongoose from 'mongoose';

const codingSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
    language: { type: String, required: true, default: 'javascript' },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
      required: true,
    },
    runtime: { type: String, default: '12ms' },
    memory: { type: String, default: '4.2MB' },
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.CodingSubmission || mongoose.model('CodingSubmission', codingSubmissionSchema);
