'use client';

import { useState, useEffect } from 'react';
import RoadmapVisualizer from './roadmap-visualizer';
import StudentProfile from './student-profile';

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

interface DashboardPageProps {
  onLogout: () => void;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);

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
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-pink-100/10 rounded-full filter blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">CommonCore</h1>
                <p className="text-sm text-slate-600 font-light">Learning Pathways</p>
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
                className="px-6 py-2.5 rounded-lg bg-slate-200/50 text-slate-700 hover:bg-slate-300/50 transition-all duration-300 font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Student Profile Section */}
        <StudentProfile isVisible={isVisible} user={user} projectStats={projectStats} />

        {/* Roadmap Section */}
        <RoadmapVisualizer isVisible={isVisible} />
      </div>
    </div>
  );
}
