import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['CodingProblem', 'InterviewQuestion', 'AptitudeQuestion', 'Resource'],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    url: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
