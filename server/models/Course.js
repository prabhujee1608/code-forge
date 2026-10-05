import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  content: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: String, default: '15 mins' },
  order: { type: Number, required: true },
  resources: [{ title: String, url: String }],
  quiz: {
    title: String,
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number, // index 0-3
        explanation: String,
      },
    ],
  },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80' },
    category: { type: String, required: true, default: 'Web Development' },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    instructor: { type: String, default: 'CodeCareer Instructor' },
    duration: { type: String, default: '10 Hours' },
    published: { type: Boolean, default: true },
    rating: { type: Number, default: 4.9 },
    studentsEnrolled: { type: Number, default: 0 },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
