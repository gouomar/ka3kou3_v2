'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import RoadmapVisualizer from './roadmap-visualizer';
import StudentProfile from './student-profile';

// Dynamically import ProjectRoadmapView to avoid SSR issues with mermaid
const ProjectRoadmapView = dynamic(() => import('./project-roadmap-view'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading roadmap...</p>
      </div>
    </div>
  ),
});

interface User {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  image: string;
  level: number;
  campus: string;
  campusCity: string;
  poolYear: string;
  poolMonth: string;
  wallet: number;
  correctionPoints: number;
}

interface ProjectStats {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
}

interface ApiProject {
  id: number;
  name: string;
  slug: string;
  status: string;
  validated: boolean | null;
  finalMark: number | null;
}

interface DashboardPageProps {
  onLogout: () => void;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [apiProjects, setApiProjects] = useState<ApiProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Handle browser back button when project view is open
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.projectId) {
        setSelectedProjectId(event.state.projectId);
      } else {
        setSelectedProjectId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Function to open project with history management
  const openProject = (projectId: string) => {
    window.history.pushState({ projectId }, '', `#project-${projectId}`);
    setSelectedProjectId(projectId);
  };

  // Function to close project with history management
  const closeProject = () => {
    if (selectedProjectId) {
      window.history.back();
    }
  };

  useEffect(() => {
    // Trigger animations after mount
    setIsVisible(true);

    // Fetch user data
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(console.error);

    // Fetch projects data
    fetch('/api/user/projects')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setProjectStats(data.stats);
        }
        if (data.projects) {
          setApiProjects(data.projects);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Main content */}
      <div className="relative">
        {/* Header */}
        <header className={`py-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Simple nav bar */}
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* 1337 Logo */}
              <svg width="60" height="16" viewBox="0 0 76 20" fill="none"><path d="M2.8333 17.6623H5.92418V2.33766H2.31816V5.45455H0V1.49012e-07H8.75748V17.6623H11.8484V20H2.8333V17.6623Z" fill="#1e293b"></path><path d="M21.3785 17.6623H30.6512V10.9091H22.1513V8.57143H30.6512V2.33766H21.3785V0H33.4845V20H21.3785V17.6623Z" fill="#1e293b"></path><path d="M42.2419 17.6623H51.5146V10.9091H43.0147V8.57143H51.5146V2.33766H42.2419V0H54.3479V20H42.2419V17.6623Z" fill="#1e293b"></path><path d="M72.6355 2.33766H64.9084V7.27273H62.5902V0H75.2113V20H72.6355V2.33766Z" fill="#1e293b"></path></svg>

              {user && (
                <span className="text-sm text-slate-500">
                  {user.login}
                </span>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Student Profile Section */}
        <StudentProfile isVisible={isVisible} user={user} projectStats={projectStats} />

        {/* Roadmap Section */}
        <RoadmapVisualizer
          isVisible={isVisible}
          apiProjects={apiProjects}
          onProjectSelect={openProject}
        />
      </div>

      {/* Project Roadmap View (Full-screen overlay) */}
      {selectedProjectId && (
        <ProjectRoadmapView
          projectId={selectedProjectId}
          onClose={closeProject}
        />
      )}
    </div>
  );
}
