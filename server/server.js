import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import platformRoutes from './routes/platformRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api', (req, res) => {
  res.json({
    name: 'CodeForge REST API',
    status: 'Operational',
    version: '2.0.0',
    description: 'Online Learning + Coding Platform for Students',
  });
});

// Mount Core Platform Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', lessonRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/coding-profiles', platformRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 CodeForge API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=================================================`);
});
