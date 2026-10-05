import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position title is required'],
      trim: true,
    },
    url: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote',
    },
    type: {
      type: String,
      enum: ['Job', 'Internship'],
      default: 'Job',
    },
    salary: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
    },
    skills: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const SavedJob = mongoose.model('SavedJob', savedJobSchema);
export default SavedJob;
