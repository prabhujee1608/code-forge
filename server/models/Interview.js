import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
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
    interviewDate: {
      type: Date,
      required: [true, 'Interview date is required'],
    },
    interviewTime: {
      type: String,
      default: '10:00 AM',
    },
    interviewType: {
      type: String,
      enum: ['HR', 'Technical', 'Coding', 'System Design', 'Managerial', 'Behavioral', 'Final'],
      default: 'Technical',
    },
    interviewRound: {
      type: String,
      default: 'Round 1',
    },
    interviewer: {
      type: String,
      default: '',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
