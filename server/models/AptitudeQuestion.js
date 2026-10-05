import mongoose from 'mongoose';

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
      required: true,
    },
    topic: {
      type: String,
      required: true, // e.g., Percentages, Profit & Loss, Syllogisms, Blood Relations
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctOptionIndex: {
      type: Number,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

const AptitudeQuestion = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
export default AptitudeQuestion;
