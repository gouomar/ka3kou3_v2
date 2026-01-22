'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getRoadmapByProjectId, type ProjectRoadmap, type RoadmapNode } from '@/lib/roadmaps';

interface ProjectRoadmapViewProps {
  projectId: string;
  onClose: () => void;
}

// Node status types
export type NodeStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped';

export interface NodeStates {
  [nodeId: string]: NodeStatus;
}

// Storage key for node states
export const getStorageKey = (projectId: string) => `roadmap-states-${projectId}`;

// Load states from localStorage
export const loadNodeStates = (projectId: string): NodeStates => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(getStorageKey(projectId));
  return stored ? JSON.parse(stored) : {};
};

// Calculate progress for a project
export const calculateProjectProgress = (projectId: string): { completed: number; total: number; percentage: number } => {
  if (typeof window === 'undefined') return { completed: 0, total: 0, percentage: 0 };

  const roadmap = getRoadmapByProjectId(projectId);
  if (!roadmap) return { completed: 0, total: 0, percentage: 0 };

  const nodeStates = loadNodeStates(projectId);
  const nodeKeys = Object.keys(roadmap.nodes);
  const total = nodeKeys.length;
  const completed = nodeKeys.filter((k) => nodeStates[k] === 'completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};

// Save states to localStorage
const saveNodeStates = (projectId: string, states: NodeStates) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(projectId), JSON.stringify(states));
};

// Status colors for nodes (light theme)
const statusColors: Record<NodeStatus, { bg: string; border: string; dot: string; text: string }> = {
  'not-started': {
    bg: 'rgba(148, 163, 184, 0.15)',
    border: '#94a3b8',
    dot: '#94a3b8',
    text: 'Not Started',
  },
  'in-progress': {
    bg: 'rgba(14, 165, 233, 0.15)',
    border: '#0ea5e9',
    dot: '#0ea5e9',
    text: 'In Progress',
  },
  'completed': {
    bg: 'rgba(20, 184, 166, 0.15)',
    border: '#14b8a6',
    dot: '#14b8a6',
    text: 'Completed',
  },
  'skipped': {
    bg: 'rgba(239, 68, 68, 0.1)',
    border: '#f87171',
    dot: '#f87171',
    text: 'Skipped',
  },
};

