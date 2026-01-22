'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
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
        <header className={`relative py-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          {/* Centered bar */}
          <div className="flex justify-center">
            <div className="group bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full px-8 py-3 flex items-center gap-8 shadow-2xl ring-1 ring-white/5 hover:ring-white/20 transition-all duration-500">
              {/* 1337 Logo */}
              <Image
                src="/1337-logo.svg"
                alt="1337"
                width={80}
                height={28}
                className="cursor-default select-none"
                priority
              />
              
              {user && (
                <span className="text-sm text-slate-400 font-medium">
                  Welcome, <span className="text-slate-200">{user.displayName}</span>
                </span>
              )}
            </div>
          </div>
          
          {/* Logout button - top right */}
          <div className="absolute top-8 right-6">
            <button
              onClick={onLogout}
              className="bg-red-500/10 border border-red-500/20 rounded-full px-6 py-2 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Student Profile Section */}
        <StudentProfile isVisible={isVisible} user={user} projectStats={projectStats} />

        {/* Roadmap Section */}
        <RoadmapVisualizer
          isVisible={isVisible}
          apiProjects={apiProjects}
          onProjectSelect={(projectId) => setSelectedProjectId(projectId)}
        />
      </div>

      {/* Project Roadmap View (Full-screen overlay) */}
      {selectedProjectId && (
        <ProjectRoadmapView
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}
