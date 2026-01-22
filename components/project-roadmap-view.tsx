'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getRoadmapByProjectId, type ProjectRoadmap, type RoadmapNode as RoadmapNodeData } from '@/lib/roadmaps';

interface ProjectRoadmapViewProps {
  projectId: string;
  onClose: () => void;
}

type NodeState = 'not-started' | 'in-progress' | 'completed' | 'skipped';

interface NodeStates {
  [nodeId: string]: NodeState;
}

// Helper to get/set localStorage
const getStoredNodeStates = (projectId: string): NodeStates => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(`roadmap-states-${projectId}`);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const setStoredNodeStates = (projectId: string, states: NodeStates) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`roadmap-states-${projectId}`, JSON.stringify(states));
};

// Parse mermaid diagram to extract nodes and connections
interface ParsedDiagram {
  nodes: { id: string; label: string }[];
  connections: { from: string; to: string }[];
}

const parseNodesFromDiagram = (diagram: string): string[] => {
  const nodeIds: string[] = [];
  const nodePattern = /(\w+)[\[\(\{]/g;
  let match;
  while ((match = nodePattern.exec(diagram)) !== null) {
    const nodeId = match[1];
    if (!['subgraph', 'direction', 'flowchart', 'start', 'finish', 'end'].includes(nodeId.toLowerCase())) {
      if (!nodeIds.includes(nodeId)) {
        nodeIds.push(nodeId);
      }
    }
  }
  return nodeIds;
};

const parseDiagramStructure = (diagram: string): ParsedDiagram => {
  const nodes: { id: string; label: string }[] = [];
  const connections: { from: string; to: string }[] = [];
  const seenNodeIds = new Set<string>();

  // Extract nodes with labels
  const nodePatterns = [
    /(\w+)\[([^\]]+)\]/g,      // node[label]
    /(\w+)\(\(([^)]+)\)\)/g,  // node((label))
    /(\w+)\{([^}]+)\}/g,       // node{label}
  ];

  for (const pattern of nodePatterns) {
    let match;
    while ((match = pattern.exec(diagram)) !== null) {
      const nodeId = match[1];
      const label = match[2].replace(/^\d+\.\s*/, '');
      if (!['subgraph', 'direction', 'flowchart', 'start', 'finish', 'end'].includes(nodeId.toLowerCase())) {
        if (!seenNodeIds.has(nodeId)) {
          seenNodeIds.add(nodeId);
          nodes.push({ id: nodeId, label });
        }
      }
    }
  }

  // Extract connections (A --> B or A --> B[label])
  const connectionPattern = /(\w+)\s*-->\s*(\w+)/g;
  let connMatch;
  while ((connMatch = connectionPattern.exec(diagram)) !== null) {
    const from = connMatch[1];
    const to = connMatch[2];
    if (!['subgraph', 'direction', 'flowchart'].includes(from.toLowerCase()) &&
        !['subgraph', 'direction', 'flowchart'].includes(to.toLowerCase())) {
      connections.push({ from, to });
    }
  }

  return { nodes, connections };
};

// Extract node label from diagram
const extractNodeLabel = (diagram: string, nodeId: string): string => {
  const patterns = [
    new RegExp(`${nodeId}\\[([^\\]]+)\\]`),
    new RegExp(`${nodeId}\\(\\(([^)]+)\\)\\)`),
    new RegExp(`${nodeId}\\{([^}]+)\\}`),
  ];
  for (const pattern of patterns) {
    const match = diagram.match(pattern);
    if (match) {
      return match[1].replace(/^\d+\.\s*/, ''); // Remove numbering like "1. "
    }
  }
  return nodeId;
};

