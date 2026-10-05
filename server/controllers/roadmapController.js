import Roadmap from '../models/Roadmap.js';

const DEFAULT_FULLSTACK_PHASES = [
  { phaseNumber: 1, name: 'Programming Fundamentals', description: 'Master C++, Java or Python logic, syntax, loops & OOP basics', topics: ['Variables & Datatypes', 'Control Statements', 'Functions & Pointers', 'OOP Principles'], completed: true },
  { phaseNumber: 2, name: 'Data Structures & Algorithms', description: 'Arrays, Strings, Stacks, Trees, Graphs & Dynamic Programming', topics: ['Arrays & Hashing', 'Linked Lists & Stacks', 'Binary Trees & BST', 'DP & Graph Algorithms'], completed: true },
  { phaseNumber: 3, name: 'HTML, CSS & Modern JavaScript', description: 'DOM manipulation, ES6+, Async/Await & responsive CSS', topics: ['HTML5 & Semantic Markup', 'CSS3 & Flexbox/Grid', 'JS ES6+ Async/Fetch', 'DOM & Events'], completed: false },
  { phaseNumber: 4, name: 'Frontend Framework (React)', description: 'React hooks, state management, components & routing', topics: ['JSX & Props/State', 'React Hooks (useState, useEffect)', 'React Router', 'Context API / Redux'], completed: false },
  { phaseNumber: 5, name: 'Backend API Development (Node/Express)', description: 'Building REST APIs, Express middleware & HTTP standards', topics: ['Node Runtime Basics', 'Express Routing & Middleware', 'REST API Architecture', 'JWT Authentication'], completed: false },
  { phaseNumber: 6, name: 'Database Management (MongoDB & SQL)', description: 'Mongoose schemas, indexing, SQL queries & relational models', topics: ['MongoDB & Mongoose CRUD', 'SQL Queries & Joins', 'Database Indexing', 'Transactions & ACID'], completed: false },
  { phaseNumber: 7, name: 'Full-Stack Capstone Projects', description: 'Building end-to-end production web applications', topics: ['E-commerce / SaaS App', 'Real-time Chat App', 'Deployment & CI/CD'], completed: false },
  { phaseNumber: 8, name: 'Resume & Portfolio Preparation', description: 'Tailoring tech resumes, GitHub portfolio & project writeups', topics: ['ATS Resume Optimization', 'GitHub Portfolio Setup', 'LinkedIn Branding'], completed: false },
  { phaseNumber: 9, name: 'Technical Interview Mastery', description: 'Mock interviews, CS fundamentals (OS, DBMS, CN) & System Design', topics: ['DBMS & OS Core Concepts', 'System Design Basics', 'Mock Coding Rounds'], completed: false },
  { phaseNumber: 10, name: 'HR & Behavioral Interview Prep', description: 'STAR format story preparation and communication practice', topics: ['Behavioral Questions', 'Salary Negotiation', 'Final Offer Evaluation'], completed: false },
];

export const getRoadmap = async (req, res) => {
  try {
    let roadmap = await Roadmap.findOne({ user: req.user._id });
    if (!roadmap) {
      roadmap = await Roadmap.create({
        user: req.user._id,
        role: req.user.preferredRole || 'Full Stack Developer',
        phases: DEFAULT_FULLSTACK_PHASES,
      });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoadmapPhase = async (req, res) => {
  try {
    const { phaseNumber, completed } = req.body;
    const roadmap = await Roadmap.findOne({ user: req.user._id });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    const phase = roadmap.phases.find((p) => p.phaseNumber === Number(phaseNumber));
    if (phase) {
      phase.completed = Boolean(completed);
      await roadmap.save();
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
