import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { initialCourses } from '../data/coursesData.js';
import { initialCodingProblems } from '../data/codingProblemsData.js';

const autoSeedCodeCareer = async () => {
  try {
    const User = (await import('../models/User.js')).default;
    const Course = (await import('../models/Course.js')).default;
    const Enrollment = (await import('../models/Enrollment.js')).default;
    const LessonProgress = (await import('../models/LessonProgress.js')).default;
    const CodingProblem = (await import('../models/CodingProblem.js')).default;
    const CodingSubmission = (await import('../models/CodingSubmission.js')).default;
    const QuizAttempt = (await import('../models/QuizAttempt.js')).default;

    console.log('[CodeForge DB] Checking database courses and coding problems...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const adminHashed = await bcrypt.hash('admin123', salt);

    // 1. Student demo user
    let student = await User.findOne({ email: 'alex.rivera@university.edu' });
    if (!student) {
      student = await User.create({
        name: 'Alex Rivera',
        email: 'alex.rivera@university.edu',
        password: hashedPassword,
        role: 'student',
        college: 'Stanford University',
        degree: 'Bachelor of Science',
        branch: 'Computer Science',
        graduationYear: 2026,
        preferredRole: 'Full Stack Developer',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Algorithms'],
        streak: { current: 14, longest: 21, lastActiveDate: new Date() },
        points: 1420,
        codingProfiles: {
          leetcode: 'alex_rivera',
          codechef: 'alex_r26',
          codeforces: 'arivera_cf',
          hackerrank: 'alex_rivera_hr',
          geeksforgeeks: 'alexrivera_gfg',
        },
      });
      console.log('✅ Student demo user initialized (alex.rivera@university.edu)');
    }

    // 2. Admin user
    let adminUser = await User.findOne({ email: 'admin@codecareer.dev' });
    if (!adminUser) {
      await User.create({
        name: 'Platform Admin',
        email: 'admin@codecareer.dev',
        password: adminHashed,
        role: 'admin',
        college: 'CodeForge HQ',
      });
      console.log('✅ Admin demo user initialized (admin@codecareer.dev)');
    }

    // 3. Seed / Synchronize 10 In-depth Courses
    const courseCount = await Course.countDocuments();
    if (courseCount < initialCourses.length) {
      console.log(`[CodeForge DB] Upgrading courses catalog to ${initialCourses.length} comprehensive courses...`);
      for (const courseData of initialCourses) {
        await Course.findOneAndUpdate(
          { slug: courseData.slug },
          { $set: courseData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`✅ Synchronized ${initialCourses.length} complete curriculum courses!`);
    }

    // 4. Seed / Synchronize 30 Production Coding Problems
    const problemCount = await CodingProblem.countDocuments();
    if (problemCount < initialCodingProblems.length) {
      console.log(`[CodeForge DB] Upgrading coding problem bank to ${initialCodingProblems.length} challenges...`);
      for (const problemData of initialCodingProblems) {
        await CodingProblem.findOneAndUpdate(
          { slug: problemData.slug },
          { $set: problemData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      console.log(`✅ Synchronized ${initialCodingProblems.length} production coding problems!`);
    }

    // 5. Seed Realistic Enrollments & Lesson Progress
    if (student) {
      const allCourses = await Course.find();
      for (let i = 0; i < Math.min(allCourses.length, 4); i++) {
        const c = allCourses[i];
        let existingEnrollment = await Enrollment.findOne({ user: student._id, course: c._id });
        if (!existingEnrollment) {
          const firstLessonId = c.modules?.[0]?.lessons?.[0]?._id?.toString() || 'lesson-1';
          const progressVal = i === 0 ? 80 : i === 1 ? 65 : i === 2 ? 40 : 15;
          await Enrollment.create({
            user: student._id,
            course: c._id,
            status: progressVal >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
            progress: progressVal,
            lastLessonId: firstLessonId,
          });

          // Seed completed lesson progress
          if (c.modules?.[0]?.lessons) {
            for (const les of c.modules[0].lessons) {
              await LessonProgress.findOneAndUpdate(
                { user: student._id, course: c._id, lessonId: les._id.toString() },
                { status: 'COMPLETED', completedAt: new Date() },
                { upsert: true }
              );
            }
          }
        }
      }

      // 6. Seed Coding Submissions
      const subCount = await CodingSubmission.countDocuments({ user: student._id });
      if (subCount < 10) {
        const sampleProblems = await CodingProblem.find().limit(12);
        for (const prob of sampleProblems) {
          await CodingSubmission.create({
            user: student._id,
            problem: prob._id,
            language: 'javascript',
            code: prob.starterCode?.javascript || 'function solution() {}',
            status: 'Accepted',
            runtime: `${Math.floor(Math.random() * 15) + 8}ms`,
            memory: '4.2MB',
            passedTestCases: 3,
            totalTestCases: 3,
          });
        }
        console.log('✅ Seeded student coding problem submissions.');
      }

      // 7. Seed Sample Quiz Attempts
      const quizCount = await QuizAttempt.countDocuments({ user: student._id });
      if (quizCount < 3) {
        await QuizAttempt.create({
          user: student._id,
          quizTitle: 'Full Stack Development Assessment',
          score: 5,
          totalQuestions: 5,
          percentage: 100,
          completedAt: new Date(Date.now() - 86400000),
        });
        await QuizAttempt.create({
          user: student._id,
          quizTitle: 'Data Structures & Algorithms Diagnostic',
          score: 4,
          totalQuestions: 5,
          percentage: 80,
          completedAt: new Date(Date.now() - 172800000),
        });
        console.log('✅ Seeded sample quiz attempts.');
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codecareer';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
    await autoSeedCodeCareer();
  } catch (error) {
    console.warn(`[MongoDB] Could not connect to local/URI database (${error.message}). Starting disk-backed MongoDB database...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const path = await import('path');
      const fs = await import('fs');

      const dbDir = path.resolve(process.cwd(), 'data', 'db');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      const mongod = await MongoMemoryServer.create({
        instance: { dbPath: dbDir, storageEngine: 'wiredTiger' },
      });
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[MongoDB] Persistent Database initialized successfully at ${dbDir}`);
      await autoSeedCodeCareer();
    } catch (err) {
      console.error('[MongoDB] Fatal error initializing persistent database:', err.message);
    }
  }
};

export default connectDB;
