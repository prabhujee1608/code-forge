import mongoose from 'mongoose';

const phaseSchema = new mongoose.Schema({
  phaseNumber: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  topics: { type: [String], default: [] },
  completed: { type: Boolean, default: false },
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    },
    phases: [phaseSchema],
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
