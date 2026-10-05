# 🚀 CodeCareer – Coding & Career Preparation Platform

**CodeCareer** is a modern, student-focused full-stack web application engineered to help college students and freshers prepare for software developer jobs, internships, campus placements, and off-campus recruitment drives.

The platform provides a single unified workspace for coding practice, DSA skill tracking, technical interview preparation, aptitude testing, HR question drafting, job readiness monitoring, and performance analytics.

---

## ✨ Features & Module Overview

### 1. 🔑 Authentication & Role-Based Security
- **JWT Authentication & Password Hashing:** Token-based security with `bcryptjs`.
- **Role-Based Authorization:** Separate access tiers for **Student** and **Admin**.
- **Registration Fields:** Name, Email, Password, College, Branch, Graduation Year, Current Year, and Target Preferred Role (*Full Stack Developer*, *Frontend Developer*, *Backend Developer*, *Software Engineer*, *Data Analyst*, *Data Scientist*).
- **Forgot & Reset Password Workflow.**

### 2. 🎯 Job Readiness Dashboard (`/dashboard`)
- **Welcome Greeting & Target Role:** Personalized header for the student.
- **Today's Preparation Progress:** Real-time counters for Coding Problems (3/5), Interview Questions (2/5), and Aptitude Questions (8/10).
- **Daily Coding Streak Tracker:** Displays current active streak (e.g. 🔥 12 Days).
- **Platform Preparation Progress Breakdown:** Labeled as *Preparation Progress* (not an employability guarantee) for Coding (78%), DSA (65%), CS Fundamentals (72%), Aptitude (80%), Interview (55%), Projects (85%), and Overall (72%).
- **Visual Charts & Heatmap Calendar:** Recharts module breakdown & 52-week GitHub-style activity contribution calendar.
- **Personalized Recommendations & Weak Topic Alerts.**

### 3. 💻 Coding Practice Arena (`/coding`, `/coding/:id`)
- **17 DSA Topics:** Arrays, Strings, Linked List, Stack, Queue, Binary Search, Sorting, Hashing, Recursion, Backtracking, Trees, BST, Heap, Graph, Dynamic Programming, Greedy, Bit Manipulation.
- **Difficulty Levels:** Easy, Medium, Hard.
- **Interactive Code Editor Playground:** Multi-language support (JavaScript, Python, C++, Java), starter template, test execution simulation, automated result modal (Passed 5/5 cases, execution time, memory usage), official solution code & complexity explanation, bookmarking, and personal notes.

### 4. 🧠 DSA Skill Matrix Tracker (`/dsa`)
- Progress bars and percentage calculations across all 17 DSA topics.
- **Platform-Based Progress Disclaimer:** Explicitly labels progress as platform activity to avoid misleading employability claims.

### 5. 🗣️ Technical & HR Interview Preparation (`/interview`)
- **Technical Topics:** OOP, DBMS, Operating Systems, Computer Networks, SQL, Data Structures, Algorithms, JavaScript, React, Node.js.
- **HR & Behavioral Questions:** Tell me about yourself, Explain your project, Strengths & Weaknesses, Why hire you, 5 Years Goal.
- **Student Custom Answer Editor:** Save personalized STAR-formatted responses.
- **Preparation Status Tracker:** *Not Started*, *Learning*, *Practicing*, *Completed*.

### 6. 🧮 Aptitude Practice & MCQs (`/aptitude`)
- **Categories:** Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation.
- **Interactive MCQ Test Runner:** Real-time scoring, correct answer highlights, detailed explanations, and attempt history tracking.

### 7. 📈 Performance Analytics (`/analytics`)
- Recharts visualizations for problems solved over time, difficulty distribution (Easy/Medium/Hard donut chart), weekly submissions, and accuracy rates.

### 8. 🗺️ Preparation Roadmap (`/roadmap`)
- 10-Phase structured roadmap (*Programming Fundamentals*, *DSA*, *Web Frontend*, *React*, *Node/Express*, *Databases*, *Projects*, *Resume*, *Technical Interview*, *HR Interview*) with completion tracking.

