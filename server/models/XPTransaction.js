import mongoose from 'mongoose';

const xpTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true }, // e.g. 'Lesson Completed', 'Quiz Completed', 'Coding Solved'
  },
  { timestamps: true }
);

export default mongoose.models.XPTransaction || mongoose.model('XPTransaction', xpTransactionSchema);
