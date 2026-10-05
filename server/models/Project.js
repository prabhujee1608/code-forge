import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed', 'Deployed'],
      default: 'In Progress',
    },
    role: {
      type: String,
      default: 'Full Stack Developer',
    },
    features: {
      type: [String],
      default: [],
    },
    readinessScore: {
      type: Number,
      default: 85,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