export default function ProjectRoadmapView({ projectId, onClose }: ProjectRoadmapViewProps) {
  const [roadmap, setRoadmap] = useState<ProjectRoadmap | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeStates, setNodeStates] = useState<NodeStates>({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Load roadmap data and states
  useEffect(() => {
    const roadmapData = getRoadmapByProjectId(projectId);
    setRoadmap(roadmapData || null);
    setNodeStates(loadNodeStates(projectId));

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, [projectId]);

  // Handle browser back button
  useEffect(() => {
    // Push a state to history when entering
    window.history.pushState({ roadmapOpen: true, projectId }, '', `#roadmap-${projectId}`);

    const handlePopState = () => {
      // When back is pressed, close the roadmap
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [projectId, onClose]);

  // Initialize Mermaid
  useEffect(() => {
    if (!roadmap || !mermaidRef.current) return;

    const loadMermaid = async () => {
      const mermaidModule = (await import('mermaid')).default;
      mermaidModule.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis',
          padding: 30,
          nodeSpacing: 50,
          rankSpacing: 60,
        },
        themeVariables: {
          primaryColor: '#f8fafc',
          primaryTextColor: '#334155',
          primaryBorderColor: '#cbd5e1',
          lineColor: '#94a3b8',
          secondaryColor: '#f1f5f9',
          tertiaryColor: '#f8fafc',
          mainBkg: '#ffffff',
          clusterBkg: 'rgba(241, 245, 249, 0.5)',
          clusterBorder: '#e2e8f0',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      });

      try {
        const { svg } = await mermaidModule.render('roadmap-mermaid', roadmap.mermaidDiagram);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
          setupNodeInteractions();
          applyNodeStyles();
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    };

    loadMermaid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap]);

  // Apply styles based on node states
  const applyNodeStyles = useCallback(() => {
    if (!mermaidRef.current || !roadmap) return;

    const nodes = mermaidRef.current.querySelectorAll('.node');
    nodes.forEach((node) => {
      const nodeId = node.id;
      const matchedKey = Object.keys(roadmap.nodes).find((key) => nodeId.includes(key));

      if (matchedKey) {
        const status = nodeStates[matchedKey] || 'not-started';
        const colors = statusColors[status];

        const rect = node.querySelector('rect, polygon, circle, path');
        if (rect) {
          (rect as SVGElement).style.fill = colors.bg;
          (rect as SVGElement).style.stroke = colors.border;
          (rect as SVGElement).style.strokeWidth = '2px';
        }
      }
    });
  }, [nodeStates, roadmap]);

  // Re-apply styles when states change
  useEffect(() => {
    applyNodeStyles();
  }, [nodeStates, applyNodeStyles]);

  // Setup click interactions on nodes
  const setupNodeInteractions = () => {
    if (!mermaidRef.current || !roadmap) return;

    const container = mermaidRef.current;
    container.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const nodeElement = target.closest('.node');

      if (nodeElement) {
        const fullId = nodeElement.id;
        const foundKey = Object.keys(roadmap.nodes).find((key) => fullId.includes(key));

        if (foundKey) {
          setSelectedNodeId(foundKey);
          setSidebarVisible(true);
        }
      }
    });
  };

  // Update node status
  const updateNodeStatus = (nodeId: string, status: NodeStatus) => {
    const newStates = { ...nodeStates, [nodeId]: status };
    setNodeStates(newStates);
    saveNodeStates(projectId, newStates);
  };

  // Reset all node states
  const resetAllStates = () => {
    setNodeStates({});
    localStorage.removeItem(getStorageKey(projectId));
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedNodeId) {
          setSelectedNodeId(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedNodeId]);

  // Get intra link for project
  const getIntraLink = (projectId: string) => {
    return `https://projects.intra.42.fr/projects/${projectId}`;
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!roadmap) return { completed: 0, inProgress: 0, skipped: 0, total: 0 };
    const nodeKeys = Object.keys(roadmap.nodes);
    const total = nodeKeys.length;
    const completed = nodeKeys.filter((k) => nodeStates[k] === 'completed').length;
    const inProgress = nodeKeys.filter((k) => nodeStates[k] === 'in-progress').length;
    const skipped = nodeKeys.filter((k) => nodeStates[k] === 'skipped').length;
    return { completed, inProgress, skipped, total };
  };

  const progress = calculateProgress();
  const selectedNode = selectedNodeId && roadmap?.nodes[selectedNodeId];

  if (!roadmap) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center animate-pulse">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Custom styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.4s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }

        .mermaid {
          display: flex;
          justify-content: center;
          width: 100%;
          overflow: visible;
        }

        g.node {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        g.node:hover {
          filter: brightness(0.95) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
        }

        g.node rect, g.node polygon, g.node circle, g.node path {
          transition: all 0.3s ease;
          rx: 8px !important;
          ry: 8px !important;
        }

        g.node .label {
          font-family: 'Inter', system-ui, sans-serif !important;
          font-weight: 600 !important;
          fill: #334155 !important;
          font-size: 12px !important;
          pointer-events: none;
        }

        .edgePath .path {
          stroke: #cbd5e1 !important;
          stroke-width: 2px !important;
          transition: stroke 0.3s ease;
        }

        .cluster rect {
          fill: rgba(241, 245, 249, 0.5) !important;
          stroke: #e2e8f0 !important;
          stroke-width: 1px !important;
          rx: 12px !important;
        }

        .cluster .nodeLabel {
          font-family: 'Inter', system-ui, sans-serif !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px;
          fill: #64748b !important;
          text-transform: uppercase;
        }

        .roadmap-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .roadmap-scroll::-webkit-scrollbar {
          display: none;
        }

        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
        }
      `}</style>

      <div
        ref={containerRef}
        className={`fixed inset-0 z-50 bg-[#fafafa] transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Subtle background gradient */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-sky-100/40 to-teal-100/30 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/6 w-[400px] h-[400px] bg-gradient-to-tr from-teal-100/30 to-cyan-100/20 rounded-full filter blur-[80px]" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
          <div className="max-w-full mx-auto py-3 px-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200 group"
              >
                <svg
                  className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-teal-400 to-sky-500 rounded-full" />
                <h1 className="text-lg font-bold text-slate-800">
                  {roadmap.projectTitle}
                </h1>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  {progress.completed}/{progress.total} completed
                </span>
              </div>

              <button
                onClick={resetAllStates}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg transition-all duration-200 bg-white"
              >
                Reset Progress
              </button>

              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200 md:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress bar in header */}
          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-sky-500 transition-all duration-500"
              style={{
                width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%`,
              }}
            />
          </div>
        </header>

        {/* Main content with sidebar */}
        <div className="flex h-[calc(100vh-61px)]">
          {/* Roadmap area */}
          <div
            className="flex-1 overflow-auto roadmap-scroll p-6 relative"
            onClick={(e) => {
              // If clicking on the roadmap area (not on a node), clear the selected node
              const target = e.target as HTMLElement;
              const isNode = target.closest('.node');
              if (!isNode && selectedNodeId) {
                setSelectedNodeId(null);
              }
            }}
          >
            {/* Mermaid diagram */}
            <div
              className={`pb-12 pt-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              <div
                ref={mermaidRef}
                className="mermaid min-h-[400px]"
              />
            </div>

            {/* Legend */}
            <div className={`max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                {Object.entries(statusColors).map(([status, colors]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.dot }}
                    />
                    <span>{colors.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside
            className={`w-96 md:w-[420px] border-l border-slate-200/50 bg-white/80 backdrop-blur-sm flex flex-col transition-all duration-300 ${
              sidebarVisible ? 'translate-x-0' : 'translate-x-full'
            } fixed md:relative right-0 top-[61px] h-[calc(100vh-61px)] z-30`}
          >
            <div className="flex-1 overflow-y-auto sidebar-scroll">
              {selectedNode ? (
                /* Selected node details */
                <div className="p-6 animate-fade-in-left">
                  <div className="mb-4">
                    <span className="text-xs font-medium text-teal-600 uppercase tracking-wider">
                      Node Details
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Click anywhere on roadmap to go back</p>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-4">{selectedNode.title}</h3>

                  <p className="text-slate-600 leading-relaxed mb-6 border-l-2 border-slate-200 pl-4">
                    {selectedNode.explanation}
                  </p>

                  {/* Status selector */}
                  <div className="mb-6">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-3">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(statusColors) as NodeStatus[]).map((status) => {
                        const colors = statusColors[status];
                        const isActive = (nodeStates[selectedNodeId!] || 'not-started') === status;
                        return (
                          <button
                            key={status}
                            onClick={() => updateNodeStatus(selectedNodeId!, status)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              isActive
                                ? 'ring-2 ring-offset-2 ring-offset-white'
                                : 'hover:bg-slate-50'
                            }`}
                            style={{
                              backgroundColor: isActive ? colors.bg : 'transparent',
                              borderColor: colors.border,
                              border: `1px solid ${isActive ? colors.border : '#e2e8f0'}`,
                              color: isActive ? colors.border : '#64748b',
                              // @ts-expect-error -- ring color via CSS custom property
                              '--tw-ring-color': isActive ? colors.border : undefined,
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: colors.dot }}
                            />
                            {colors.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resources */}
                  {selectedNode.resources && selectedNode.resources.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-3">
                        Resources
                      </label>
                      <div className="space-y-2">
                        {selectedNode.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-teal-300 rounded-lg transition-all duration-200 group"
                          >
                            <span className="text-sm font-medium text-teal-600 group-hover:text-teal-700">
                              {resource.label}
                            </span>
                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transform group-hover:translate-x-0.5 transition-all"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Project overview sidebar */
                <div className="p-6 animate-fade-in-left">
                  <span className="text-xs font-medium text-teal-600 uppercase tracking-wider block mb-4">
                    Project Overview
                  </span>

                  <h3 className="text-xl font-bold text-slate-800 mb-4">{roadmap.projectTitle}</h3>

                  <p className="text-slate-600 leading-relaxed mb-6">{roadmap.overview}</p>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-2xl font-bold text-slate-800">{progress.total}</div>
                      <div className="text-xs text-slate-500">Total Concepts</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-2xl font-bold text-teal-600">{progress.completed}</div>
                      <div className="text-xs text-slate-500">Completed</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-2xl font-bold text-sky-500">{progress.inProgress}</div>
                      <div className="text-xs text-slate-500">In Progress</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-2xl font-bold text-red-400">{progress.skipped}</div>
                      <div className="text-xs text-slate-500">Skipped</div>
                    </div>
                  </div>

                  {/* Intra link */}
                  <a
                    href={getIntraLink(projectId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-xl transition-all duration-200 group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">42</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-800">View on Intra</div>
                        <div className="text-xs text-slate-500">Official project page</div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transform group-hover:translate-x-0.5 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>

                  {/* Tip */}
                  <div className="mt-6 p-4 bg-teal-50 border border-teal-200/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-teal-700 mb-1">Tip</div>
                        <div className="text-xs text-teal-600/80 leading-relaxed">
                          Click on any node in the roadmap to see its details, explanation, and
                          resources. Track your progress by setting each concept&apos;s status.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
