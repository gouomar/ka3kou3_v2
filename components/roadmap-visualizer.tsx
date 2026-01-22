'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { curriculum } from '@/lib/curriculum';
import ProjectCard from './project-card';

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

// Python module info
interface PythonModule {
  id: string;
  name: string;
  number: number;
  status: 'completed' | 'in-progress' | 'failed' | 'upcoming';
  finalMark?: number | null;
}

export default function RoadmapVisualizer({ isVisible, apiProjects = [], onProjectSelect }: RoadmapVisualizerProps) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'in-progress' | 'failed' | 'upcoming'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedPythonModules, setExpandedPythonModules] = useState(false);
  const pythonCardRef = useRef<HTMLDivElement>(null);

  // Close python modules dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pythonCardRef.current && !pythonCardRef.current.contains(event.target as Node)) {
        setExpandedPythonModules(false);
      }
    };
    if (expandedPythonModules) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedPythonModules]);

  // Get Python modules status from API
  const pythonModulesData = useMemo((): PythonModule[] => {
    const modules: PythonModule[] = [];
    for (let i = 0; i <= 10; i++) {
      const slug = `python-module-0${i}`;
      const apiModule = apiProjects.find(p => p.slug === slug || p.slug === `python-module-${i}`);

      let status: PythonModule['status'] = 'upcoming';
      let finalMark: number | null = null;

      if (apiModule) {
        finalMark = apiModule.finalMark;
        if (apiModule.status === 'finished') {
          status = apiModule.validated === true ? 'completed' : 'failed';
        } else if (['in_progress', 'searching_a_group', 'creating_group', 'waiting_for_correction'].includes(apiModule.status)) {
          status = 'in-progress';
        }
      }

      modules.push({
        id: `python-module-${i}`,
        name: `Python${i.toString().padStart(2, '0')}`,
        number: i,
        status,
        finalMark,
      });
    }
    return modules;
  }, [apiProjects]);

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

    // Sort by status first (in-progress first), then by circle
    const statusOrder = { 'in-progress': 0, completed: 1, failed: 2, upcoming: 3 };
    return projects.sort((a, b) => {
      // In-progress projects come first
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // Then sort by circle
      return (a.circle || 0) - (b.circle || 0);
    });
  }, [apiProjects]);

  // Apply status filter only
  const filteredProjects = useMemo(() => {
    if (selectedStatus === 'all') {
      return displayProjects;
    }
    return displayProjects.filter(p => p.status === selectedStatus);
  }, [displayProjects, selectedStatus]);

  // Group projects by circle
  // Order: 1) Current circle (in-progress), 2) Upcoming circles, 3) Already passed circles
  const projectsByCircle = useMemo(() => {
    const groups: { circle: number; name: string; projects: DisplayProject[]; hasInProgress: boolean }[] = [];
    const circleNames: Record<number, string> = {
      1: 'Circle 1',
      2: 'Circle 2',
      3: 'Circle 3',
      4: 'Circle 4',
      5: 'Circle 5',
      6: 'Circle 6',
      7: 'Circle 7 (Final)',
    };

    for (let i = 1; i <= 7; i++) {
      const circleProjects = filteredProjects.filter(p => p.circle === i);
      if (circleProjects.length > 0) {
        const hasInProgress = circleProjects.some(p => p.status === 'in-progress');
        groups.push({
          circle: i,
          name: circleNames[i],
          projects: circleProjects,
          hasInProgress,
        });
      }
    }

    // Find the current circle (the one with in-progress projects)
    const currentCircle = groups.find(g => g.hasInProgress)?.circle || 0;

    // Sort: 1) Current circle first, 2) Upcoming circles (after current), 3) Already passed circles (before current)
    return groups.sort((a, b) => {
      const aIsCurrent = a.hasInProgress;
      const bIsCurrent = b.hasInProgress;

      // Current circle comes first
      if (aIsCurrent && !bIsCurrent) return -1;
      if (!aIsCurrent && bIsCurrent) return 1;

      // Both are not current: upcoming circles before passed circles
      const aIsUpcoming = a.circle > currentCircle;
      const bIsUpcoming = b.circle > currentCircle;

      if (aIsUpcoming && !bIsUpcoming) return -1; // a is upcoming, b is passed
      if (!aIsUpcoming && bIsUpcoming) return 1;  // b is upcoming, a is passed

      // Within the same category, sort by circle number
      return a.circle - b.circle;
    });
  }, [filteredProjects]);

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

        {/* Status Filter */}
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

        {/* Projects grouped by Circle */}
        {projectsByCircle.map((group, groupIndex) => (
          <div key={group.circle} className="mb-10">
            {/* Circle Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white text-sm font-bold">
                {group.circle}
              </div>
              <h3 className="text-lg font-semibold text-slate-700">{group.name}</h3>
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-sm text-slate-400">{group.projects.length} project{group.projects.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Project Grid for this Circle */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.projects.map((project, index) => (
                <div
                  key={project.id}
                  className="smooth-scale-in"
                  style={{
                    animationDelay: `${0.2 + groupIndex * 0.1 + index * 0.05}s`,
                    opacity: 0,
                  }}
                >
                  {/* Special handling for Python Modules */}
                  {project.id === 'python-modules' ? (
                    <div ref={pythonCardRef} className="relative">
                      <div
                        onMouseEnter={() => setHoveredId(project.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <ProjectCard
                          project={project}
                          isHovered={hoveredId === project.id}
                          onClick={() => setExpandedPythonModules(!expandedPythonModules)}
                        />
                      </div>

                      {/* Python Modules Panel - Left Side */}
                      <div
                        className={`absolute right-full top-0 mr-3 w-56 z-20 transition-all duration-200 ease-out ${
                          expandedPythonModules
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}
                      >
                        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Select Module</p>
                          </div>

                          {/* Modules List */}
                          <div className="max-h-[400px] overflow-y-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {pythonModulesData.map((module) => {
                              const statusConfig = {
                                completed: { bg: 'bg-teal-50', text: 'text-teal-600', dot: 'bg-teal-500', label: 'Completed' },
                                'in-progress': { bg: 'bg-sky-50', text: 'text-sky-600', dot: 'bg-sky-500', label: 'In Progress' },
                                failed: { bg: 'bg-red-50', text: 'text-red-500', dot: 'bg-red-500', label: 'Failed' },
                                upcoming: { bg: 'bg-white', text: 'text-slate-400', dot: 'bg-slate-300', label: 'Upcoming' },
                              };
                              const config = statusConfig[module.status];

                              return (
                                <button
                                  key={module.id}
                                  onClick={() => {
                                    setExpandedPythonModules(false);
                                    onProjectSelect?.(module.id);
                                  }}
                                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 ${config.bg}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                                    <span className="text-sm font-medium text-slate-700">{module.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs ${config.text}`}>{config.label}</span>
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {projectsByCircle.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-light">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
