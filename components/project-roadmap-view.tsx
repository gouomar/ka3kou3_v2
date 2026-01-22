'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getRoadmapByProjectId, type ProjectRoadmap, type RoadmapNode } from '@/lib/roadmaps';

interface ProjectRoadmapViewProps {
  projectId: string;
  onClose: () => void;
}

// Define roadmap structure with phases
interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  icon: string;
  nodes: {
    id: string;
    title: string;
    description: string;
    isSubNode?: boolean;
  }[];
}

// Codexion specific roadmap data
const codexionPhases: RoadmapPhase[] = [
  {
    id: 'init',
    title: 'Initialization',
    description: 'Set up the foundation for your concurrent system',
    icon: '🚀',
    nodes: [
      { id: 'args', title: 'Argument Parsing', description: 'Validate inputs: integers, positive values, scheduler type' },
      { id: 'god_struct', title: 'The God Struct', description: 'Central data structure holding all simulation state' },
      { id: 'mutex_init', title: 'Mutex Setup', description: 'Initialize synchronization primitives for thread safety', isSubNode: true },
      { id: 'time_init', title: 'Time Primitives', description: 'Precise time tracking using gettimeofday', isSubNode: true },
    ]
  },
  {
    id: 'runtime',
    title: 'Runtime Engine',
    description: 'The heart of your concurrent simulation',
    icon: '⚡',
    nodes: [
      { id: 'spawn', title: 'Spawn Threads', description: 'Launch N worker threads + 1 monitor thread' },
      { id: 'monitor', title: 'Watchdog Monitor', description: 'Continuously check for timeout conditions' },
      { id: 'routine', title: 'Coder Routine', description: 'The main loop: think → eat → sleep → repeat', isSubNode: true },
      { id: 'refactor', title: 'Refactor Action', description: 'Processing phase before resource request', isSubNode: true },
      { id: 'request', title: 'Request Resources', description: 'Attempt to acquire shared resources', isSubNode: true },
      { id: 'debug', title: 'Debug/Sleep', description: 'Rest period with precise timing', isSubNode: true },
    ]
  },
  {
    id: 'scheduler',
    title: 'The Scheduler',
    description: 'Arbitrate access and prevent deadlocks',
    icon: '🎯',
    nodes: [
      { id: 'arbiter', title: 'Arbitration Logic', description: 'Central decision making for resource allocation' },
      { id: 'policy', title: 'Scheduling Policy', description: 'Choose between FIFO or EDF strategies' },
      { id: 'fifo_q', title: 'FIFO Queue', description: 'First-in-first-out ordering', isSubNode: true },
      { id: 'heap', title: 'EDF Min-Heap', description: 'Earliest Deadline First with priority queue', isSubNode: true },
      { id: 'check', title: 'Availability Check', description: 'Verify resources are free before granting', isSubNode: true },
      { id: 'grant', title: 'Grant Locks', description: 'Safely transfer ownership of resources', isSubNode: true },
    ]
  },
  {
    id: 'termination',
    title: 'Shutdown',
    description: 'Clean termination and validation',
    icon: '🏁',
    nodes: [
      { id: 'join', title: 'Thread Join', description: 'Wait for all threads to complete' },
      { id: 'cleanup', title: 'Memory Cleanup', description: 'Free all allocated resources' },
      { id: 'helgrind', title: 'Race Detection', description: 'Verify zero data races with Valgrind', isSubNode: true },
    ]
  }
];

