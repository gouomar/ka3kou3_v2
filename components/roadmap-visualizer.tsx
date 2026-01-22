'use client';

import { useState, useMemo } from 'react';
import ProjectCard from './project-card';
import { curriculum, getProjectBySlug } from '@/lib/curriculum';

// API project data from 42 intra
interface ApiProject {
  id: number;
  name: string;
  slug: string;
  status: string;
  validated: boolean | null;
  finalMark: number | null;
}

interface RoadmapVisualizerProps {
  isVisible: boolean;
  apiProjects?: ApiProject[];
  onProjectSelect?: (projectId: string) => void;
}

// Display project for the UI
interface DisplayProject {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'failed' | 'upcoming';
  difficulty: number;
  progress?: number;
  skills: string[];
  finalMark?: number | null;
  circle?: number;
}

export default function RoadmapVisualizer({ isVisible, apiProjects = [], onProjectSelect }: RoadmapVisualizerProps) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'in-progress' | 'failed' | 'upcoming'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Convert API projects to display projects by matching with curriculum
  const displayProjects = useMemo((): DisplayProject[] => {
    // Create a map of API projects by slug for quick lookup
    const apiProjectMap = new Map<string, ApiProject>();
    apiProjects.forEach(p => {
      apiProjectMap.set(p.slug, p);
    });

    // Build display projects from curriculum, enriched with API status
    const projects: DisplayProject[] = [];

    curriculum.forEach(circle => {
      circle.projects.forEach(curriculumProject => {
        // Try to find matching API project
        let matchedApiProject: ApiProject | undefined;

        // Check main slug
        if (apiProjectMap.has(curriculumProject.slug)) {
          matchedApiProject = apiProjectMap.get(curriculumProject.slug);
        }

        // Check alternative slugs
        if (!matchedApiProject && curriculumProject.altSlugs) {
          for (const altSlug of curriculumProject.altSlugs) {
            if (apiProjectMap.has(altSlug)) {
              matchedApiProject = apiProjectMap.get(altSlug);
              break;
            }
          }
        }

        // Special handling for Python modules - aggregate status
        if (curriculumProject.id === 'python-modules') {
          const pythonModules = apiProjects.filter(p => p.slug.startsWith('python-module-'));
          const completedModules = pythonModules.filter(p => p.status === 'finished' && p.validated === true);
          const inProgressModules = pythonModules.filter(p =>
            p.status === 'in_progress' ||
            (p.status === 'finished' && p.validated === false)
          );

          let status: DisplayProject['status'] = 'upcoming';
          let progress: number | undefined;

          if (pythonModules.length > 0) {
            if (completedModules.length === curriculumProject.moduleCount) {
              status = 'completed';
            } else if (completedModules.length > 0 || inProgressModules.length > 0) {
              status = 'in-progress';
              progress = Math.round((completedModules.length / (curriculumProject.moduleCount || 11)) * 100);
            }
          }

          projects.push({
            id: curriculumProject.id,
            name: curriculumProject.name,
            description: `${completedModules.length}/${curriculumProject.moduleCount || 11} modules completed`,
            status,
            difficulty: curriculumProject.difficulty,
            skills: curriculumProject.skills,
            progress,
            circle: curriculumProject.circle,
          });
          return;
        }

        // Determine status from API data
        let status: DisplayProject['status'] = 'upcoming';
        let finalMark: number | null = null;

        if (matchedApiProject) {
          finalMark = matchedApiProject.finalMark;

          if (matchedApiProject.status === 'finished') {
            if (matchedApiProject.validated === true) {
              status = 'completed';
            } else {
              status = 'failed';
            }
          } else if (['in_progress', 'searching_a_group', 'creating_group', 'waiting_for_correction'].includes(matchedApiProject.status)) {
            status = 'in-progress';
          }
        }

        projects.push({
          id: curriculumProject.id,
          name: curriculumProject.name,
          description: curriculumProject.description,
          status,
          difficulty: curriculumProject.difficulty,
          skills: curriculumProject.skills,
          finalMark,
          circle: curriculumProject.circle,
        });
      });
    });

    // Sort by circle, then by status (completed first, then in-progress, then upcoming)
    const statusOrder = { completed: 0, 'in-progress': 1, failed: 2, upcoming: 3 };
    return projects.sort((a, b) => {
      if ((a.circle || 0) !== (b.circle || 0)) {
        return (a.circle || 0) - (b.circle || 0);
      }
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [apiProjects]);

  const filteredProjects = selectedStatus === 'all'
    ? displayProjects
    : displayProjects.filter(p => p.status === selectedStatus);

  const completed = displayProjects.filter(p => p.status === 'completed').length;
  const inProgress = displayProjects.filter(p => p.status === 'in-progress').length;
  const failed = displayProjects.filter(p => p.status === 'failed').length;
  const upcoming = displayProjects.filter(p => p.status === 'upcoming').length;
  const remaining = displayProjects.length - completed;

  return (
    <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-1">Mastery Roadmap</h2>
          <p className="text-slate-500 font-light text-sm">
            You&apos;ve conquered {completed} project{completed !== 1 ? 's' : ''}. {remaining} more to finish the Common Core.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { key: 'all', label: 'All', count: displayProjects.length },
            { key: 'completed', label: 'Completed', count: completed, activeColor: 'bg-teal-500 text-white border-teal-500' },
            { key: 'in-progress', label: 'In Progress', count: inProgress, activeColor: 'bg-sky-500 text-white border-sky-500' },
            { key: 'failed', label: 'Failed', count: failed, activeColor: 'bg-slate-400 text-white border-slate-400' },
            { key: 'upcoming', label: 'Upcoming', count: upcoming, activeColor: 'bg-slate-300 text-slate-700 border-slate-300' },
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedStatus(filter.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                selectedStatus === filter.key
                  ? filter.activeColor || 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white/60 backdrop-blur-sm text-slate-600 border-slate-200/50 hover:bg-white/80 hover:border-slate-300'
              }`}
            >
              {filter.label} <span className="ml-1 opacity-70">({filter.count})</span>
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
                  onClick={() => onProjectSelect?.(project.id)}
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
