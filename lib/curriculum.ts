// 42 Common Core Curriculum - Project definitions organized by circles
export interface CurriculumProject {
  id: string;
  name: string;
  slug: string; // Primary API slug to match with user's projects
  altSlugs?: string[]; // Alternative slugs that might match
  description: string;
  difficulty: number; // 1-5
  skills: string[];
  circle: number;
  isExam?: boolean;
  moduleCount?: number; // For projects with multiple modules
}

export interface Circle {
  number: number;
  name: string;
  projects: CurriculumProject[];
}

export const curriculum: Circle[] = [
  {
    number: 1,
    name: 'Circle 1 - Foundations',
    projects: [
      {
        id: 'libft',
        name: 'Libft',
        slug: '42cursus-libft',
        altSlugs: ['libft'],
        description: 'Build your own C library with essential functions',
        difficulty: 2,
        skills: ['C', 'Memory Management', 'Data Structures'],
        circle: 1,
      },
    ],
  },
  {
    number: 2,
    name: 'Circle 2 - Core C',
    projects: [
      {
        id: 'ft_printf',
        name: 'ft_printf',
        slug: '42cursus-ft_printf',
        altSlugs: ['ft_printf'],
        description: 'Recreate the printf function with variadic arguments',
        difficulty: 3,
        skills: ['C', 'Variadic Functions', 'Parsing'],
        circle: 2,
      },
      {
        id: 'get_next_line',
        name: 'get_next_line',
        slug: '42cursus-get_next_line',
        altSlugs: ['get_next_line'],
        description: 'Read content line by line from a file descriptor',
        difficulty: 3,
        skills: ['C', 'File I/O', 'Static Variables'],
        circle: 2,
      },
      {
        id: 'push_swap',
        name: 'Push_swap',
        slug: '42cursus-push_swap',
        altSlugs: ['push_swap'],
        description: 'Sort data on a stack with limited operations',
        difficulty: 4,
        skills: ['C', 'Algorithms', 'Sorting', 'Optimization'],
        circle: 2,
      },
    ],
  },
  {
    number: 3,
    name: 'Circle 3 - Exploration',
    projects: [
      {
        id: 'a-maze-ing',
        name: 'A-Maze-ing',
        slug: 'a-maze-ing',
        description: 'Navigate through maze challenges',
        difficulty: 3,
        skills: ['Algorithms', 'Problem Solving', 'Pathfinding'],
        circle: 3,
      },
      {
        id: 'python-modules',
        name: 'Python Modules (00-10)',
        slug: 'python-module-00',
        altSlugs: ['python-module-01', 'python-module-02', 'python-module-03', 'python-module-04', 'python-module-05', 'python-module-06', 'python-module-07', 'python-module-08', 'python-module-09', 'python-module-10'],
        description: 'Learn Python through 11 progressive modules',
        difficulty: 3,
        skills: ['Python', 'OOP', 'Data Science', 'Web'],
        circle: 3,
        moduleCount: 11,
      },
      {
        id: 'exam-rank-02',
        name: 'Exam Rank 02',
        slug: 'exam-rank-02',
        altSlugs: ['42next-exam-rank-02'],
        description: 'First major exam checkpoint',
        difficulty: 3,
        skills: ['C', 'Problem Solving', 'Time Management'],
        circle: 3,
        isExam: true,
      },
      {
        id: 'born2beroot',
        name: 'Born2beroot',
        slug: 'born2beroot',
        description: 'Set up a secure virtual machine server',
        difficulty: 3,
        skills: ['Linux', 'System Administration', 'Security', 'Virtualization'],
        circle: 3,
      },
    ],
  },
  {
    number: 4,
    name: 'Circle 4 - Systems',
    projects: [
      {
        id: 'fly-in',
        name: 'Fly-in',
        slug: 'fly-in',
        description: 'Aviation-themed challenge project',
        difficulty: 4,
        skills: ['Systems', 'Problem Solving'],
        circle: 4,
      },
      {
        id: 'codexion',
        name: 'Codexion',
        slug: 'codexion',
        description: 'Code manipulation and transformation challenge',
        difficulty: 4,
        skills: ['Parsing', 'Code Analysis', 'Algorithms'],
        circle: 4,
      },
      {
        id: 'call-me-maybe',
        name: 'Call me maybe',
        slug: 'call-me-maybe',
        description: 'Communication and networking project',
        difficulty: 4,
        skills: ['Networking', 'Protocols', 'Communication'],
        circle: 4,
      },
    ],
  },
  {
    number: 5,
    name: 'Circle 5 - Advanced',
    projects: [
      {
        id: 'rag-against-machine',
        name: 'RAG against the machine',
        slug: 'rag-against-the-machine',
        description: 'Retrieval-Augmented Generation AI project',
        difficulty: 4,
        skills: ['AI', 'Machine Learning', 'NLP', 'RAG'],
        circle: 5,
      },
      {
        id: 'pac-man',
        name: 'Pac-Man',
        slug: 'pac-man',
        description: 'Classic arcade game recreation',
        difficulty: 4,
        skills: ['Game Development', 'Graphics', 'AI', 'Algorithms'],
        circle: 5,
      },
      {
        id: 'netpractice',
        name: 'NetPractice',
        slug: 'netpractice',
        description: 'Master TCP/IP networking and subnetting',
        difficulty: 3,
        skills: ['Networking', 'TCP/IP', 'Subnetting', 'Routing'],
        circle: 5,
      },
    ],
  },
  {
    number: 6,
    name: 'Circle 6 - Expert',
    projects: [
      {
        id: 'agent-smith',
        name: 'Agent Smith',
        slug: 'agent-smith',
        description: 'AI agent development project',
        difficulty: 5,
        skills: ['AI', 'Agents', 'Automation', 'Machine Learning'],
        circle: 6,
      },
      {
        id: 'inception',
        name: 'Inception',
        slug: 'inception',
        description: 'Docker-based infrastructure with multiple services',
        difficulty: 5,
        skills: ['Docker', 'DevOps', 'System Administration', 'Networking'],
        circle: 6,
      },
      {
        id: 'answer-protocol',
        name: 'The Answer Protocol',
        slug: 'the-answer-protocol',
        description: 'Protocol design and implementation',
        difficulty: 5,
        skills: ['Protocols', 'Networking', 'Systems Design'],
        circle: 6,
      },
    ],
  },
  {
    number: 7,
    name: 'Circle 7 - Final',
    projects: [
      {
        id: 'ft_transcendence',
        name: 'ft_transcendence',
        slug: 'ft_transcendence',
        altSlugs: ['42cursus-ft_transcendence'],
        description: 'Full-stack web application with real-time features',
        difficulty: 5,
        skills: ['Full Stack', 'WebSockets', 'Database', 'Security', 'DevOps'],
        circle: 7,
      },
    ],
  },
];

// Flatten all projects for easy lookup
export const allProjects = curriculum.flatMap(circle => circle.projects);

// Get project by slug (for matching with API data)
export function getProjectBySlug(slug: string): CurriculumProject | undefined {
  return allProjects.find(p =>
    p.slug === slug ||
    p.altSlugs?.includes(slug) ||
    // Handle python modules
    (p.id === 'python-modules' && slug.startsWith('python-module-'))
  );
}

// Get circle by number
export function getCircle(number: number): Circle | undefined {
  return curriculum.find(c => c.number === number);
}
