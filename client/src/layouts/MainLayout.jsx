import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const getPageTitle = (pathname) => {
    if (pathname === '/dashboard') return 'Student Dashboard';
    if (pathname === '/my-courses') return 'My Enrolled Courses';
    if (pathname === '/courses') return 'Explore Courses Catalog';
    if (pathname.startsWith('/courses/')) return 'Course Curriculum & Lessons';
    if (pathname === '/coding') return 'Coding Practice Arena';
    if (pathname.startsWith('/coding/')) return 'Coding Problem Challenge';
    if (pathname === '/coding-profiles') return 'Competitive Coding Platform Ratings';
    if (pathname === '/quizzes') return 'Knowledge Assessment Quizzes';
    if (pathname === '/progress') return 'Overall Learning Analytics';
    if (pathname === '/bookmarks') return 'Saved Content & Bookmarks';
    if (pathname === '/profile') return 'Student Profile';
    if (pathname === '/settings') return 'Account Settings';
    if (pathname.startsWith('/admin')) return 'Admin CMS Control Panel';
    return 'CODEFORGE';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
        <Navbar toggleSidebar={toggleSidebar} title={getPageTitle(location.pathname)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
