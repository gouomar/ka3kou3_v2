// Mock architecture data for different projects
export const projectArchitectures: {
  [key: string]: {
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
  };
} = {
  '1': {
    project_title: 'Libft',
    promise: 'Master C Programming Fundamentals',
    project_overview:
      'Libft is the foundation of your C programming journey. Build a comprehensive C library from scratch, implementing essential functions for string manipulation, memory management, and list operations. This project teaches you low-level programming, memory safety, and code organization principles.',
    roadmap_mermaid: `flowchart TD
    subgraph Phase1 ["PHASE 1: SETUP"]
        A[Project Structure] --> B[Makefile]
        B --> C[Header Files]
    end

    subgraph Phase2 ["PHASE 2: STRING FUNCTIONS"]
        D[ft_strlen] --> E[ft_strcpy]
        E --> F[ft_strdup]
        F --> G[ft_substr]
    end

    subgraph Phase3 ["PHASE 3: MEMORY & LISTS"]
        H[ft_malloc_wrapper] --> I[ft_calloc]
        I --> J[t_list struct]
        J --> K[ft_lstadd_back]
    end

    subgraph Phase4 ["PHASE 4: TESTING"]
        L[Unit Tests] --> M[Memory Leaks]
        M --> N[Edge Cases]
    end

    C --> D
    G --> H
    K --> L`,
    nodes: {
      A: {
        title: 'Project Structure',
        explanation:
          'Organize your libft project with proper directory layout including src/, includes/, and obj/ folders. Follow 42 school norms.',
        resources: [
          {
            label: 'C Project Organization',
            url: 'https://www.gnu.org/software/make/manual/make.html',
          },
        ],
      },
      B: {
        title: 'Makefile Creation',
        explanation: 'Write a comprehensive Makefile that handles compilation, linking, and cleanup. Include rules for all, clean, and re targets.',
        resources: [],
      },
      D: {
        title: 'String Functions',
        explanation:
          'Implement core string manipulation functions like ft_strlen, ft_strcpy, and ft_strdup. These are fundamental to C programming.',
        resources: [{ label: 'String Functions in C', url: 'https://cplusplus.com/reference/cstring/' }],
      },
      H: {
        title: 'Memory Management',
        explanation:
          'Master dynamic memory allocation with malloc, calloc, and free. Implement wrappers for safe memory management.',
        resources: [],
      },
      J: {
        title: 'Linked Lists',
        explanation: 'Implement a doubly-linked list structure with functions for adding, removing, and iterating through nodes.',
        resources: [{ label: 'Linked Lists Explained', url: 'https://www.geeksforgeeks.org/linked-list-set-1-introduction/' }],
      },
      L: {
        title: 'Testing',
        explanation: 'Write comprehensive unit tests to validate your implementations. Check for memory leaks using valgrind.',
        resources: [],
      },
    },
  },
  '2': {
    project_title: 'ft_printf',
    promise: 'Master Variadic Functions and Parsing',
    project_overview:
      'Recreate the printf function from scratch. This project teaches you variadic arguments, string parsing, and format specifiers. You\'ll learn how C handles variable numbers of arguments and implement a complex parser.',
    roadmap_mermaid: `flowchart TD
    subgraph Phase1 ["PHASE 1: SETUP"]
        A[Function Signature] --> B[Format String Parser]
    end

    subgraph Phase2 ["PHASE 2: SPECIFIERS"]
        C[%c - Character] --> D[%s - String]
        D --> E[%d/%i - Integer]
        E --> F[%x/%X - Hex]
    end

    subgraph Phase3 ["PHASE 3: FLAGS & WIDTH"]
        G[Width Handling] --> H[Flag Processing]
        H --> I[Precision]
    end

    subgraph Phase4 ["PHASE 4: TESTING"]
        J[Compare with Real Printf] --> K[Edge Cases]
    end

    B --> C
    F --> G
    I --> J`,
    nodes: {
      A: {
        title: 'Function Signature',
        explanation: 'Understand variadic function syntax. Learn how va_list, va_start, va_arg, and va_end work in C.',
        resources: [{ label: 'Variadic Functions', url: 'https://en.cppreference.com/w/c/variadic' }],
      },
      B: {
        title: 'Format String Parser',
        explanation: 'Parse format strings to identify specifiers, flags, width, and precision fields.',
        resources: [],
      },
      C: {
        title: 'Character Specifier',
        explanation: 'Implement %c to handle single character output.',
        resources: [],
      },
      G: {
        title: 'Width Handling',
        explanation: 'Support width specifications like %5d to pad output to desired width.',
        resources: [],
      },
      J: {
        title: 'Testing Against Real Printf',
        explanation: 'Compare your implementation with the standard printf to ensure compatibility.',
        resources: [],
      },
    },
  },
  '3': {
    project_title: 'get_next_line',
    promise: 'Master File I/O and Buffer Management',
    project_overview:
      'Read and return successive lines from a file descriptor. This project teaches you file I/O operations, buffer management, and efficient reading strategies. You\'ll learn to handle edge cases and optimize performance.',
    roadmap_mermaid: `flowchart TD
    subgraph Phase1 ["PHASE 1: BASICS"]
        A[File Descriptor Handling] --> B[Read Function]
        B --> C[Buffer Allocation]
    end

    subgraph Phase2 ["PHASE 2: LINE DETECTION"]
        D[Newline Detection] --> E[Line Extraction]
        E --> F[Remaining Buffer]
    end

    subgraph Phase3 ["PHASE 3: EDGE CASES"]
        G[EOF Handling] --> H[Empty Lines]
        H --> I[Multiple FDs]
    end

    subgraph Phase4 ["PHASE 4: OPTIMIZATION"]
        J[Memory Efficiency] --> K[Performance Testing]
    end

    C --> D
    F --> G
    I --> J`,
    nodes: {
      A: {
        title: 'File Descriptor Handling',
        explanation: 'Understand how file descriptors work and how to read from them using the read() system call.',
        resources: [{ label: 'File Descriptors in Unix', url: 'https://www.man7.org/linux/man-pages/man2/read.2.html' }],
      },
      D: {
        title: 'Newline Detection',
        explanation: 'Detect newline characters in your buffer to identify line boundaries.',
        resources: [],
      },
      F: {
        title: 'Remaining Buffer Management',
        explanation:
          'Properly manage the buffer to carry over data that extends beyond the current line for the next call.',
        resources: [],
      },
      I: {
        title: 'Multiple File Descriptors',
        explanation: 'Handle reading from multiple file descriptors simultaneously without losing track of buffers.',
        resources: [],
      },
    },
  },
  '4': {
    project_title: 'Philosophers',
    promise: 'Master Real-Time Systems and Concurrency',
    project_overview:
      'Solve the dining philosophers problem using threads and mutexes. This classic concurrency problem teaches you thread synchronization, deadlock prevention, and resource management under strict timing constraints.',
    roadmap_mermaid: `flowchart TD
    subgraph Kernel [PHASE 1: INITIALIZATION]
        boot((START)) --> args[Argument Parsing]
        args --> god_struct[God Struct]
        god_struct --> mutex_init[Mutex Setup]
        mutex_init --> time_init[Time Primitives]
    end

    subgraph Runtime [PHASE 2: RUNTIME ENGINE]
        spawn[Spawn Philosophers]
        monitor([Watchdog Monitor])
        monitor -.->|CHECKS| routine

        subgraph Lifecycle [PHILOSOPHER LOOP]
            routine[Main Routine] --> action{Action?}
            action -- THINK --> refactor[Think/Sleep]
            action -- EAT --> request[Request Forks]
            action -- SLEEP --> debug[Debug/Sleep]
            refactor --> request
            debug --> routine
        end
        request <--> arbiter
    end

    subgraph Scheduler [PHASE 3: SYNCHRONIZATION]
        arbiter[Fork Arbitration]
        arbiter --> policy{Policy?}

        subgraph Algorithms [STRATEGIES]
            policy -- FIFO --> fifo_q[Queue]
            policy -- PRIORITY --> heap[Priority]
        end

        fifo_q --> check_cd[Availability]
        heap --> check_cd
        check_cd -- WAIT --> wait_state[Condition Var]
        check_cd -- READY --> grant[Grant Forks]
        grant --> cooldown[Update State]
    end

    subgraph Termination [PHASE 4: SHUTDOWN]
        stop((STOP)) --> join[Thread Join]
        join --> free[Memory Cleanup]
    end

    time_init --> spawn
    spawn --> monitor
    spawn --> routine
    grant --> debug
    monitor -- DEATH --> stop`,
    nodes: {
      args: {
        title: 'Argument Parsing',
        explanation:
          'Parse command-line arguments: number of philosophers, time to die, time to eat, and time to sleep. Validate inputs properly.',
        resources: [{ label: 'Command Line Arguments', url: 'https://www.tutorialspoint.com/c_standard_library/c_function_strtol.htm' }],
      },
      god_struct: {
        title: 'Global State Structure',
        explanation:
          'Create a structure holding simulation state, philosopher data, forks (mutexes), and timing information. Avoid global variables.',
        resources: [],
      },
      mutex_init: {
        title: 'Mutex Setup',
        explanation:
          'Initialize mutexes for each fork and a print mutex. Proper initialization prevents race conditions.',
        resources: [{ label: 'POSIX Mutexes', url: 'https://pubs.opengroup.org/onlinepubs/009695399/functions/pthread_mutex_init.html' }],
      },
      spawn: {
        title: 'Spawn Philosophers',
        explanation: 'Create N philosopher threads, each with a unique ID. Pass proper thread arguments.',
        resources: [{ label: 'POSIX Threads', url: 'https://hpc-tutorials.llnl.gov/posix/creating_and_terminating_threads/' }],
      },
      routine: {
        title: 'Philosopher Routine',
        explanation:
          'Implement the state machine: think → eat → sleep, repeating until death or simulation end.',
        resources: [],
      },
      request: {
        title: 'Fork Request',
        explanation: 'Philosopher requests two forks. Use proper locking to prevent deadlock (e.g., always grab forks in order).',
        resources: [],
      },
      check_cd: {
        title: 'Availability Check',
        explanation: 'Check if both forks are available before allowing philosopher to eat. Use condition variables for efficient waiting.',
        resources: [],
      },
      grant: {
        title: 'Grant Forks',
        explanation:
          'Lock both forks, update last meal time, and let philosopher eat. Critical for tracking time to death.',
        resources: [],
      },
      monitor: {
        title: 'Death Monitor',
        explanation:
          'Watch for philosophers exceeding time_to_die. If any die, stop the simulation and exit cleanly.',
        resources: [],
      },
    },
  },
  '5': {
    project_title: 'minishell',
    promise: 'Master Process Management and Parsing',
    project_overview:
      'Create a simple Unix shell that can execute commands, handle pipes, and manage processes. This project teaches you process creation, signal handling, file descriptor manipulation, and command parsing.',
    roadmap_mermaid: `flowchart TD
    subgraph Parser [PHASE 1: PARSING]
        A[Tokenization] --> B[Syntax Analysis]
        B --> C[AST Building]
    end

    subgraph Execution [PHASE 2: EXECUTION]
        D[Command Lookup] --> E[Process Creation]
        E --> F[I/O Redirection]
    end

    subgraph Pipes [PHASE 3: PIPING]
        G[Pipe Creation] --> H[Process Chain]
        H --> I[Data Flow]
    end

    subgraph Signals [PHASE 4: SIGNALS]
        J[Signal Handlers] --> K[Process Control]
        K --> L[Terminal Control]
    end

    C --> D
    F --> G
    I --> J`,
    nodes: {
      A: {
        title: 'Tokenization',
        explanation: 'Break input string into tokens: commands, arguments, pipes, redirections. Handle quotes and escapes.',
        resources: [],
      },
      D: {
        title: 'Command Lookup',
        explanation: 'Find command in PATH or execute builtin. Handle absolute paths and relative paths.',
        resources: [],
      },
      E: {
        title: 'Process Creation',
        explanation: 'Use fork() and execve() to create and execute child processes.',
        resources: [{ label: 'Process Management', url: 'https://www.man7.org/linux/man-pages/man2/execve.2.html' }],
      },
      G: {
        title: 'Pipe Creation',
        explanation: 'Create pipes between processes. Connect stdout of one process to stdin of another.',
        resources: [{ label: 'Pipes in Unix', url: 'https://www.man7.org/linux/man-pages/man2/pipe.2.html' }],
      },
      J: {
        title: 'Signal Handlers',
        explanation: 'Handle SIGINT and SIGTERM properly to manage process termination and cleanup.',
        resources: [],
      },
    },
  },
  '6': {
    project_title: 'CPP Modules',
    promise: 'Master Object-Oriented Programming',
    project_overview:
      'Learn C++ fundamentals through a series of progressive modules. From basic classes and inheritance to advanced templates and design patterns. Master OOP principles and modern C++ practices.',
    roadmap_mermaid: `flowchart TD
    subgraph CPP00 ["MODULE 00: Basics"]
        A[Classes] --> B[Constructors]
        B --> C[Destructors]
    end

    subgraph CPP01 ["MODULE 01: Memory"]
        D[Pointers] --> E[References]
        E --> F[Memory Allocation]
    end

    subgraph CPP02 ["MODULE 02: Polymorphism"]
        G[Inheritance] --> H[Virtual Functions]
        H --> I[Abstract Classes]
    end

    subgraph CPP03 ["MODULE 03: Advanced"]
        J[Templates] --> K[STL Containers]
        K --> L[Algorithms]
    end

    C --> D
    F --> G
    I --> J`,
    nodes: {
      A: {
        title: 'Classes and Objects',
        explanation: 'Understand C++ class definition, member variables, and member functions. Learn about access modifiers.',
        resources: [{ label: 'C++ Classes', url: 'https://en.cppreference.com/w/cpp/language/class' }],
      },
      B: {
        title: 'Constructors',
        explanation: 'Implement constructors for object initialization. Learn initialization lists and default constructors.',
        resources: [],
      },
      D: {
        title: 'Pointers and References',
        explanation:
          'Master pointer arithmetic and references. Understand pointer-to-member and pointer-to-function syntax.',
        resources: [],
      },
      G: {
        title: 'Inheritance',
        explanation: 'Implement single and multiple inheritance. Understand virtual base classes and access control in inheritance.',
        resources: [],
      },
      J: {
        title: 'Templates',
        explanation: 'Create generic classes and functions using templates. Understand template specialization.',
        resources: [],
      },
    },
  },
};
