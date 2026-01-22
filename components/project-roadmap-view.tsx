'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getRoadmapByProjectId, type ProjectRoadmap } from '@/lib/roadmaps';

interface ProjectRoadmapViewProps {
  projectId: string;
  onClose: () => void;
}

// Define roadmap structure with phases and detailed content
interface RoadmapConcept {
  id: string;
  title: string;
  highlight: string;
  description: string;
  codePreview?: string;
  visual: 'code' | 'diagram' | 'terminal' | 'architecture';
}

interface RoadmapPhase {
  id: string;
  title: string;
  highlight: string;
  description: string;
  concepts: RoadmapConcept[];
}

// Codexion detailed roadmap data - cleaner structure
const codexionPhases: RoadmapPhase[] = [
  {
    id: 'init',
    title: 'Building the foundation with',
    highlight: 'Initialization',
    description: 'Before any thread comes alive, you need solid groundwork. Parse arguments, set up your data structures, and initialize all synchronization primitives.',
    concepts: [
      {
        id: 'args',
        title: 'Start with',
        highlight: 'argument validation',
        description: 'Parse command line inputs: number of coders, timing values, and scheduler type. Every value must be validated before the simulation begins.',
        codePreview: `parse_args(argc, argv, &config);
validate_positive_integers();
setup_scheduler_type();`,
        visual: 'terminal',
      },
      {
        id: 'god_struct',
        title: 'Design your',
        highlight: 'central data structure',
        description: 'The God Struct holds everything: coder states, mutex arrays, timing data, and termination flags. Single source of truth for the entire simulation.',
        codePreview: `typedef struct s_simulation {
    t_coder *coders;
    pthread_mutex_t *forks;
    long start_time;
    int death_flag;
} t_simulation;`,
        visual: 'architecture',
      },
      {
        id: 'mutex',
        title: 'Initialize all',
        highlight: 'synchronization primitives',
        description: 'Every mutex must be properly initialized before spawning threads. One per resource, plus print protection. Check every return value.',
        codePreview: `pthread_mutex_init(&sim->print_lock, NULL);
for (int i = 0; i < n; i++)
    pthread_mutex_init(&forks[i], NULL);`,
        visual: 'code',
      },
      {
        id: 'time',
        title: 'Master',
        highlight: 'precise timing',
        description: 'Microsecond accuracy matters. Use gettimeofday() for timestamps and implement custom sleep functions for precision that usleep cannot guarantee.',
        codePreview: `long get_time_ms(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec * 1000 + tv.tv_usec / 1000;
}`,
        visual: 'code',
      },
    ]
  },
  {
    id: 'runtime',
    title: 'Bringing threads to life in the',
    highlight: 'Runtime Engine',
    description: 'The heart of concurrency. Spawn threads, monitor for death conditions, and orchestrate the think-eat-sleep cycle with perfect synchronization.',
    concepts: [
      {
        id: 'spawn',
        title: 'Launch your',
        highlight: 'concurrent threads',
        description: 'Create N coder threads plus one monitor. Each thread gets its own identity and runs independently. Consider synchronizing start times.',
        codePreview: `for (int i = 0; i < n; i++)
    pthread_create(&threads[i], NULL,
        coder_routine, &coders[i]);
pthread_create(&monitor, NULL, watch, sim);`,
        visual: 'diagram',
      },
      {
        id: 'monitor',
        title: 'Implement the',
        highlight: 'watchdog monitor',
        description: 'A dedicated thread that continuously checks if any coder exceeded their time_to_die. When death is detected, signal all threads to stop.',
        codePreview: `while (!death_detected) {
    check_all_coders(sim);
    usleep(1000);
}
set_death_flag(sim);`,
        visual: 'terminal',
      },
      {
        id: 'routine',
        title: 'Perfect the',
        highlight: 'coder lifecycle',
        description: 'Think → Pick up forks → Eat → Put down forks → Sleep → Repeat. The order of operations and timing precision determines success.',
        codePreview: `while (alive) {
    think();
    take_forks();  // ordered!
    eat();
    release_forks();
    sleep_precise();
}`,
        visual: 'diagram',
      },
      {
        id: 'logging',
        title: 'Thread-safe',
        highlight: 'action logging',
        description: 'Every state change must be printed with a timestamp. Lock the print mutex, check death flag, print, unlock. Keep the critical section minimal.',
        codePreview: `pthread_mutex_lock(&print);
if (!death_flag)
    printf("%ld %d %s\\n", time, id, action);
pthread_mutex_unlock(&print);`,
        visual: 'terminal',
      },
    ]
  },
  {
    id: 'scheduler',
    title: 'Preventing chaos with',
    highlight: 'Smart Scheduling',
    description: 'Without proper scheduling, deadlocks and starvation will kill your simulation. Choose a strategy and implement it flawlessly.',
    concepts: [
      {
        id: 'deadlock',
        title: 'Avoid the deadly',
        highlight: 'circular wait',
        description: 'Deadlock occurs when threads form a waiting cycle. Break it by ordering resource acquisition - always pick lower-numbered fork first.',
        codePreview: `int first = MIN(left, right);
int second = MAX(left, right);
lock(first);
lock(second);`,
        visual: 'architecture',
      },
      {
        id: 'arbiter',
        title: 'Design a fair',
        highlight: 'arbitration system',
        description: 'The arbiter decides who gets resources and when. Queue requests, track ownership, prevent starvation. Consider condition variables for efficiency.',
        codePreview: `enqueue_request(coder);
while (!can_acquire(coder))
    pthread_cond_wait(&cond, &lock);
grant_forks(coder);`,
        visual: 'diagram',
      },
      {
        id: 'fifo',
        title: 'Simple and fair',
        highlight: 'FIFO scheduling',
        description: 'First come, first served. Requests are granted in arrival order. Easy to implement, guarantees no starvation, works well for most cases.',
        codePreview: `queue_add(request);
while (queue_head() != me)
    wait();
acquire_and_proceed();`,
        visual: 'code',
      },
      {
        id: 'edf',
        title: 'Deadline-aware',
        highlight: 'EDF scheduling',
        description: 'Earliest Deadline First prioritizes coders closest to death. Use a min-heap ordered by deadline. More complex but can handle edge cases.',
        codePreview: `deadline = last_meal + time_to_die;
heap_insert(coder, deadline);
urgent = heap_extract_min();
grant_to(urgent);`,
        visual: 'architecture',
      },
    ]
  },
  {
    id: 'termination',
    title: 'Clean exit with proper',
    highlight: 'Shutdown',
    description: 'Every thread must terminate gracefully. Join all threads, destroy all mutexes, free all memory. Zero leaks, zero races.',
    concepts: [
      {
        id: 'join',
        title: 'Wait for all',
        highlight: 'threads to finish',
        description: 'Call pthread_join on every thread you created. The monitor first (it controls termination), then all coders. Never detach threads.',
        codePreview: `pthread_join(monitor, NULL);
for (int i = 0; i < n; i++)
    pthread_join(coders[i].thread, NULL);`,
        visual: 'code',
      },
      {
        id: 'cleanup',
        title: 'Destroy and',
        highlight: 'free everything',
        description: 'Destroy mutexes in reverse order of creation. Free all allocated arrays. Run valgrind to verify zero leaks before submission.',
        codePreview: `for (int i = n - 1; i >= 0; i--)
    pthread_mutex_destroy(&forks[i]);
free(coders);
free(forks);`,
        visual: 'terminal',
      },
      {
        id: 'helgrind',
        title: 'Verify with',
        highlight: 'race detection tools',
        description: 'Run Helgrind and ThreadSanitizer. Every data race must be fixed. Common culprits: death flag reads, last_meal updates, print output.',
        codePreview: `$ valgrind --tool=helgrind ./codexion 4 410 200 200
$ valgrind --leak-check=full ./codexion 4 410 200 200`,
        visual: 'terminal',
      },
    ]
  }
];

