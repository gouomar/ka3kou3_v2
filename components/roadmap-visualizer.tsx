'use client';

import { useState } from 'react';
import ProjectCard from './project-card';

interface RoadmapVisualizerProps {
  isVisible: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  difficulty: number;
  progress?: number;
  skills: string[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Libft',
    description: 'Build your own C library',
    status: 'completed',
    difficulty: 2,
    skills: ['C', 'Memory Management', 'Data Structures'],
  },
  {
    id: '2',
    name: 'ft_printf',
    description: 'Recreate the printf function',
    status: 'completed',
    difficulty: 3,
    skills: ['C', 'Variadic Functions', 'Parsing'],
  },
  {
    id: '3',
    name: 'get_next_line',
    description: 'Read and return successive lines',
    status: 'completed',
    difficulty: 3,
    skills: ['File I/O', 'Buffer Management', 'C'],
  },
  {
    id: '4',
    name: 'pipex',
    description: 'Implement shell pipe functionality',
    status: 'in-progress',
    difficulty: 4,
    progress: 65,
    skills: ['Processes', 'Pipes', 'Unix'],
  },
  {
    id: '5',
    name: 'Philosophers',
    description: 'Solve the dining philosophers problem',
    status: 'in-progress',
    difficulty: 4,
    progress: 40,
    skills: ['Multithreading', 'Synchronization', 'Concurrency'],
  },
  {
    id: '6',
    name: 'minishell',
    description: 'Create a simple shell',
    status: 'upcoming',
    difficulty: 5,
    skills: ['Parsing', 'Process Management', 'Signal Handling'],
  },
  {
    id: '7',
    name: 'NetPractice',
    description: 'Master TCP/IP networking',
    status: 'upcoming',
    difficulty: 3,
    skills: ['Networking', 'TCP/IP', 'Routing'],
  },
  {
    id: '8',
    name: 'CPP Modules',
    description: 'Learn Object-Oriented Programming',
    status: 'upcoming',
    difficulty: 4,
    skills: ['C++', 'OOP', 'Design Patterns'],
  },
  {
    id: '9',
    name: 'WebServer',
    description: 'Build an HTTP server',
    status: 'upcoming',
    difficulty: 5,
    skills: ['HTTP', 'Sockets', 'Concurrency'],
  },
];

export default function RoadmapVisualizer({ isVisible }: RoadmapVisualizerProps) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'in-progress' | 'upcoming'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredProjects = selectedStatus === 'all' 
    ? mockProjects 
    : mockProjects.filter(p => p.status === selectedStatus);

  const completed = mockProjects.filter(p => p.status === 'completed').length;
  const inProgress = mockProjects.filter(p => p.status === 'in-progress').length;
  const upcoming = mockProjects.filter(p => p.status === 'upcoming').length;

  return (
    <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">Learning Roadmap</h2>
          <p className="text-slate-600 font-light">Your journey through the Common Core curriculum</p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {[
            { key: 'all', label: 'All Projects', count: mockProjects.length },
            { key: 'completed', label: 'Completed', count: completed, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
            { key: 'in-progress', label: 'In Progress', count: inProgress, color: 'bg-blue-100 text-blue-700 border-blue-200' },
            { key: 'upcoming', label: 'Upcoming', count: upcoming, color: 'bg-slate-200 text-slate-700 border-slate-300' },
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedStatus(filter.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                selectedStatus === filter.key
                  ? filter.color || 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {filter.label} <span className="ml-2 font-semibold">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="smooth-scale-in"
              style={{
                animationDelay: `${0.4 + index * 0.08}s`,
                opacity: 0,
              }}
            >
              <div
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <ProjectCard
                  project={project}
                  isHovered={hoveredId === project.id}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-light">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
