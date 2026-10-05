import mongoose from 'mongoose';

const performanceLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    activityType: {
      type: String,
      enum: ['coding', 'lesson', 'quiz', 'study_session', 'interview_prep'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
    },
    score: {
      type: Number,
    },
    xpEarned: {
      type: Number,
      default: 20,
    },
    category: {
      type: String,
      default: 'General',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

performanceLogSchema.index({ user: 1, loggedAt: -1 });

export default mongoose.models.PerformanceLog || mongoose.model('PerformanceLog', performanceLogSchema);
