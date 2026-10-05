import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import LessonProgress from '../models/LessonProgress.js';
import CodingProblem from '../models/CodingProblem.js';

dotenv.config();

const seed = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codecareer';
    try {
      await mongoose.connect(connStr);
    } catch {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const path = await import('path');
      const fs = await import('fs');
      const dbDir = path.resolve(process.cwd(), 'data', 'db');
      const mongod = await MongoMemoryServer.create({
        instance: { dbPath: dbDir, storageEngine: 'wiredTiger' },
      });
      await mongoose.connect(mongod.getUri());
    }

    console.log('Clearing old collections for fresh learning platform seed...');
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await LessonProgress.deleteMany();
    await CodingProblem.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const adminHashed = await bcrypt.hash('admin123', salt);

    // Student demo user
    const student = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      password: hashedPassword,
      role: 'student',
      college: 'Stanford University',
      degree: 'Bachelor of Science',
      branch: 'Computer Science',
      graduationYear: 2026,
      preferredRole: 'Full Stack Developer',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
      streak: { current: 12, longest: 18, lastActiveDate: new Date() },
      points: 1250,
    });

    // Admin user
    await User.create({
      name: 'Platform Admin',
      email: 'admin@codecareer.dev',
      password: adminHashed,
      role: 'admin',
      college: 'CodeCareer HQ',
    });

    // Seed 6 Courses
    const courses = await Course.insertMany([
      {
        title: 'Full Stack Web Development',
        slug: 'full-stack-web-development',
        description: 'Master frontend, backend, database design, and REST APIs from scratch with React, Node.js, and MongoDB.',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        category: 'Web Development',
        difficulty: 'Intermediate',
        instructor: 'Alex Rivera (Senior Architect)',
        duration: '32 Hours',
        rating: 4.9,
        studentsEnrolled: 1420,
        published: true,
        modules: [
          {
            title: 'Module 1: Modern React & Components',
            description: 'Component lifecycle, JSX, props, state, and hooks.',
            order: 1,
            lessons: [
              {
                title: 'Understanding React Components',
                slug: 'understanding-react-components',
                description: 'Learn how to build reusable, composable functional components in React.',
                content: `### React Component Architecture\n\nReact applications are built out of isolated pieces of code called **components**. A React component is a JavaScript function that returns markup:\n\n\`\`\`jsx\nexport function WelcomeBanner({ username }) {\n  return (\n    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white">\n      <h1 className="text-2xl font-bold">Good morning, {username}! 👋</h1>\n      <p className="text-slate-400">Continue your full stack development journey.</p>\n    </div>\n  );\n}\n\`\`\`\n\n#### Key Principles:\n- **Reusability**: Use components across different views.\n- **Unidirectional Data Flow**: Data flows down via props.\n- **Declarative UI**: Describe what UI should look like for a given state.`,
                videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
                duration: '18 mins',
                order: 1,
                resources: [
                  { title: 'Official React Docs', url: 'https://react.dev' },
                  { title: 'Component Starter Template', url: 'https://github.com' },
                ],
                quiz: {
                  title: 'React Components Quiz',
                  questions: [
                    {
                      question: 'What is a React component fundamentally?',
                      options: ['A database schema', 'A JavaScript function returning JSX', 'A CSS preprocessor', 'A WebAssembly binary'],
                      correctAnswer: 1,
                      explanation: 'Functional components in React are pure functions returning JSX elements.',
                    },
                    {
                      question: 'How do parent components pass data down to children?',
                      options: ['Via global window variables', 'Via Props', 'Via Redux actions only', 'Via HTML attributes'],
                      correctAnswer: 1,
                      explanation: 'Props are used to pass read-only data from parent to child components.',
                    },
                  ],
                },
              },
              {
                title: 'React Hooks: useState & useEffect',
                slug: 'react-hooks-usestate-useeffect',
                description: 'Master state management and asynchronous side-effects.',
                content: `### React State & Side Effects\n\nState allows React components to remember information between renders. \`useState\` declares state variables, while \`useEffect\` manages asynchronous side-effects.\n\n\`\`\`jsx\nimport React, { useState, useEffect } from 'react';\n\nexport function ProgressTracker() {\n  const [progress, setProgress] = useState(0);\n\n  useEffect(() => {\n    fetch('/api/progress')\n      .then(res => res.json())\n      .then(data => setProgress(data.overallProgress));\n  }, []);\n\n  return <div className="text-cyan-400 font-bold">Progress: {progress}%</div>;\n}\n\`\`\`\n`,
                duration: '22 mins',
                order: 2,
              },
            ],
          },
        ],
      },
      {
        title: 'JavaScript Fundamentals',
        slug: 'javascript-fundamentals',
        description: 'Learn modern ES6+ JavaScript, closures, event loops, async/await, and DOM manipulation.',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80',
        category: 'Programming Languages',
        difficulty: 'Beginner',
        instructor: 'Sarah Chen',
        duration: '16 Hours',
        rating: 4.8,
        studentsEnrolled: 2310,
        published: true,
        modules: [
          {
            title: 'Module 1: ES6+ Syntax & Data Types',
            description: 'Variables, arrow functions, destructuring, and spread operators.',
            order: 1,
            lessons: [
              {
                title: 'Variables: let, const, and var',
                slug: 'variables-let-const-var',
                description: 'Understand block scoping, hoisting, and mutability.',
                content: 'Scope determines variable visibility. Use `const` by default, `let` for reassignable variables, and avoid `var`.',
                duration: '12 mins',
                order: 1,
              },
            ],
          },
        ],
      },
      {
        title: 'React Development Mastery',
        slug: 'react-development-mastery',
        description: 'Deep dive into React 19, Server Components, Custom Hooks, and State Management.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
        category: 'Web Development',
        difficulty: 'Intermediate',
        instructor: 'David Miller',
        duration: '20 Hours',
        rating: 4.9,
        studentsEnrolled: 1890,
        published: true,
        modules: [],
      },
      {
        title: 'Python Programming Essentials',
        slug: 'python-programming-essentials',
        description: 'Master Python 3 syntax, Object-Oriented Programming, file handling, and scripts.',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
        category: 'Programming',
        difficulty: 'Beginner',
        instructor: 'Dr. Michael Vance',
        duration: '14 Hours',
        rating: 4.7,
        studentsEnrolled: 3100,
        published: true,
        modules: [],
      },
      {
        title: 'DSA Fundamentals',
        slug: 'dsa-fundamentals',
        description: 'Data Structures & Algorithms masterclass: Arrays, Strings, Trees, Graphs, DP, and Big O notation.',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        category: 'DSA',
        difficulty: 'Intermediate',
        instructor: 'Prof. Alan Turing',
        duration: '28 Hours',
        rating: 5.0,
        studentsEnrolled: 4200,
        published: true,
        modules: [],
      },
      {
        title: 'SQL & Database Systems',
        slug: 'sql-database-systems',
        description: 'Relational database design, SQL queries, indexing, normalization, and PostgreSQL performance.',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
        category: 'Database',
        difficulty: 'Beginner',
        instructor: 'Elena Rostova',
        duration: '18 Hours',
        rating: 4.8,
        studentsEnrolled: 1650,
        published: true,
        modules: [],
      },
    ]);

    // Enroll student in Full Stack Web Development
    const fsCourse = courses[0];
    const firstLessonId = fsCourse.modules[0].lessons[0]._id.toString();

    await Enrollment.create({
      user: student._id,
      course: fsCourse._id,
      status: 'IN_PROGRESS',
      progress: 64,
      lastLessonId: firstLessonId,
    });

    await LessonProgress.create({
      user: student._id,
      course: fsCourse._id,
      lessonId: firstLessonId,
      status: 'COMPLETED',
      completedAt: new Date(),
    });

    // Seed Coding Problems
    await CodingProblem.insertMany([
      {
        title: 'Two Sum',
        slug: 'two-sum',
        statement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        topic: 'Arrays',
        tags: ['Arrays', 'Hashing', 'Easy'],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
        ],
        points: 10,
      },
      {
        title: 'Reverse Linked List',
        slug: 'reverse-linked-list',
        statement: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        difficulty: 'Easy',
        topic: 'Linked List',
        tags: ['Linked List', 'Pointer', 'Easy'],
        constraints: ['0 <= Node count <= 5000'],
        examples: [
          { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
        ],
        points: 10,
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        slug: 'longest-substring-without-repeating-characters',
        statement: 'Given a string `s`, find the length of the longest substring without repeating characters.',
        difficulty: 'Medium',
        topic: 'Sliding Window',
        tags: ['Strings', 'Sliding Window', 'Medium'],
        constraints: ['0 <= s.length <= 5 * 10^4'],
        examples: [
          { input: 's = "abcabcbb"', output: '3' },
        ],
        points: 20,
      },
    ]);

    console.log('✅ Fresh Seed Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
