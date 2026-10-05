import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
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
      required: [true, 'Job/Internship position title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Job', 'Internship'],
      default: 'Job',
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
    jobUrl: {
      type: String,
      default: '',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    salary: {
      type: String,
      default: '',
    },
    hrName: {
      type: String,
      default: '',
    },
    hrEmail: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    resumeVersion: {
      type: String,
      default: 'General V1',
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