### 9. 📋 Daily Preparation Tasks (`/tasks`)
- Task checklist with category tags (*Coding*, *Interview*, *Aptitude*, *Project*, *General*), deadlines, and completion toggles.

### 10. 🔖 Bookmarks & 📝 Personal Notes (`/bookmarks`, `/notes`)
- Dedicated space to bookmark coding problems, interview questions, and algorithm intuition notes (e.g. `lower_bound` tips).

### 11. 🏆 Achievements & Leaderboard (`/achievements`, `/leaderboard`)
- **Gamified Badges:** *First Problem Solved*, *7-Day Streak*, *100 Problems*, *DSA Explorer*, *50 Interview Questions*, *100 Aptitude Questions*.
- **Student Leaderboard:** Rankings by practice points, streak, and solved challenges with a **Privacy Opt-Out Toggle**.

### 12. 🛡️ Admin Dashboard (`/admin`)
- Control panel to create, edit, and delete Coding Problems, Interview Questions, Aptitude MCQs, and manage user accounts.

---

## 🏗️ Project Architecture

```
code-career/
├── client/                      # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/          # Sidebar, Navbar, StatCard, Badge, Modal, CodeEditor, HeatmapCalendar
│   │   ├── context/             # AuthContext & ToastContext
│   │   ├── hooks/               # Custom useAuth & useToast
│   │   ├── layouts/             # MainLayout & AuthLayout
│   │   ├── pages/               # Login, Register, ForgotPassword, ResetPassword, Dashboard, Profile, CodingList, CodingDetail, DSAProgress, InterviewPrep, AptitudePrep, Analytics, Roadmap, Tasks, Bookmarks, Notes, Achievements, Leaderboard, Settings, AdminDashboard
│   │   ├── services/            # Axios API client & service functions
│   │   └── App.jsx              # Router & Route guards
│   ├── package.json
│   └── vite.config.js
│
└── server/                      # Backend REST API (Node.js + Express + MongoDB)
    ├── config/                  # DB connection + Auto-seeder
    ├── controllers/             # Auth, User, Problem, Attempt, Progress, Interview, Aptitude, Task, Bookmark, Note, Roadmap, Leaderboard, Admin controllers
    ├── middleware/              # JWT & Admin middleware
    ├── models/                  # User, CodingProblem, CodingAttempt, InterviewQuestion, AptitudeQuestion, AptitudeAttempt, StudyTask, Roadmap, Bookmark, Note, Achievement schemas
    ├── routes/                  # Express routes
    ├── server.js                # Express app entry point
    └── package.json
```

---

## ⚡ REST API Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/register` — Register student
- `POST /api/auth/login` — Login user/admin
- `GET /api/auth/me` — Fetch current user
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password

### Coding Problems (`/api/problems` & `/api/attempts`)
- `GET /api/problems` — List coding problems (filterable)
- `GET /api/problems/:id` — Get problem details
- `POST /api/attempts` — Submit code attempt for evaluation
- `POST /api/problems` — Admin add problem
- `PUT /api/problems/:id` — Admin edit problem
- `DELETE /api/problems/:id` — Admin delete problem

### DSA & Progress (`/api/progress`)
- `GET /api/progress` — Overall preparation metrics
- `GET /api/progress/dsa` — DSA Skill Matrix percentages
- `GET /api/progress/analytics` — Recharts performance data & recommendations

### Interviews (`/api/interviews`)
- `GET /api/interviews` — Fetch technical & HR questions
- `POST /api/interviews/:id/answer` — Save custom student answer & status

### Aptitude (`/api/aptitude`)
- `GET /api/aptitude` — Fetch MCQ questions
- `POST /api/aptitude/attempt` — Submit test & calculate accuracy

---

## 🚀 Setup & Execution Instructions

### 1. Install & Run Full-Stack Dev Server
```bash
# In the root directory:
npm run dev
```
*(This starts both the Express backend API on port `5000` and Vite frontend on port `3000` concurrently).*

### 2. Quick Demo Credentials
- **Student Account:** `alex.rivera@university.edu` / `password123`
- **Admin Account:** `admin@codecareer.dev` / `admin123`

---

## 📜 License
This project is built as an educational full-stack software application.
