import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'CS Fundamentals', 'Aptitude'],
      required: true,
    },
    topic: {
      type: String,
      required: true, // e.g. OOP, DBMS, OS, Networks, SQL, DSA, JavaScript, React, Node.js, HR Common
    },
    question: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    answer: {
      type: String,
      required: true,
    },
    importantConcepts: {
      type: [String],
      default: [],
    },
    userAnswers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        customAnswer: { type: String, default: '' },
        status: {
          type: String,
          enum: ['Not Started', 'Learning', 'Practicing', 'Completed'],
          default: 'Not Started',
        },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);
export default InterviewQuestion;
