'use client';

import { useEffect, useState } from 'react';
import { getRoadmapByProjectId, type ProjectRoadmap } from '@/lib/roadmaps';

interface ProjectRoadmapViewProps {
  projectId: string;
  onClose: () => void;
}

// Simple roadmap node structure
interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

// Roadmap row - nodes that appear on the same horizontal level
interface RoadmapRow {
  nodes: RoadmapNode[];
  connections: { from: string; to: string }[];
}

// Mock roadmap data - horizontal flow with branching
const getMockRoadmap = (projectId: string): RoadmapRow[] => {
  // Default roadmap structure that works for any project
  return [
    {
      nodes: [
        { id: 'start', title: 'Project Setup', description: 'Initialize your development environment and understand the project requirements', status: 'completed' },
      ],
      connections: [],
    },
    {
      nodes: [
        { id: 'basics-1', title: 'Core Concepts', description: 'Learn the fundamental concepts and theory behind the project', status: 'completed' },
        { id: 'basics-2', title: 'Tools & Libraries', description: 'Set up necessary tools, libraries, and dependencies', status: 'completed' },
      ],
      connections: [
        { from: 'start', to: 'basics-1' },
        { from: 'start', to: 'basics-2' },
      ],
    },
    {
      nodes: [
        { id: 'impl-1', title: 'Basic Implementation', description: 'Implement the core functionality with basic features', status: 'current' },
      ],
      connections: [
        { from: 'basics-1', to: 'impl-1' },
        { from: 'basics-2', to: 'impl-1' },
      ],
    },
    {
      nodes: [
        { id: 'feat-1', title: 'Feature A', description: 'Implement the first major feature or module', status: 'upcoming' },
        { id: 'feat-2', title: 'Feature B', description: 'Implement the second major feature or module', status: 'upcoming' },
        { id: 'feat-3', title: 'Feature C', description: 'Implement additional features or optimizations', status: 'upcoming' },
      ],
      connections: [
        { from: 'impl-1', to: 'feat-1' },
        { from: 'impl-1', to: 'feat-2' },
        { from: 'impl-1', to: 'feat-3' },
      ],
    },
    {
      nodes: [
        { id: 'integrate', title: 'Integration', description: 'Combine all components and ensure they work together seamlessly', status: 'upcoming' },
      ],
      connections: [
        { from: 'feat-1', to: 'integrate' },
        { from: 'feat-2', to: 'integrate' },
        { from: 'feat-3', to: 'integrate' },
      ],
    },
    {
      nodes: [
        { id: 'test', title: 'Testing', description: 'Write tests and validate all edge cases', status: 'upcoming' },
        { id: 'docs', title: 'Documentation', description: 'Document your code and write usage instructions', status: 'upcoming' },
      ],
      connections: [
        { from: 'integrate', to: 'test' },
        { from: 'integrate', to: 'docs' },
      ],
    },
    {
      nodes: [
        { id: 'complete', title: 'Project Complete', description: 'Final review and submission', status: 'upcoming' },
      ],
      connections: [
        { from: 'test', to: 'complete' },
        { from: 'docs', to: 'complete' },
      ],
    },
  ];
};

// Node component
function RoadmapNodeCard({ node, isSelected, onClick }: { node: RoadmapNode; isSelected: boolean; onClick: () => void }) {
  const statusStyles = {
    completed: 'border-slate-300 bg-slate-50',
    current: 'border-slate-400 bg-white shadow-sm',
    upcoming: 'border-slate-200 bg-slate-50/50',
  };

  const dotStyles = {
    completed: 'bg-slate-400',
    current: 'bg-slate-600',
    upcoming: 'bg-slate-300',
  };

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-44 p-4 rounded-xl border-2 transition-all duration-200
        hover:shadow-md hover:border-slate-400
        ${statusStyles[node.status]}
        ${isSelected ? 'ring-2 ring-slate-400 ring-offset-2' : ''}
      `}
    >
      {/* Status dot */}
      <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full ${dotStyles[node.status]}`} />

      <h3 className="text-sm font-medium text-slate-700 text-left leading-tight">
        {node.title}
      </h3>
    </button>
  );
}

// Arrow/connector component
function Connector({ direction }: { direction: 'down' | 'right' | 'branch-down' }) {
  if (direction === 'down') {
    return (
      <div className="flex justify-center py-3">
        <svg width="24" height="32" viewBox="0 0 24 32" className="text-slate-300">
          <path d="M12 0 L12 24 M6 18 L12 24 L18 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return null;
}

export default function ProjectRoadmapView({ projectId, onClose }: ProjectRoadmapViewProps) {
  const [roadmap, setRoadmap] = useState<ProjectRoadmap | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const roadmapRows = getMockRoadmap(projectId);

  // Load roadmap data
  useEffect(() => {
    const roadmapData = getRoadmapByProjectId(projectId);
    setRoadmap(roadmapData || null);
    requestAnimationFrame(() => setIsVisible(true));
  }, [projectId]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedNode) {
          setSelectedNode(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedNode]);

  if (!roadmap) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <p className="text-slate-500">No roadmap available yet.</p>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#fafafa] transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Header Section */}
      <div className="relative min-h-[50vh] flex items-center justify-center px-6 pt-16">
        <div className="text-center max-w-2xl">
          {/* Back button */}
          <button
            onClick={onClose}
            className="absolute top-8 left-8 p-3 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <h1 className="text-5xl md:text-6xl font-medium text-slate-800 tracking-tight mb-8">
            <span className="text-slate-400">Master</span> {roadmap.projectTitle}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            {roadmap.overview}
          </p>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="px-6 pb-24 pt-8">
        <div className="max-w-5xl mx-auto">
          {/* Roadmap visualization */}
          <div className="relative">
            {roadmapRows.map((row, rowIndex) => (
              <div key={rowIndex}>
                {/* Row of nodes */}
                <div className="flex justify-center items-start gap-6 flex-wrap">
                  {row.nodes.map((node) => (
                    <RoadmapNodeCard
                      key={node.id}
                      node={node}
                      isSelected={selectedNode?.id === node.id}
                      onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                    />
                  ))}
                </div>

                {/* Connector to next row */}
                {rowIndex < roadmapRows.length - 1 && (
                  <Connector direction="down" />
                )}
              </div>
            ))}
          </div>

          {/* Selected node details */}
          {selectedNode && (
            <div className="mt-12 p-6 bg-white rounded-xl border border-slate-200 shadow-sm max-w-lg mx-auto">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-slate-800">{selectedNode.title}</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">{selectedNode.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className={`
                  inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                  ${selectedNode.status === 'completed' ? 'bg-slate-100 text-slate-600' : ''}
                  ${selectedNode.status === 'current' ? 'bg-slate-200 text-slate-700' : ''}
                  ${selectedNode.status === 'upcoming' ? 'bg-slate-50 text-slate-500' : ''}
                `}>
                  {selectedNode.status === 'completed' && 'Completed'}
                  {selectedNode.status === 'current' && 'In Progress'}
                  {selectedNode.status === 'upcoming' && 'Upcoming'}
                </span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-16 flex justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-600" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
