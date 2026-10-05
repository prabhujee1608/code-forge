import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import SavedJob from '../models/SavedJob.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Application.deleteMany();
    await Interview.deleteMany();
    await SavedJob.deleteMany();

    console.log('Cleared previous data...');

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      password: hashedPassword,
      phone: '+1 (555) 234-5678',
      college: 'Stanford University',
      degree: 'Bachelor of Science',
      branch: 'Computer Science',
      graduationYear: 2026,
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'Tailwind CSS', 'AWS'],
      githubUrl: 'https://github.com/alexrivera',
      linkedinUrl: 'https://linkedin.com/in/alexrivera',
      portfolioUrl: 'https://alexrivera.dev',
    });

    console.log(`Created demo user: ${demoUser.email} (Password: password123)`);

    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in10Days = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const past5Days = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const past15Days = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    // Create Applications
    const applications = await Application.insertMany([
      {
        user: demoUser._id,
        company: 'Google',
        position: 'Software Engineering Intern',
        type: 'Internship',
        location: 'Mountain View, CA',
        workMode: 'Hybrid',
        jobUrl: 'https://careers.google.com/jobs/results/123456',
        applicationDate: past15Days,
        deadline: in3Days,
        status: 'Interview',
        salary: '$55 / hour',
        hrName: 'Sarah Jenkins',
        hrEmail: 'sjenkins@google.com',
        notes: 'Passed technical screen, final round scheduled for next week.',
        requiredSkills: ['React', 'Data Structures', 'System Design', 'C++'],
        resumeVersion: 'Resume V2 – Web Development',
        interviewDate: in3Days,
        followUpDate: in5Days,
      },
      {
        user: demoUser._id,
        company: 'Microsoft',
        position: 'Full Stack Developer',
        type: 'Job',
        location: 'Redmond, WA',
        workMode: 'On-site',
        jobUrl: 'https://careers.microsoft.com/us/en/job/987654',
        applicationDate: past15Days,
        deadline: in7Days,
        status: 'Shortlisted',
        salary: '$135,000 / year',
        hrName: 'David Miller',
        hrEmail: 'dmiller@microsoft.com',
        notes: 'Recruiter reached out via LinkedIn. Initial phone chat completed.',
        requiredSkills: ['C#', '.NET Core', 'TypeScript', 'Azure'],
        resumeVersion: 'Resume V1 – General',
        followUpDate: in3Days,
      },
      {
        user: demoUser._id,
        company: 'Stripe',
        position: 'Frontend Engineer Intern',
        type: 'Internship',
        location: 'San Francisco, CA (Remote)',
        workMode: 'Remote',
        jobUrl: 'https://stripe.com/jobs/frontend-intern',
        applicationDate: past5Days,
        deadline: in10Days,
        status: 'Under Review',
        salary: '$60 / hour',
        hrName: 'Elena Rostova',
        hrEmail: 'elena@stripe.com',
        notes: 'Submitted online code sample challenge on HackerRank.',
        requiredSkills: ['React', 'JavaScript', 'CSS Modules', 'Web Vitals'],
        resumeVersion: 'Resume V2 – Web Development',
      },
      {
        user: demoUser._id,
        company: 'Vercel',
        position: 'Junior Next.js Developer',
        type: 'Job',
        location: 'Remote',
        workMode: 'Remote',
        jobUrl: 'https://vercel.com/careers/junior-dev',
        applicationDate: past15Days,
        deadline: null,
        status: 'Offer',
        salary: '$120,000 / year',
        hrName: 'Guillermo Rauch',
        hrEmail: 'hr@vercel.com',
        notes: 'Offer letter received! Reviewing equity package and deadline to sign.',
        requiredSkills: ['Next.js', 'React', 'Tailwind CSS', 'Edge Functions'],
        resumeVersion: 'Resume V2 – Web Development',
      },
      {
        user: demoUser._id,
        company: 'Meta',
        position: 'Production Engineering Intern',
        type: 'Internship',
        location: 'Menlo Park, CA',
        workMode: 'On-site',
        jobUrl: 'https://metacareers.com/pe-intern',
        applicationDate: past15Days,
        deadline: null,
        status: 'Rejected',
        salary: '$52 / hour',
        hrName: 'Mark Chen',
        hrEmail: 'mchen@meta.com',
        notes: 'Position filled for Summer 2026 cohort.',
        requiredSkills: ['Python', 'Linux', 'Networking', 'Docker'],
        resumeVersion: 'Resume V1 – General',
      },
      {
        user: demoUser._id,
        company: 'Figma',
        position: 'UI/UX Developer Intern',
        type: 'Internship',
        location: 'San Francisco, CA',
        workMode: 'Hybrid',
        jobUrl: 'https://figma.com/careers/ui-intern',
        applicationDate: past5Days,
        deadline: in5Days,
        status: 'Saved',
        salary: '$50 / hour',
        hrName: '',
        hrEmail: '',
        notes: 'Preparing custom portfolio sample before applying.',
        requiredSkills: ['Figma API', 'Canvas', 'WebGL', 'React'],
        resumeVersion: 'Resume V2 – Web Development',
      },
    ]);

    console.log(`Seeded ${applications.length} applications.`);

    // Create Interviews
    await Interview.create({
      user: demoUser._id,
      application: applications[0]._id,
      company: 'Google',
      position: 'Software Engineering Intern',
      interviewDate: in3Days,
      interviewTime: '02:00 PM EST',
      interviewType: 'Technical',
      interviewRound: 'Round 2 - System Design & Coding',
      interviewer: 'Alexandre Dubois (Staff Engineer)',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Focus on distributed caching and LRU implementation.',
      status: 'Scheduled',
    });

    await Interview.create({
      user: demoUser._id,
      application: applications[1]._id,
      company: 'Microsoft',
      position: 'Full Stack Developer',
      interviewDate: in7Days,
      interviewTime: '11:00 AM PST',
      interviewType: 'Behavioral',
      interviewRound: 'Round 1 - HR & Cultural Fit',
      interviewer: 'David Miller',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/12345',
      notes: 'Prepare STAR format examples of teamwork and conflict resolution.',
      status: 'Scheduled',
    });

    console.log('Seeded interviews.');

    // Create Saved Jobs
    await SavedJob.insertMany([
      {
        user: demoUser._id,
        company: 'Airbnb',
        position: 'Graduate Software Engineer 2026',
        url: 'https://careers.airbnb.com/positions/56789',
        location: 'San Francisco, CA',
        workMode: 'Hybrid',
        type: 'Job',
        salary: '$140,000 / year',
        deadline: in10Days,
        skills: ['React', 'Kotlin', 'GraphQL', 'Microservices'],
        notes: 'Requires referral from alumni network.',
      },
      {
        user: demoUser._id,
        company: 'Datadog',
        position: 'Backend Developer Intern',
        url: 'https://datadog.com/careers/intern-backend',
        location: 'New York, NY',
        workMode: 'On-site',
        type: 'Internship',
        salary: '$48 / hour',
        deadline: in7Days,
        skills: ['Go', 'Python', 'Distributed Systems'],
        notes: 'Apply before Friday cutoff.',
      },
    ]);

    console.log('Seeded saved jobs.');
    console.log('Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
