import mongoose from 'mongoose';

const aptitudeAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AptitudeAttempt = mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);
export default AptitudeAttempt;
