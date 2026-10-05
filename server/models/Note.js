import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['CodingProblem', 'InterviewQuestion', 'DSATopic', 'General'],
      default: 'General',
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;