export default function ProjectRoadmapView({ projectId, onClose }: ProjectRoadmapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [roadmap, setRoadmap] = useState<ProjectRoadmap | null>(null);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load roadmap data
  useEffect(() => {
    const roadmapData = getRoadmapByProjectId(projectId);
    setRoadmap(roadmapData || null);

    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [projectId]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    setScrollY(container.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, onClose]);

  const handleNodeClick = (nodeId: string) => {
    if (roadmap?.nodes[nodeId]) {
      setSelectedNode(roadmap.nodes[nodeId]);
      setIsModalOpen(true);
    }
  };

  // Calculate node visibility based on scroll position
  const getNodeProgress = (phaseIndex: number, nodeIndex: number) => {
    const section = sectionRefs.current[phaseIndex];
    if (!section) return 0;

    const sectionTop = section.offsetTop - 200;
    const nodeOffset = nodeIndex * 60;
    const progress = (scrollY - sectionTop - nodeOffset) / 150;
    return Math.max(0, Math.min(1, progress));
  };

  if (!roadmap) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-slate-500">No roadmap available for this project yet.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const phases = projectId === 'codexion' ? codexionPhases : codexionPhases;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-white transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200" style={{ width: '400px' }}>
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Roadmap</p>
              <h1 className="text-lg font-bold text-slate-800">{roadmap.projectTitle}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-32">
        {/* Overview */}
        <div
          className="px-6 py-8 max-w-[380px]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'all 0.6s ease-out',
          }}
        >
          <p className="text-slate-600 text-sm leading-relaxed">{roadmap.overview}</p>
        </div>

        {/* Phases with branching animation */}
        {phases.map((phase, phaseIndex) => (
          <div
            key={phase.id}
            ref={(el) => { sectionRefs.current[phaseIndex] = el; }}
            className="relative mb-8"
          >
            {/* Phase header - Left side */}
            <div
              className="sticky top-20 z-10 px-6 py-4"
              style={{ width: '380px' }}
            >
              <div
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                style={{
                  opacity: getNodeProgress(phaseIndex, -2) > 0 ? 1 : 0.4,
                  transform: `translateX(${getNodeProgress(phaseIndex, -2) > 0 ? 0 : -10}px)`,
                  transition: 'all 0.4s ease-out',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{phase.icon}</span>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Phase {phaseIndex + 1}</span>
                    <h2 className="text-lg font-bold text-slate-800">{phase.title}</h2>
                  </div>
                </div>
                <p className="text-sm text-slate-500">{phase.description}</p>
              </div>
            </div>

            {/* Nodes - Branching to the right */}
            <div className="relative" style={{ minHeight: `${phase.nodes.length * 100 + 50}px` }}>
              {phase.nodes.map((node, nodeIndex) => {
                const progress = getNodeProgress(phaseIndex, nodeIndex);
                const isSubNode = node.isSubNode;

                // Calculate position - branches spread to the right
                const baseLeft = 380;
                const extraIndent = isSubNode ? 60 : 0;
                const topPosition = 20 + nodeIndex * 90;

                return (
                  <div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: `${baseLeft + extraIndent}px`,
                      top: `${topPosition}px`,
                      width: 'calc(100% - 450px)',
                      maxWidth: '500px',
                    }}
                  >
                    {/* Branch line from left */}
                    <svg
                      className="absolute pointer-events-none"
                      style={{
                        left: `-${80 + extraIndent}px`,
                        top: '24px',
                        width: `${80 + extraIndent}px`,
                        height: '2px',
                        overflow: 'visible',
                      }}
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2={80 + extraIndent}
                        y2="0"
                        stroke="#e2e8f0"
                        strokeWidth="2"
                        strokeDasharray={80 + extraIndent}
                        strokeDashoffset={(1 - progress) * (80 + extraIndent)}
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                      />
                      {/* Dot at the end */}
                      <circle
                        cx={80 + extraIndent}
                        cy="0"
                        r="4"
                        fill="#94a3b8"
                        style={{
                          opacity: progress,
                          transform: `scale(${progress})`,
                          transformOrigin: 'center',
                          transition: 'all 0.3s ease-out',
                        }}
                      />
                    </svg>

                    {/* Node card */}
                    <button
                      onClick={() => handleNodeClick(node.id)}
                      className={`w-full text-left rounded-xl border transition-all duration-300 ${
                        isSubNode
                          ? 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200 p-4'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md p-5'
                      }`}
                      style={{
                        opacity: progress,
                        transform: `translateX(${(1 - progress) * 40}px)`,
                        transition: 'all 0.5s ease-out',
                        pointerEvents: progress > 0.5 ? 'auto' : 'none',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-slate-800 ${isSubNode ? 'text-sm' : ''}`}>
                            {node.title}
                          </h3>
                          <p className={`text-slate-500 mt-1 ${isSubNode ? 'text-xs' : 'text-sm'}`}>
                            {node.description}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* Vertical connector to next phase */}
              {phaseIndex < phases.length - 1 && (
                <div
                  className="absolute left-[190px] bg-slate-200"
                  style={{
                    top: '100%',
                    width: '2px',
                    height: '40px',
                    opacity: getNodeProgress(phaseIndex, phase.nodes.length - 1),
                    transition: 'opacity 0.3s ease-out',
                  }}
                />
              )}
            </div>
          </div>
        ))}

        {/* Completion */}
        <div
          className="px-6 py-12 max-w-[380px]"
          style={{
            opacity: getNodeProgress(phases.length - 1, phases[phases.length - 1].nodes.length) > 0.5 ? 1 : 0,
            transform: getNodeProgress(phases.length - 1, phases[phases.length - 1].nodes.length) > 0.5
              ? 'translateY(0)'
              : 'translateY(20px)',
            transition: 'all 0.5s ease-out',
          }}
        >
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="font-bold text-slate-800">Complete!</h3>
                <p className="text-sm text-slate-500">You&apos;ve explored the roadmap</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side placeholder for chatbot */}
      <div className="fixed right-8 bottom-8 w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all cursor-pointer shadow-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>

      {/* Node Detail Modal */}
      {isModalOpen && selectedNode && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div
            className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200 animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">
                    Details
                  </span>
                  <h2 className="text-xl font-bold text-slate-800">{selectedNode.title}</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-slate-300 mb-6">
                <p className="text-slate-600 leading-relaxed">
                  {selectedNode.explanation}
                </p>
              </div>

              {selectedNode.resources.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Resources
                  </h3>
                  <ul className="space-y-2">
                    {selectedNode.resources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all duration-200 group"
                        >
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                            {resource.label}
                          </span>
                          <svg
                            className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transform group-hover:translate-x-1 transition-all duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedNode.resources.length === 0 && (
                <div className="text-center py-6 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No resources available yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-modal-in {
          animation: modal-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
