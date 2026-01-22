'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ArchitectureData {
  project_title: string;
  promise: string;
  project_overview: string;
  roadmap_mermaid: string;
  nodes: {
    [key: string]: {
      title: string;
      explanation: string;
      resources: { label: string; url: string }[];
    };
  };
}

interface ArchitectureVisualizerProps {
  projectId: string;
  architectureData: ArchitectureData;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mermaid-container': any;
    }
  }
}

export default function ArchitectureVisualizer({ projectId, architectureData }: ArchitectureVisualizerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    loadMermaid();
  }, []);

  const loadMermaid = async () => {
    const mermaidModule = (await import('mermaid')).default;
    mermaidModule.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
        padding: 30,
        nodeSpacing: 50,
        rankSpacing: 50,
      },
      themeVariables: {
        primaryColor: '#0f172a',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#334155',
        lineColor: '#06b6d4',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        mainBkg: '#020617',
        clusterBkg: 'rgba(30, 41, 59, 0.2)',
        clusterBorder: '#1e293b',
        defaultLinkColor: '#475569',
        fontFamily: 'Inter',
      },
    });

    const container = document.getElementById('mermaid-container');
    if (container) {
      const { svg } = await mermaidModule.render('mermaid-svg', architectureData.roadmap_mermaid);
      container.innerHTML = svg;
      setupInteractions();
    }
  };

  const setupInteractions = () => {
    const container = document.getElementById('mermaid-container');
    if (!container) return;

    container.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const nodeElement = target.closest('.node');

      if (nodeElement) {
        const fullId = nodeElement.id;
        const foundKey = Object.keys(architectureData.nodes).find(key => fullId.includes(key));

        if (foundKey) {
          setSelectedNode(foundKey);
          setShowModal(true);
        }
      }
    });
  };

  const currentNodeData = selectedNode && architectureData.nodes[selectedNode];

  return (
    <>
      <style>{`
        :root {
          --bg-deep: #020617;
          --bg-card: #0f172a;
          --accent-primary: #06b6d4;
          --accent-secondary: #8b5cf6;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
        }

        .mermaid {
          display: flex;
          justify-content: center;
          width: 100%;
          overflow: visible;
        }

        g.node rect, g.node polygon, g.node circle, g.node path {
          fill: rgba(15, 23, 42, 0.8) !important;
          stroke: #334155 !important;
          stroke-width: 2px !important;
          rx: 4px !important;
          ry: 4px !important;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
          transition: all 0.2s ease;
          cursor: pointer;
        }

        g.node:hover rect, g.node:hover polygon, g.node:hover circle, g.node:hover path {
          stroke: var(--accent-primary) !important;
          filter: drop-shadow(0 0 15px rgba(6, 182, 212, 0.3));
          fill: rgba(6, 182, 212, 0.15) !important;
        }

        g.node .label {
          font-family: 'Inter', sans-serif !important;
          font-weight: 700 !important;
          fill: #e2e8f0 !important;
          font-size: 13px !important;
          pointer-events: none;
        }

        g.node:hover .label {
          fill: #ffffff !important;
        }

        .edgePath .path {
          stroke: #475569 !important;
          stroke-width: 2px !important;
        }

        .edgeLabel {
          background-color: var(--bg-deep) !important;
          color: var(--accent-primary) !important;
          padding: 3px 6px;
          border-radius: 4px;
          border: 1px solid #1e293b;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: bold;
          z-index: 10;
        }

        g.edgeLabel rect {
          fill: var(--bg-deep) !important;
          opacity: 1 !important;
        }

        .cluster rect {
          fill: rgba(30, 41, 59, 0.1) !important;
          stroke: #1e293b !important;
          stroke-width: 1px !important;
          stroke-dasharray: 4 4;
          rx: 8px !important;
        }

        .cluster .nodeLabel {
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 12px !important;
          font-weight: bold !important;
          letter-spacing: 1px;
          fill: var(--accent-secondary) !important;
          text-transform: uppercase;
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      <div className="min-h-screen bg-slate-950 overflow-hidden" style={{
        backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
        {/* Header */}
        <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto py-3 px-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                {architectureData.project_title} <span className="text-slate-600 text-xs">// Architecture</span>
              </h1>
            </div>
            <Link href="/dashboard" className="text-[10px] font-mono text-cyan-500/70 border border-cyan-900/50 px-3 py-1.5 rounded bg-cyan-950/20 uppercase hover:bg-cyan-950/40 transition-colors">
              ← Back
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full max-w-[1400px] mx-auto p-4 md:p-6 relative">
          {/* Overview Section */}
          <section className="mb-8 relative z-10">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-violet-600"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition duration-700"></div>

              <h2 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mission Briefing
              </h2>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light mb-4">
                {architectureData.project_overview}
              </p>

              <div className="mt-4 flex gap-4 text-xs font-mono text-slate-500 border-t border-slate-800/50 pt-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span>Logic</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500"></span>Scheduling</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Critical</span>
              </div>
            </div>
          </section>

          {/* Mermaid Graph */}
          <div id="mermaid-container" className="mermaid pb-24"></div>
        </main>

        {/* Modal */}
        {showModal && currentNodeData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-slate-900/95 backdrop-blur-lg border border-slate-700/50 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b border-slate-700/50 bg-slate-900/80">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 block">Node Details</span>
                    <h2 className="text-2xl font-bold text-white tracking-tight font-mono">{currentNodeData.title}</h2>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <p className="text-slate-300 leading-relaxed text-lg border-l-2 border-slate-700 pl-4 mb-8">
                  {currentNodeData.explanation}
                </p>

                {currentNodeData.resources && currentNodeData.resources.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 font-mono">External Resources</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentNodeData.resources.map((res, idx) => (
                        <li key={idx}>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-slate-800/50 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 p-3 rounded-lg transition-all group flex justify-between items-center"
                          >
                            <span className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">{res.label}</span>
                            <svg className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