// Node component
function RoadmapNodeCard({
  nodeId,
  label,
  state,
  isSelected,
  onClick,
  index
}: {
  nodeId: string;
  label: string;
  state: NodeState;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const stateStyles = {
    'not-started': 'border-slate-200 bg-white hover:border-slate-300',
    'in-progress': 'border-sky-300 bg-sky-50 hover:border-sky-400',
    'completed': 'border-teal-300 bg-teal-50 hover:border-teal-400',
    'skipped': 'border-slate-200 bg-slate-100 opacity-60 hover:opacity-80',
  };

  const dotStyles = {
    'not-started': 'bg-slate-300',
    'in-progress': 'bg-sky-500',
    'completed': 'bg-teal-500',
    'skipped': 'bg-slate-400',
  };

  return (
    <button
      onClick={onClick}
      className={`
        group relative px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out
        hover:shadow-md hover:-translate-y-0.5
        ${stateStyles[state]}
        ${isSelected ? 'ring-2 ring-slate-400 ring-offset-2 shadow-md' : ''}
      `}
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s both`,
      }}
    >
      {/* Status dot */}
      <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full transition-colors ${dotStyles[state]}`} />

      <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

// Flowchart visualization component
function FlowchartView({
  diagram,
  nodeStates,
  selectedNodeId,
  onNodeClick,
}: {
  diagram: string;
  nodeStates: NodeStates;
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
}) {
  const { nodes, connections } = useMemo(() => parseDiagramStructure(diagram), [diagram]);

  // Build adjacency list and levels for layout
  const { levels, nodePositions } = useMemo(() => {
    const nodeMap = new Map<string, { id: string; label: string }>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    // Find root nodes (nodes with no incoming connections)
    const hasIncoming = new Set<string>();
    connections.forEach(c => hasIncoming.add(c.to));

    const roots = nodes.filter(n => !hasIncoming.has(n.id));

    // BFS to assign levels
    const levels: string[][] = [];
    const nodeLevel = new Map<string, number>();
    const visited = new Set<string>();

    // Start with roots at level 0
    let currentLevel = roots.length > 0 ? roots.map(r => r.id) : (nodes.length > 0 ? [nodes[0].id] : []);
    let level = 0;

    while (currentLevel.length > 0) {
      levels[level] = currentLevel;
      currentLevel.forEach(id => {
        nodeLevel.set(id, level);
        visited.add(id);
      });

      // Get children of current level
      const nextLevel: string[] = [];
      currentLevel.forEach(id => {
        connections.filter(c => c.from === id).forEach(c => {
          if (!visited.has(c.to) && !nextLevel.includes(c.to)) {
            nextLevel.push(c.to);
          }
        });
      });

      currentLevel = nextLevel;
      level++;
    }

    // Add any unvisited nodes
    nodes.forEach(n => {
      if (!visited.has(n.id)) {
        if (!levels[level]) levels[level] = [];
        levels[level].push(n.id);
        nodeLevel.set(n.id, level);
      }
    });

    // Calculate positions
    const nodePositions = new Map<string, { x: number; y: number }>();
    const nodeWidth = 160;
    const nodeHeight = 48;
    const horizontalGap = 40;
    const verticalGap = 60;

    levels.forEach((levelNodes, lvl) => {
      const levelWidth = levelNodes.length * nodeWidth + (levelNodes.length - 1) * horizontalGap;
      const startX = -levelWidth / 2;

      levelNodes.forEach((nodeId, idx) => {
        nodePositions.set(nodeId, {
          x: startX + idx * (nodeWidth + horizontalGap) + nodeWidth / 2,
          y: lvl * (nodeHeight + verticalGap),
        });
      });
    });

    return { levels, nodePositions };
  }, [nodes, connections]);

  // Calculate SVG dimensions
  const { svgWidth, svgHeight, offsetX, offsetY } = useMemo(() => {
    let minX = 0, maxX = 0, maxY = 0;
    nodePositions.forEach(pos => {
      minX = Math.min(minX, pos.x - 80);
      maxX = Math.max(maxX, pos.x + 80);
      maxY = Math.max(maxY, pos.y + 48);
    });
    return {
      svgWidth: maxX - minX + 100,
      svgHeight: maxY + 80,
      offsetX: -minX + 50,
      offsetY: 40,
    };
  }, [nodePositions]);

  const getStateColor = (state: NodeState | undefined) => {
    switch (state) {
      case 'completed': return { bg: 'bg-teal-50', border: 'border-teal-300', dot: 'bg-teal-500' };
      case 'in-progress': return { bg: 'bg-sky-50', border: 'border-sky-300', dot: 'bg-sky-500' };
      case 'skipped': return { bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-400' };
      case 'not-started': return { bg: 'bg-slate-50', border: 'border-slate-300', dot: 'bg-slate-400' };
      default: return { bg: 'bg-white', border: 'border-slate-200', dot: 'bg-slate-300' };
    }
  };

  return (
    <div className="relative" style={{ width: svgWidth, height: svgHeight, margin: '0 auto' }}>
      {/* SVG for connections */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={svgWidth}
        height={svgHeight}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>
        {connections.map((conn, i) => {
          const fromPos = nodePositions.get(conn.from);
          const toPos = nodePositions.get(conn.to);
          if (!fromPos || !toPos) return null;

          const x1 = fromPos.x + offsetX;
          const y1 = fromPos.y + offsetY + 24; // bottom of node
          const x2 = toPos.x + offsetX;
          const y2 = toPos.y + offsetY - 4; // top of node with arrow space

          // Calculate path
          const midY = (y1 + y2) / 2;
          const path = x1 === x2
            ? `M ${x1} ${y1} L ${x2} ${y2}`
            : `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

          return (
            <path
              key={i}
              d={path}
              stroke="#cbd5e1"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;

        const state = nodeStates[node.id];
        const colors = getStateColor(state);
        const isSelected = selectedNodeId === node.id;

        return (
          <button
            key={node.id}
            onClick={() => onNodeClick(node.id)}
            className={`
              absolute px-4 py-2.5 rounded-xl border-2 transition-all duration-300 ease-out
              hover:shadow-md hover:-translate-y-0.5 text-left
              ${colors.bg} ${colors.border}
              ${isSelected ? 'ring-2 ring-slate-400 ring-offset-2 shadow-md' : ''}
            `}
            style={{
              left: pos.x + offsetX - 80,
              top: pos.y + offsetY - 24,
              width: 160,
              animation: `fadeSlideIn 0.4s ease-out ${index * 0.03}s both`,
            }}
          >
            <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full transition-colors ${colors.dot}`} />
            <span className="text-sm font-medium text-slate-700 line-clamp-1">
              {node.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Sidebar component
function Sidebar({
  roadmap,
  selectedNodeId,
  nodeStates,
  onStateChange,
  onResetAll,
  onClose,
  allNodeIds,
}: {
  roadmap: ProjectRoadmap;
  selectedNodeId: string | null;
  nodeStates: NodeStates;
  onStateChange: (nodeId: string, state: NodeState | null) => void;
  onResetAll: () => void;
  onClose: () => void;
  allNodeIds: string[];
}) {
  const selectedNode = selectedNodeId ? roadmap.nodes[selectedNodeId] : null;
  const currentState = selectedNodeId ? (nodeStates[selectedNodeId] || null) : null;

  const stateOptions: { value: NodeState | null; label: string; color: string; activeColor: string }[] = [
    { value: null, label: 'No State', color: 'bg-white text-slate-400 border-slate-200', activeColor: 'bg-slate-50 text-slate-600 border-slate-300 ring-2 ring-offset-1 ring-slate-200' },
    { value: 'not-started', label: 'Not Started', color: 'bg-white text-slate-500 border-slate-200', activeColor: 'bg-slate-100 text-slate-700 border-slate-300 ring-2 ring-offset-1 ring-slate-300' },
    { value: 'in-progress', label: 'Ongoing', color: 'bg-white text-slate-500 border-slate-200', activeColor: 'bg-sky-100 text-sky-700 border-sky-300 ring-2 ring-offset-1 ring-sky-300' },
    { value: 'completed', label: 'Finished', color: 'bg-white text-slate-500 border-slate-200', activeColor: 'bg-teal-100 text-teal-700 border-teal-300 ring-2 ring-offset-1 ring-teal-300' },
    { value: 'skipped', label: 'Skipped', color: 'bg-white text-slate-500 border-slate-200', activeColor: 'bg-orange-100 text-orange-700 border-orange-300 ring-2 ring-offset-1 ring-orange-300' },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-800">
            {selectedNode ? selectedNode.title : roadmap.projectTitle}
          </h2>
          {selectedNodeId && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {!selectedNodeId && (
          <a
            href={`https://projects.intra.42.fr/projects/${roadmap.projectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on Intra
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedNode ? (
          <div className="space-y-6 animate-fadeIn">
            {/* State selector */}
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 block">
                Status
              </label>
              <div className="flex flex-col gap-2">
                {stateOptions.map((option) => (
                  <button
                    key={option.value || 'no-state'}
                    onClick={() => onStateChange(selectedNodeId!, option.value)}
                    className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg border transition-all text-left ${
                      currentState === option.value
                        ? option.activeColor
                        : option.color + ' hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                Explanation
              </label>
              <p className="text-slate-600 leading-relaxed text-sm">
                {selectedNode.explanation}
              </p>
            </div>

            {/* Resources */}
            {selectedNode.resources.length > 0 && (
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                  Resources
                </label>
                <div className="space-y-2">
                  {selectedNode.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {resource.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Overview */}
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                Overview
              </label>
              <p className="text-slate-600 leading-relaxed text-sm">
                {roadmap.overview}
              </p>
            </div>

            {/* General resources */}
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
                Quick Actions
              </label>
              <div className="space-y-2">
                <button
                  onClick={onResetAll}
                  className="w-full flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset All Progress
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500">
                <span className="font-medium">Tip:</span> Click on any node in the roadmap to see its details and track your progress.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectRoadmapView({ projectId, onClose }: ProjectRoadmapViewProps) {
  const [roadmap, setRoadmap] = useState<ProjectRoadmap | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeStates, setNodeStates] = useState<NodeStates>({});

  // Load roadmap data
  useEffect(() => {
    const roadmapData = getRoadmapByProjectId(projectId);
    setRoadmap(roadmapData || null);

    // Load stored states
    const storedStates = getStoredNodeStates(projectId);
    setNodeStates(storedStates);

    requestAnimationFrame(() => setIsVisible(true));
  }, [projectId]);

  // Parse nodes from diagram
  const nodeIds = useMemo(() => {
    if (!roadmap) return [];
    return parseNodesFromDiagram(roadmap.mermaidDiagram);
  }, [roadmap]);

  // Calculate progress
  const { completedCount, totalCount } = useMemo(() => {
    const total = nodeIds.length;
    const completed = nodeIds.filter(id => nodeStates[id] === 'completed').length;
    return { completedCount: completed, totalCount: total };
  }, [nodeIds, nodeStates]);

  // Handle state change (null removes the state)
  const handleStateChange = useCallback((nodeId: string, state: NodeState | null) => {
    setNodeStates(prev => {
      const newStates = { ...prev };
      if (state === null) {
        delete newStates[nodeId];
      } else {
        newStates[nodeId] = state;
      }
      setStoredNodeStates(projectId, newStates);
      return newStates;
    });
  }, [projectId]);

  // Reset all states
  const handleResetAll = useCallback(() => {
    setNodeStates({});
    setStoredNodeStates(projectId, {});
    setSelectedNodeId(null);
  }, [projectId]);

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

  if (!roadmap) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="text-center animate-fadeIn">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#fafafa] transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* CSS for animations and custom scrollbar */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .roadmap-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .roadmap-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .roadmap-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .roadmap-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="h-full flex">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header
            className="flex-shrink-0 px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm"
            style={{ animation: 'fadeSlideIn 0.4s ease-out' }}
          >
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-slate-800">
                    {roadmap.projectTitle}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{completedCount}/{totalCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span>Not Started</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>Skipped</span>
                </div>
              </div>
            </div>
          </header>

          {/* Roadmap area */}
          <div className="flex-1 overflow-auto roadmap-scroll p-8">
            <div
              className="min-w-max"
              style={{ animation: 'fadeSlideIn 0.5s ease-out 0.1s both' }}
            >
              {/* Render flowchart with connections */}
              <FlowchartView
                diagram={roadmap.mermaidDiagram}
                nodeStates={nodeStates}
                selectedNodeId={selectedNodeId}
                onNodeClick={(nodeId) => setSelectedNodeId(selectedNodeId === nodeId ? null : nodeId)}
              />

              {/* Empty state if no nodes found */}
              {nodeIds.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-500">No roadmap nodes available for this project yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className="w-96 flex-shrink-0 hidden md:block"
          style={{ animation: 'fadeSlideIn 0.5s ease-out 0.2s both' }}
        >
          <Sidebar
            roadmap={roadmap}
            selectedNodeId={selectedNodeId}
            nodeStates={nodeStates}
            onStateChange={handleStateChange}
            onResetAll={handleResetAll}
            onClose={() => setSelectedNodeId(null)}
            allNodeIds={nodeIds}
          />
        </div>
      </div>

      {/* Mobile sidebar (bottom sheet) */}
      {selectedNodeId && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-50">
          <div
            className="bg-black/20 fixed inset-0"
            onClick={() => setSelectedNodeId(null)}
          />
          <div className="relative bg-white rounded-t-2xl shadow-xl max-h-[70vh] overflow-auto animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between">
              <h3 className="font-medium text-slate-800">
                {roadmap.nodes[selectedNodeId]?.title || selectedNodeId}
              </h3>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {roadmap.nodes[selectedNodeId] && (
                <div className="space-y-4">
                  {/* State buttons */}
                  <div className="flex flex-wrap gap-2">
                    {(['not-started', 'in-progress', 'completed', 'skipped'] as NodeState[]).map((state) => (
                      <button
                        key={state}
                        onClick={() => handleStateChange(selectedNodeId, state)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          nodeStates[selectedNodeId] === state
                            ? state === 'completed' ? 'bg-teal-100 text-teal-700 border-teal-200'
                              : state === 'in-progress' ? 'bg-sky-100 text-sky-700 border-sky-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        {state.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">
                    {roadmap.nodes[selectedNodeId].explanation}
                  </p>
                  {roadmap.nodes[selectedNodeId].resources.length > 0 && (
                    <div className="space-y-2">
                      {roadmap.nodes[selectedNodeId].resources.map((r, i) => (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 bg-slate-50 rounded-lg text-sm text-slate-600"
                        >
                          {r.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Export a function to get progress for a project (used by project cards)
export function getProjectProgress(projectId: string): { completed: number; total: number } {
  if (typeof window === 'undefined') return { completed: 0, total: 0 };

  const roadmap = getRoadmapByProjectId(projectId);
  if (!roadmap) return { completed: 0, total: 0 };

  const nodeIds = parseNodesFromDiagram(roadmap.mermaidDiagram);
  const states = getStoredNodeStates(projectId);
  const completed = nodeIds.filter(id => states[id] === 'completed').length;

  return { completed, total: nodeIds.length };
}