export default function ProjectRoadmapView({ projectId, onClose }: ProjectRoadmapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [roadmap, setRoadmap] = useState<ProjectRoadmap | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const phases = projectId === 'codexion' ? codexionPhases : codexionPhases;
  const totalConcepts = phases.reduce((sum, phase) => sum + phase.concepts.length, 0);

  // Load roadmap data
  useEffect(() => {
    const roadmapData = getRoadmapByProjectId(projectId);
    setRoadmap(roadmapData || null);
    requestAnimationFrame(() => setIsVisible(true));
  }, [projectId]);

  // Scroll handler - calculates which phase/concept is active
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    setScrollProgress(progress);

    // Calculate active concept based on scroll position
    const conceptIndex = Math.floor(progress * totalConcepts);

    let conceptsBefore = 0;
    for (let i = 0; i < phases.length; i++) {
      if (conceptIndex < conceptsBefore + phases[i].concepts.length) {
        setActivePhaseIndex(i);
        setActiveConceptIndex(conceptIndex - conceptsBefore);
        break;
      }
      conceptsBefore += phases[i].concepts.length;
    }
  }, [phases, totalConcepts]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!roadmap) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <p className="text-slate-500">No roadmap available yet.</p>
      </div>
    );
  }

  const activePhase = phases[activePhaseIndex];
  const activeConcept = activePhase?.concepts[activeConceptIndex];

  // Render visual based on type
  const renderVisual = (concept: RoadmapConcept) => {
    if (!concept.codePreview) return null;

    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {/* Terminal-style code display */}
          <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#16162a] border-b border-[#2a2a4a]">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-slate-500 font-mono">codexion.c</span>
            </div>
            {/* Code content */}
            <div className="p-6 font-mono text-sm leading-relaxed">
              <pre className="text-[#a5b4fc] whitespace-pre-wrap">
                <code>{concept.codePreview}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#fafafa] transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Intro Section - Clean hero */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div
          className="text-center max-w-2xl"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 8),
            transform: `translateY(${scrollProgress * 100}px)`,
          }}
        >
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
          <p className="text-xl text-slate-500 leading-relaxed mb-12">
            {roadmap.overview}
          </p>
          <div className="text-slate-300">
            <svg className="w-8 h-8 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Tabs Section - Dark themed like Yoda website */}
      <section className="relative rounded-t-[2rem] bg-[#292929] min-h-screen" style={{ zIndex: 2 }}>
        <div className="py-16 md:py-24">
          {/* Scroll height for animation */}
          <div style={{ height: `${totalConcepts * 100}vh` }}>
            {/* Sticky container */}
            <div className="sticky top-0 h-screen">
              <div className="h-full max-w-7xl mx-auto px-6 md:px-12">
                <div className="h-full grid grid-cols-1 md:grid-cols-[0.4fr_1fr] gap-6">

                  {/* Left Panel - Text content that changes */}
                  <div className="bg-[#424242] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Phase content - stacked, opacity controlled */}
                    <div className="flex-1 relative">
                      {phases.map((phase, phaseIdx) => (
                        <div
                          key={phase.id}
                          className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
                          style={{ opacity: activePhaseIndex === phaseIdx ? 1 : 0 }}
                        >
                          {/* Concept content within phase */}
                          {phase.concepts.map((concept, conceptIdx) => (
                            <div
                              key={concept.id}
                              className="absolute inset-0 flex flex-col justify-center transition-all duration-500"
                              style={{
                                opacity: activePhaseIndex === phaseIdx && activeConceptIndex === conceptIdx ? 1 : 0,
                                transform: activePhaseIndex === phaseIdx && activeConceptIndex === conceptIdx
                                  ? 'translateY(0)'
                                  : 'translateY(20px)',
                              }}
                            >
                              <h2 className="text-2xl md:text-3xl font-medium text-[#f5f5f5] leading-tight mb-6">
                                {concept.title} <span className="text-[#61ffc9]">{concept.highlight}</span>
                              </h2>

                              <div className="w-full h-px bg-[#737373] my-6" />

                              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                                {concept.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Phase indicator */}
                    <div className="mt-8 pt-6 border-t border-[#525252]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-[#737373] uppercase tracking-wider">
                          {activePhase?.title} <span className="text-[#61ffc9]">{activePhase?.highlight}</span>
                        </span>
                        <span className="text-xs text-[#737373]">
                          {Math.round(scrollProgress * 100)}%
                        </span>
                      </div>
                      <div className="h-1 bg-[#525252] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#61ffc9] transition-all duration-300 rounded-full"
                          style={{ width: `${scrollProgress * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Visual content */}
                  <div className="bg-[#424242] rounded-2xl relative overflow-hidden hidden md:block">
                    {/* Stacked visuals with opacity transitions */}
                    {phases.map((phase, phaseIdx) =>
                      phase.concepts.map((concept, conceptIdx) => (
                        <div
                          key={`${phase.id}-${concept.id}`}
                          className="absolute inset-0 transition-all duration-500"
                          style={{
                            opacity: activePhaseIndex === phaseIdx && activeConceptIndex === conceptIdx ? 1 : 0,
                            transform: activePhaseIndex === phaseIdx && activeConceptIndex === conceptIdx
                              ? 'translateY(0)'
                              : 'translateY(100%)',
                          }}
                        >
                          {renderVisual(concept)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase navigation dots */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 hidden md:flex">
          {phases.map((phase, idx) => (
            <div
              key={phase.id}
              className="group relative flex items-center justify-end"
            >
              <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-[#424242] px-2 py-1 rounded whitespace-nowrap">
                {phase.highlight}
              </span>
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activePhaseIndex === idx
                    ? 'bg-[#61ffc9] scale-150'
                    : activePhaseIndex > idx
                      ? 'bg-[#61ffc9]/50'
                      : 'bg-[#525252]'
                }`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Completion section */}
      <div className="bg-[#292929] pb-24">
        <div
          className="max-w-2xl mx-auto px-6 text-center"
          style={{
            opacity: scrollProgress > 0.95 ? 1 : 0,
            transform: `translateY(${scrollProgress > 0.95 ? 0 : 30}px)`,
            transition: 'all 0.5s ease-out',
          }}
        >
          <div className="py-16 border-t border-[#424242]">
            <h3 className="text-3xl font-medium text-white mb-4">
              Ready to <span className="text-[#61ffc9]">build</span>
            </h3>
            <p className="text-[#a3a3a3] mb-8">
              You&apos;ve explored the complete {roadmap.projectTitle} roadmap.
            </p>
            <button
              onClick={onClose}
              className="group inline-flex items-center gap-3 px-6 py-3 border border-[#61ffc9] text-white rounded-lg hover:bg-[#61ffc9] hover:text-[#292929] transition-all duration-300"
            >
              <span className="text-sm uppercase tracking-wider">Start building</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile back button */}
      <button
        onClick={onClose}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white md:hidden"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
