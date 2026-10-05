import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    college: {
      type: String,
      default: '',
    },
    degree: {
      type: String,
      default: 'B.Tech',
    },
    branch: {
      type: String,
      default: 'Computer Science',
    },
    graduationYear: {
      type: Number,
      default: 2026,
    },
    currentYear: {
      type: String,
      default: '4th Year',
    },
    preferredRole: {
      type: String,
      enum: [
        'Full Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'Software Engineer',
        'Data Analyst',
        'Data Scientist',
      ],
      default: 'Full Stack Developer',
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    skills: {
      type: [String],
      default: ['React', 'Node.js', 'JavaScript', 'Python', 'DSA', 'SQL'],
    },
    programmingLanguages: {
      type: [String],
      default: ['JavaScript', 'Python', 'C++'],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    streak: {
      current: { type: Number, default: 1 },
      longest: { type: Number, default: 7 },
      lastActiveDate: { type: Date, default: Date.now },
    },
    points: {
      type: Number,
      default: 150,
    },
    isLeaderboardPublic: {
      type: Boolean,
      default: true,
    },
    codingProfiles: {
      leetcode: { type: String, default: 'alex_rivera' },
      codechef: { type: String, default: 'alex_r26' },
      codeforces: { type: String, default: 'arivera_cf' },
      hackerrank: { type: String, default: 'alex_rivera_hr' },
      geeksforgeeks: { type: String, default: 'alexrivera_gfg' },
    },
    codingStats: {
      leetcode: {
        username: { type: String, default: 'alex_rivera' },
        rating: { type: Number, default: 1845 },
        maxRating: { type: Number, default: 1910 },
        globalRank: { type: Number, default: 24150 },
        badge: { type: String, default: 'Knight' },
        totalSolved: { type: Number, default: 342 },
        easySolved: { type: Number, default: 145 },
        mediumSolved: { type: Number, default: 162 },
        hardSolved: { type: Number, default: 35 },
        activeDays: { type: Number, default: 184 },
      },
      codechef: {
        username: { type: String, default: 'alex_r26' },
        rating: { type: Number, default: 1720 },
        stars: { type: String, default: '3★' },
        globalRank: { type: Number, default: 8420 },
        totalSolved: { type: Number, default: 188 },
      },
      codeforces: {
        username: { type: String, default: 'arivera_cf' },
        rating: { type: Number, default: 1512 },
        maxRating: { type: Number, default: 1580 },
        title: { type: String, default: 'Specialist' },
        totalSolved: { type: Number, default: 210 },
      },
      geeksforgeeks: {
        username: { type: String, default: 'alexrivera_gfg' },
        codingScore: { type: Number, default: 620 },
        monthlyRank: { type: Number, default: 412 },
        totalSolved: { type: Number, default: 275 },
      },
      hackerrank: {
        username: { type: String, default: 'alex_rivera_hr' },
        badgesCount: { type: Number, default: 6 },
        starsProblemSolving: { type: Number, default: 5 },
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
