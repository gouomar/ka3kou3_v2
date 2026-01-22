'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
    <div className="min-h-screen w-full mesh-gradient overflow-hidden">
      {/* Subtle mesh gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-sky-100/40 to-teal-100/30 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/6 w-[400px] h-[400px] bg-gradient-to-tr from-teal-100/30 to-cyan-100/20 rounded-full filter blur-[80px]" />
        <div className="absolute top-1/2 right-1/6 w-[300px] h-[300px] bg-gradient-to-bl from-slate-100/40 to-sky-100/30 rounded-full filter blur-[60px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">42</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-800">CommonCore</h1>
                <p className="text-sm text-slate-500 font-light">Learning Roadmap</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-slate-600">
                  Welcome, <span className="font-medium text-slate-900">{user.firstName}</span>
                </span>
              )}
              <button
                onClick={onLogout}
                className="px-5 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/50 text-slate-600 hover:bg-white/80 hover:text-slate-800 transition-all duration-200 font-medium text-sm"
              >
                Logout
              </button>
            </div>
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
