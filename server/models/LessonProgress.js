import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lessonId: { type: String, required: true },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
      default: 'NOT_STARTED',
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    timeSpentSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ user: 1, course: 1, lessonId: 1 }, { unique: true });

export default mongoose.models.LessonProgress || mongoose.model('LessonProgress', lessonProgressSchema);
