import mongoose from 'mongoose';

const studyTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Coding', 'Interview', 'Aptitude', 'Project', 'General'],
      default: 'Coding',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const StudyTask = mongoose.model('StudyTask', studyTaskSchema);
export default StudyTask;
