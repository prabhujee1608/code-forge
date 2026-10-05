import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED'],
      default: 'IN_PROGRESS',
    },
    progress: { type: Number, default: 0 }, // 0 to 100 percentage
    lastLessonId: { type: String },
    lastViewedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
