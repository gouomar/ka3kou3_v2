// Project roadmap data with Mermaid diagrams and node explanations

export interface RoadmapResource {
  label: string;
  url: string;
}

export interface RoadmapNode {
  title: string;
  explanation: string;
  resources: RoadmapResource[];
}

export interface ProjectRoadmap {
  projectId: string;
  projectTitle: string;
  overview: string;
  mermaidDiagram: string;
  nodes: Record<string, RoadmapNode>;
}

// Mock roadmap data for all projects
export const projectRoadmaps: Record<string, ProjectRoadmap> = {
  'libft': {
    projectId: 'libft',
    projectTitle: 'Libft',
    overview: 'Build your first C library from scratch. This project introduces you to the fundamentals of C programming by reimplementing standard library functions. You\'ll learn memory management, string manipulation, and linked list operations while creating a library you\'ll use throughout your 42 journey.',
    mermaidDiagram: `flowchart TD
    subgraph Phase1 [PHASE 1: LIBC FUNCTIONS]
        direction TB
        start((START)) --> isalpha[1. ft_isalpha]
        isalpha --> isdigit[2. ft_isdigit]
        isdigit --> isalnum[3. ft_isalnum]
        isalnum --> strlen[4. ft_strlen]
        strlen --> memset[5. ft_memset]
        memset --> memcpy[6. ft_memcpy]
        memcpy --> strlcpy[7. ft_strlcpy]
    end

    subgraph Phase2 [PHASE 2: MEMORY FUNCTIONS]
        direction TB
        calloc[8. ft_calloc] --> strdup[9. ft_strdup]
        strdup --> malloc_use[Memory Allocation]
    end

    subgraph Phase3 [PHASE 3: ADDITIONAL FUNCTIONS]
        direction TB
        substr[10. ft_substr] --> strjoin[11. ft_strjoin]
        strjoin --> split[12. ft_split]
        split --> itoa[13. ft_itoa]
        itoa --> strmapi[14. ft_strmapi]
    end

    subgraph Phase4 [PHASE 4: BONUS - LINKED LISTS]
        direction TB
        lstnew[15. ft_lstnew] --> lstadd_front[16. ft_lstadd_front]
        lstadd_front --> lstsize[17. ft_lstsize]
        lstsize --> lstlast[18. ft_lstlast]
        lstlast --> lstadd_back[19. ft_lstadd_back]
        lstadd_back --> lstclear[20. ft_lstclear]
    end

    strlcpy --> calloc
    malloc_use --> substr
    strmapi --> lstnew
    lstclear --> finish((COMPLETE))`,
    nodes: {
      'isalpha': {
        title: 'ft_isalpha',
        explanation: 'Check if a character is alphabetic (a-z, A-Z). This is your first function - understand ASCII values and how character comparison works in C.',
        resources: [{ label: 'ASCII Table Reference', url: 'https://www.asciitable.com/' }]
      },
      'strlen': {
        title: 'ft_strlen',
        explanation: 'Calculate string length by iterating until null terminator. Foundation for all string operations.',
        resources: [{ label: 'String Basics in C', url: 'https://www.tutorialspoint.com/cprogramming/c_strings.htm' }]
      },
      'memset': {
        title: 'ft_memset',
        explanation: 'Fill memory with a constant byte. Learn pointer arithmetic and memory manipulation.',
        resources: []
      },
      'memcpy': {
        title: 'ft_memcpy',
        explanation: 'Copy memory area. Handle overlapping memory regions correctly.',
        resources: [{ label: 'Memory Functions', url: 'https://www.cplusplus.com/reference/cstring/memcpy/' }]
      },
      'calloc': {
        title: 'ft_calloc',
        explanation: 'Allocate and zero-initialize memory. First encounter with malloc - always check for NULL returns.',
        resources: [{ label: 'Dynamic Memory', url: 'https://www.learn-c.org/en/Dynamic_allocation' }]
      },
      'split': {
        title: 'ft_split',
        explanation: 'Split string by delimiter into array. Complex function requiring careful memory management and edge case handling.',
        resources: []
      },
      'lstnew': {
        title: 'ft_lstnew',
        explanation: 'Create new linked list node. Introduction to data structures and pointer-based collections.',
        resources: [{ label: 'Linked Lists', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/' }]
      }
    }
  },

  'ft_printf': {
    projectId: 'ft_printf',
    projectTitle: 'ft_printf',
    overview: 'Recreate the printf function, one of C\'s most versatile functions. You\'ll master variadic functions, format parsing, and learn how to handle multiple data types with a single function signature. This project teaches you about function design and code architecture.',
    mermaidDiagram: `flowchart TD
    subgraph Init [PHASE 1: SETUP]
        direction TB
        start((START)) --> parse[1. Parse Format String]
        parse --> variadic[2. Variadic Arguments]
        variadic --> dispatch[3. Format Dispatcher]
    end

    subgraph Conversions [PHASE 2: CONVERSIONS]
        direction TB
        dispatch --> conv{Conversion?}
        conv -- %c --> char_conv[4. Character]
        conv -- %s --> str_conv[5. String]
        conv -- %d/%i --> int_conv[6. Integer]
        conv -- %u --> uint_conv[7. Unsigned]
        conv -- %x/%X --> hex_conv[8. Hexadecimal]
        conv -- %p --> ptr_conv[9. Pointer]
        conv -- %% --> percent[10. Percent Sign]
    end

    subgraph Output [PHASE 3: OUTPUT]
        direction TB
        char_conv --> write_out[11. Write Output]
        str_conv --> write_out
        int_conv --> write_out
        uint_conv --> write_out
        hex_conv --> write_out
        ptr_conv --> write_out
        percent --> write_out
        write_out --> count[12. Count Characters]
    end

    count --> finish((RETURN COUNT))`,
    nodes: {
      'variadic': {
        title: 'Variadic Arguments',
        explanation: 'Use va_start, va_arg, va_end macros to handle variable number of arguments. The core mechanism that makes printf flexible.',
        resources: [{ label: 'Variadic Functions', url: 'https://en.cppreference.com/w/c/variadic' }]
      },
      'dispatch': {
        title: 'Format Dispatcher',
        explanation: 'Parse format specifiers and route to appropriate conversion function. Design pattern for handling multiple cases.',
        resources: []
      },
      'hex_conv': {
        title: 'Hexadecimal Conversion',
        explanation: 'Convert integers to base-16 representation. Understand number bases and recursive/iterative digit extraction.',
        resources: [{ label: 'Number Bases', url: 'https://www.mathsisfun.com/hexadecimals.html' }]
      }
    }
  },

  'get_next_line': {
    projectId: 'get_next_line',
    projectTitle: 'get_next_line',
    overview: 'Read a file line by line efficiently. This project introduces static variables, buffer management, and file I/O operations. You\'ll learn to handle edge cases like varying buffer sizes and multiple file descriptors.',
    mermaidDiagram: `flowchart TD
    subgraph Read [PHASE 1: READING]
        direction TB
        start((START)) --> check_static[1. Check Static Buffer]
        check_static --> has_newline{Has Newline?}
        has_newline -- YES --> extract
        has_newline -- NO --> read_fd[2. Read from FD]
        read_fd --> append[3. Append to Buffer]
        append --> has_newline
    end

    subgraph Extract [PHASE 2: EXTRACTION]
        direction TB
        extract[4. Extract Line] --> update[5. Update Static]
        update --> return_line[6. Return Line]
    end

    subgraph Edge [EDGE CASES]
        direction TB
        eof[7. EOF Handling]
        error[8. Error Handling]
        multi_fd[9. Multiple FDs]
    end

    read_fd -- EOF --> eof
    read_fd -- ERROR --> error
    check_static -.-> multi_fd
    return_line --> finish((RETURN))`,
    nodes: {
      'check_static': {
        title: 'Static Buffer',
        explanation: 'Use static variable to persist data between function calls. The buffer stores leftover data from previous reads.',
        resources: [{ label: 'Static Variables', url: 'https://www.geeksforgeeks.org/static-variables-in-c/' }]
      },
      'read_fd': {
        title: 'Read from File Descriptor',
        explanation: 'Use read() system call with BUFFER_SIZE. Handle partial reads and buffer concatenation.',
        resources: [{ label: 'read() syscall', url: 'https://man7.org/linux/man-pages/man2/read.2.html' }]
      },
      'multi_fd': {
        title: 'Multiple File Descriptors',
        explanation: 'Bonus: Handle multiple FDs simultaneously using array of static buffers indexed by FD number.',
        resources: []
      }
    }
  },

  'push_swap': {
    projectId: 'push_swap',
    projectTitle: 'Push_swap',
    overview: 'Sort data on a stack using a limited set of operations. This project is an introduction to sorting algorithms and complexity optimization. You\'ll implement a custom sorting algorithm that minimizes the number of operations.',
    mermaidDiagram: `flowchart TD
    subgraph Parse [PHASE 1: PARSING]
        direction TB
        start((START)) --> args[1. Parse Arguments]
        args --> validate[2. Validate Input]
        validate --> init_stack[3. Initialize Stack A]
    end

    subgraph Analyze [PHASE 2: ANALYSIS]
        direction TB
        init_stack --> check_sorted{Already Sorted?}
        check_sorted -- YES --> done((DONE))
        check_sorted -- NO --> choose_algo{Size?}
    end

    subgraph Small [SMALL SORT ≤5]
        direction TB
        choose_algo -- "≤3" --> sort_3[4. Sort 3 Elements]
        choose_algo -- "≤5" --> sort_5[5. Sort 5 Elements]
    end

    subgraph Large [LARGE SORT >5]
        direction TB
        choose_algo -- ">5" --> index[6. Index Values]
        index --> chunk[7. Chunk Division]
        chunk --> push_b[8. Push to Stack B]
        push_b --> sort_back[9. Sort Back to A]
    end

    subgraph Ops [OPERATIONS]
        direction TB
        sa[sa: swap a]
        pb[pb: push to b]
        ra[ra: rotate a]
        rra[rra: reverse rotate]
    end

    sort_3 --> done
    sort_5 --> done
    sort_back --> done`,
    nodes: {
      'validate': {
        title: 'Input Validation',
        explanation: 'Check for duplicates, non-integers, and integer overflow. Return "Error" to stderr for any invalid input.',
        resources: []
      },
      'sort_3': {
        title: 'Sort 3 Elements',
        explanation: 'Hardcode the optimal moves for 3 elements. Maximum 2 operations needed. Handle all 6 permutations.',
        resources: []
      },
      'index': {
        title: 'Value Indexing',
        explanation: 'Replace values with their sorted index (0 to n-1). Simplifies chunking and comparison operations.',
        resources: [{ label: 'Sorting Algorithms', url: 'https://www.geeksforgeeks.org/sorting-algorithms/' }]
      },
      'chunk': {
        title: 'Chunk Division',
        explanation: 'Divide stack into chunks based on index ranges. Push chunks to B in order to minimize operations.',
        resources: []
      }
    }
  },

  'born2beroot': {
    projectId: 'born2beroot',
    projectTitle: 'Born2beroot',
    overview: 'Set up a secure virtual machine server from scratch. This system administration project teaches you Linux fundamentals, security best practices, and server configuration. You\'ll configure services, manage users, and implement security policies.',
    mermaidDiagram: `flowchart TD
    subgraph Setup [PHASE 1: VM SETUP]
        direction TB
        start((START)) --> download[1. Download Debian/Rocky]
        download --> create_vm[2. Create VM in VirtualBox]
        create_vm --> partition[3. Disk Partitioning]
        partition --> lvm[4. LVM Configuration]
    end

    subgraph Security [PHASE 2: SECURITY]
        direction TB
        lvm --> sudo_cfg[5. Configure Sudo]
        sudo_cfg --> ssh[6. SSH Setup]
        ssh --> ufw[7. UFW Firewall]
        ufw --> password[8. Password Policy]
    end

    subgraph Users [PHASE 3: USER MANAGEMENT]
        direction TB
        password --> create_user[9. Create Users]
        create_user --> groups[10. Group Assignment]
        groups --> hostname[11. Hostname Config]
    end

    subgraph Monitor [PHASE 4: MONITORING]
        direction TB
        hostname --> script[12. monitoring.sh]
        script --> cron[13. Cron Job]
        cron --> wall[14. Wall Broadcast]
    end

    wall --> finish((COMPLETE))`,
    nodes: {
      'partition': {
        title: 'Disk Partitioning',
        explanation: 'Create encrypted partitions with specific sizes. Understand boot, root, swap, home, var, and tmp partitions.',
        resources: [{ label: 'Linux Partitioning', url: 'https://wiki.archlinux.org/title/Partitioning' }]
      },
      'lvm': {
        title: 'LVM Configuration',
        explanation: 'Logical Volume Manager for flexible disk management. Create volume groups and logical volumes within encrypted partition.',
        resources: [{ label: 'LVM Guide', url: 'https://wiki.archlinux.org/title/LVM' }]
      },
      'sudo_cfg': {
        title: 'Sudo Configuration',
        explanation: 'Configure /etc/sudoers with strict rules: limited retries, custom messages, TTY requirement, and secure paths.',
        resources: [{ label: 'Sudoers Manual', url: 'https://www.sudo.ws/man/1.8.17/sudoers.man.html' }]
      },
      'ssh': {
        title: 'SSH Setup',
        explanation: 'Configure SSH on port 4242. Disable root login. Set up key-based authentication for security.',
        resources: []
      },
      'ufw': {
        title: 'UFW Firewall',
        explanation: 'Uncomplicated Firewall setup. Only allow necessary ports (4242 for SSH). Default deny incoming.',
        resources: []
      },
      'script': {
        title: 'Monitoring Script',
        explanation: 'Bash script displaying system info: architecture, CPU, RAM, disk, network, users, sudo commands count.',
        resources: []
      }
    }
  },

  'a-maze-ing': {
    projectId: 'a-maze-ing',
    projectTitle: 'A-Maze-ing',
    overview: 'Navigate through procedurally generated mazes using pathfinding algorithms. This project challenges you to implement maze generation and solving algorithms while optimizing for performance and memory usage.',
    mermaidDiagram: `flowchart TD
    subgraph Parse [PHASE 1: INPUT]
        direction TB
        start((START)) --> read_maze[1. Read Maze File]
        read_maze --> validate[2. Validate Format]
        validate --> build_graph[3. Build Graph]
    end

    subgraph Solve [PHASE 2: PATHFINDING]
        direction TB
        build_graph --> choose{Algorithm?}
        choose -- BFS --> bfs[4. Breadth-First Search]
        choose -- DFS --> dfs[5. Depth-First Search]
        choose -- "A*" --> astar[6. A* Algorithm]
    end

    subgraph Path [PHASE 3: PATH]
        direction TB
        bfs --> reconstruct[7. Reconstruct Path]
        dfs --> reconstruct
        astar --> reconstruct
        reconstruct --> visualize[8. Visualize Solution]
    end

    visualize --> finish((OUTPUT))`,
    nodes: {
      'bfs': {
        title: 'Breadth-First Search',
        explanation: 'Explore all neighbors at current depth before moving deeper. Guarantees shortest path in unweighted graphs.',
        resources: [{ label: 'BFS Algorithm', url: 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/' }]
      },
      'astar': {
        title: 'A* Algorithm',
        explanation: 'Heuristic-based pathfinding. Combines actual cost with estimated cost to goal for optimal efficiency.',
        resources: [{ label: 'A* Pathfinding', url: 'https://www.redblobgames.com/pathfinding/a-star/introduction.html' }]
      }
    }
  },

  'python-modules': {
    projectId: 'python-modules',
    projectTitle: 'Python Modules',
    overview: 'Learn Python through 11 progressive modules covering basics to advanced topics. From syntax fundamentals to data science, web development, and machine learning concepts.',
    mermaidDiagram: `flowchart TD
    subgraph Basics [MODULES 00-02: BASICS]
        direction TB
        start((START)) --> m00[Module 00: Syntax]
        m00 --> m01[Module 01: Data Types]
        m01 --> m02[Module 02: Functions]
    end

    subgraph OOP [MODULES 03-04: OOP]
        direction TB
        m02 --> m03[Module 03: Classes]
        m03 --> m04[Module 04: Inheritance]
    end

    subgraph Data [MODULES 05-07: DATA]
        direction TB
        m04 --> m05[Module 05: NumPy]
        m05 --> m06[Module 06: Pandas]
        m06 --> m07[Module 07: Visualization]
    end

    subgraph Advanced [MODULES 08-10: ADVANCED]
        direction TB
        m07 --> m08[Module 08: Web/APIs]
        m08 --> m09[Module 09: ML Basics]
        m09 --> m10[Module 10: Final Project]
    end

    m10 --> finish((COMPLETE))`,
    nodes: {
      'm00': {
        title: 'Module 00: Python Basics',
        explanation: 'Variables, operators, basic I/O. Understanding Python syntax and the interpreter.',
        resources: [{ label: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/' }]
      },
      'm03': {
        title: 'Module 03: OOP',
        explanation: 'Classes, objects, methods, attributes. Encapsulation and abstraction principles.',
        resources: []
      },
      'm05': {
        title: 'Module 05: NumPy',
        explanation: 'Numerical computing with arrays. Vectorized operations and mathematical functions.',
        resources: [{ label: 'NumPy Docs', url: 'https://numpy.org/doc/' }]
      }
    }
  },

  'exam-rank-02': {
    projectId: 'exam-rank-02',
    projectTitle: 'Exam Rank 02',
    overview: 'First major exam checkpoint testing your C fundamentals. You\'ll solve algorithmic problems under time pressure, demonstrating mastery of string manipulation, memory management, and basic data structures.',
    mermaidDiagram: `flowchart TD
    subgraph Prep [PREPARATION]
        direction TB
        start((START)) --> review[1. Review Libft]
        review --> practice[2. Practice Problems]
        practice --> timing[3. Time Management]
    end

    subgraph Topics [KEY TOPICS]
        direction TB
        timing --> strings[4. String Functions]
        strings --> memory[5. Memory Operations]
        memory --> math[6. Math Problems]
        math --> lists[7. List Operations]
    end

    subgraph Exam [EXAM DAY]
        direction TB
        lists --> read_subject[8. Read Carefully]
        read_subject --> code[9. Write Solution]
        code --> test[10. Test Edge Cases]
        test --> submit[11. Submit]
    end

    submit --> finish((PASS/RETRY))`,
    nodes: {
      'practice': {
        title: 'Practice Problems',
        explanation: 'Work through examshell exercises. Focus on common patterns: ft_strlen, ft_strcpy, ft_atoi variations.',
        resources: [{ label: 'Exam Practice', url: 'https://github.com/pasqualerossi/42-School-Exam-Rank-02' }]
      }
    }
  },

  'codexion': {
    projectId: 'codexion',
    projectTitle: 'Codexion',
    overview: 'Master Real-Time Systems and Concurrency. Codexion is a high-performance simulation of a collaborative workspace where autonomous agents compete for limited resources under strict time constraints. Implement complex scheduling algorithms to arbitrate access and prevent deadlocks.',
    mermaidDiagram: `flowchart TD
    subgraph Kernel [PHASE 1: INITIALIZATION]
        direction TB
        start((START)) --> args[1. Argument Parsing]
        args --> god_struct[2. The God Struct]
        god_struct --> mutex_init[3. Mutex Setup]
        mutex_init --> time_init[4. Time Primitives]
    end

    subgraph Runtime [PHASE 2: RUNTIME ENGINE]
        direction TB
        spawn[5. Spawn Threads]
        monitor([6. Watchdog Monitor])
        monitor -.->|CHECKS| routine

        subgraph Lifecycle [THE CODER LOOP]
            direction TB
            routine[7. Coder Routine] --> action{Action?}
            action -- THINK --> refactor[8. Refactor]
            action -- EAT --> request[9. Request Resources]
            action -- SLEEP --> debug[10. Debug]
            refactor --> request
            debug --> routine
        end
        request <--> arbiter
    end

    subgraph Scheduler [PHASE 3: THE SCHEDULER]
        direction TB
        arbiter[11. Arbitration Logic]
        arbiter --> policy{Policy?}
        policy -- FIFO --> fifo_q[12. FIFO Queue]
        policy -- EDF --> heap[13. Min-Heap Priority]
        fifo_q --> check[14. Availability Check]
        heap --> check
        check --> grant[15. Grant Locks]
        grant --> cooldown[16. Trigger Cooldown]
    end

    subgraph Termination [PHASE 4: SHUTDOWN]
        direction TB
        stop((STOP)) --> join[17. Thread Join]
        join --> cleanup[18. Memory Cleanup]
        cleanup --> helgrind[19. Race Detection]
    end

    time_init --> spawn
    spawn --> monitor
    spawn --> routine
    grant --> debug
    monitor -- FATAL --> stop`,
    nodes: {
      'args': {
        title: 'Argument Parsing',
        explanation: 'Validate mandatory arguments. Ensure inputs are integers, values are positive, scheduler is "fifo" or "edf".',
        resources: [{ label: 'Strtol vs Atoi', url: 'https://stackoverflow.com/questions/7021725/how-to-convert-a-string-to-integer-in-c' }]
      },
      'mutex_init': {
        title: 'Mutex Setup',
        explanation: 'Initialize synchronization primitives. Mutexes for: each resource, the logger, and data access protection.',
        resources: [{ label: 'pthread_mutex_init', url: 'https://pubs.opengroup.org/onlinepubs/009695399/functions/pthread_mutex_init.html' }]
      },
      'spawn': {
        title: 'Spawn Threads',
        explanation: 'Launch N worker threads and 1 monitor thread. Pass specific pointer to each thread with its ID.',
        resources: [{ label: 'pthread_create', url: 'https://hpc-tutorials.llnl.gov/posix/creating_and_terminating_threads/' }]
      },
      'heap': {
        title: 'EDF Strategy',
        explanation: 'Earliest Deadline First using Min-Heap. Priority key = last_action + time_to_deadline.',
        resources: [{ label: 'Binary Heap', url: 'https://www.geeksforgeeks.org/binary-heap/' }]
      },
      'helgrind': {
        title: 'Race Detection',
        explanation: 'Run valgrind --tool=helgrind. Zero data races allowed for passing grade.',
        resources: []
      }
    }
  },

  'fly-in': {
    projectId: 'fly-in',
    projectTitle: 'Fly-in',
    overview: 'Aviation-themed systems challenge. Design and implement flight management systems handling real-time data processing, scheduling algorithms, and resource optimization under strict timing constraints.',
    mermaidDiagram: `flowchart TD
    subgraph Input [PHASE 1: DATA INPUT]
        direction TB
        start((START)) --> parse[1. Parse Flight Data]
        parse --> validate[2. Validate Schedules]
        validate --> build[3. Build Data Structures]
    end

    subgraph Process [PHASE 2: PROCESSING]
        direction TB
        build --> schedule[4. Scheduling Algorithm]
        schedule --> conflicts{Conflicts?}
        conflicts -- YES --> resolve[5. Conflict Resolution]
        conflicts -- NO --> optimize[6. Optimization]
        resolve --> optimize
    end

    subgraph Output [PHASE 3: OUTPUT]
        direction TB
        optimize --> generate[7. Generate Schedule]
        generate --> display[8. Display Results]
    end

    display --> finish((COMPLETE))`,
    nodes: {
      'schedule': {
        title: 'Scheduling Algorithm',
        explanation: 'Implement scheduling for flight arrivals and departures. Consider runway constraints and time windows.',
        resources: []
      }
    }
  },

  'call-me-maybe': {
    projectId: 'call-me-maybe',
    projectTitle: 'Call me maybe',
    overview: 'Communication and networking project focusing on protocol implementation, socket programming, and real-time message passing between distributed systems.',
    mermaidDiagram: `flowchart TD
    subgraph Setup [PHASE 1: NETWORK SETUP]
        direction TB
        start((START)) --> socket[1. Socket Creation]
        socket --> bind[2. Bind Address]
        bind --> listen[3. Listen/Connect]
    end

    subgraph Protocol [PHASE 2: PROTOCOL]
        direction TB
        listen --> handshake[4. Handshake]
        handshake --> serialize[5. Data Serialization]
        serialize --> send[6. Send Messages]
        send --> receive[7. Receive Messages]
    end

    subgraph Handle [PHASE 3: HANDLING]
        direction TB
        receive --> parse[8. Parse Messages]
        parse --> respond[9. Generate Response]
        respond --> error[10. Error Handling]
    end

    error --> finish((CLOSE))`,
    nodes: {
      'socket': {
        title: 'Socket Programming',
        explanation: 'Create TCP/UDP sockets for communication. Understand client-server architecture.',
        resources: [{ label: 'Socket Tutorial', url: 'https://beej.us/guide/bgnet/' }]
      }
    }
  },

  'rag-against-machine': {
    projectId: 'rag-against-machine',
    projectTitle: 'RAG against the machine',
    overview: 'Implement a Retrieval-Augmented Generation system. Combine vector databases, embedding models, and language models to create an AI system that retrieves relevant context before generating responses.',
    mermaidDiagram: `flowchart TD
    subgraph Ingest [PHASE 1: DATA INGESTION]
        direction TB
        start((START)) --> load[1. Load Documents]
        load --> chunk[2. Text Chunking]
        chunk --> embed[3. Generate Embeddings]
        embed --> store[4. Vector Store]
    end

    subgraph Query [PHASE 2: QUERY PROCESSING]
        direction TB
        store --> query_embed[5. Query Embedding]
        query_embed --> search[6. Similarity Search]
        search --> retrieve[7. Retrieve Context]
    end

    subgraph Generate [PHASE 3: GENERATION]
        direction TB
        retrieve --> prompt[8. Build Prompt]
        prompt --> llm[9. LLM Generation]
        llm --> response[10. Format Response]
    end

    response --> finish((OUTPUT))`,
    nodes: {
      'embed': {
        title: 'Embeddings',
        explanation: 'Convert text to vector representations. Use models like sentence-transformers for semantic meaning.',
        resources: [{ label: 'Embeddings Guide', url: 'https://www.pinecone.io/learn/vector-embeddings/' }]
      },
      'search': {
        title: 'Similarity Search',
        explanation: 'Find most relevant chunks using cosine similarity or approximate nearest neighbors (ANN).',
        resources: []
      }
    }
  },

  'pac-man': {
    projectId: 'pac-man',
    projectTitle: 'Pac-Man',
    overview: 'Recreate the classic arcade game with modern programming techniques. Implement game loops, sprite rendering, collision detection, ghost AI behaviors, and scoring systems.',
    mermaidDiagram: `flowchart TD
    subgraph Init [PHASE 1: INITIALIZATION]
        direction TB
        start((START)) --> window[1. Create Window]
        window --> load[2. Load Assets]
        load --> map[3. Parse Map]
        map --> entities[4. Init Entities]
    end

    subgraph Loop [PHASE 2: GAME LOOP]
        direction TB
        entities --> input[5. Handle Input]
        input --> update[6. Update State]
        update --> collision[7. Collision Detection]
        collision --> ai[8. Ghost AI]
        ai --> render[9. Render Frame]
        render --> check{Game Over?}
        check -- NO --> input
    end

    subgraph AI [GHOST BEHAVIORS]
        direction TB
        blinky[Blinky: Chase]
        pinky[Pinky: Ambush]
        inky[Inky: Flank]
        clyde[Clyde: Random]
    end

    check -- YES --> finish((END))`,
    nodes: {
      'ai': {
        title: 'Ghost AI',
        explanation: 'Each ghost has unique behavior: Blinky chases directly, Pinky aims ahead, Inky flanks, Clyde is random.',
        resources: [{ label: 'Pac-Man Ghost AI', url: 'https://gameinternals.com/understanding-pac-man-ghost-behavior' }]
      },
      'collision': {
        title: 'Collision Detection',
        explanation: 'Check player-ghost, player-pellet, player-wall collisions. AABB or grid-based detection.',
        resources: []
      }
    }
  },

  'netpractice': {
    projectId: 'netpractice',
    projectTitle: 'NetPractice',
    overview: 'Master TCP/IP networking through practical exercises. Configure network interfaces, understand subnetting, set up routing tables, and troubleshoot connectivity issues.',
    mermaidDiagram: `flowchart TD
    subgraph Basics [PHASE 1: FUNDAMENTALS]
        direction TB
        start((START)) --> ip[1. IP Addressing]
        ip --> subnet[2. Subnetting]
        subnet --> cidr[3. CIDR Notation]
    end

    subgraph Config [PHASE 2: CONFIGURATION]
        direction TB
        cidr --> interfaces[4. Network Interfaces]
        interfaces --> routes[5. Routing Tables]
        routes --> gateway[6. Default Gateway]
    end

    subgraph Practice [PHASE 3: EXERCISES]
        direction TB
        gateway --> level1[7. Basic Networks]
        level1 --> level5[8. Multi-hop Routes]
        level5 --> level10[9. Complex Topologies]
    end

    level10 --> finish((MASTERY))`,
    nodes: {
      'subnet': {
        title: 'Subnetting',
        explanation: 'Divide networks into smaller segments. Calculate network address, broadcast, and valid host ranges.',
        resources: [{ label: 'Subnetting Guide', url: 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html' }]
      },
      'routes': {
        title: 'Routing Tables',
        explanation: 'Configure static routes. Understand destination, netmask, gateway, and interface relationships.',
        resources: []
      }
    }
  },

  'agent-smith': {
    projectId: 'agent-smith',
    projectTitle: 'Agent Smith',
    overview: 'Develop autonomous AI agents that can perceive, reason, and act. Implement agent architectures, decision-making systems, and multi-agent coordination.',
    mermaidDiagram: `flowchart TD
    subgraph Perceive [PHASE 1: PERCEPTION]
        direction TB
        start((START)) --> sensors[1. Environment Sensing]
        sensors --> process[2. Data Processing]
        process --> state[3. State Representation]
    end

    subgraph Reason [PHASE 2: REASONING]
        direction TB
        state --> goals[4. Goal Analysis]
        goals --> plan[5. Action Planning]
        plan --> evaluate[6. Plan Evaluation]
    end

    subgraph Act [PHASE 3: ACTION]
        direction TB
        evaluate --> select[7. Action Selection]
        select --> execute[8. Execute Action]
        execute --> feedback[9. Feedback Loop]
    end

    feedback --> sensors`,
    nodes: {
      'plan': {
        title: 'Action Planning',
        explanation: 'Use planning algorithms (STRIPS, HTN) to generate action sequences achieving goals.',
        resources: []
      }
    }
  },

  'inception': {
    projectId: 'inception',
    projectTitle: 'Inception',
    overview: 'Build a complete Docker-based infrastructure. Set up multiple services including NGINX, WordPress, MariaDB with proper networking, volumes, and security configurations.',
    mermaidDiagram: `flowchart TD
    subgraph Setup [PHASE 1: DOCKER SETUP]
        direction TB
        start((START)) --> compose[1. Docker Compose]
        compose --> network[2. Docker Network]
        network --> volumes[3. Persistent Volumes]
    end

    subgraph Services [PHASE 2: SERVICES]
        direction TB
        volumes --> nginx[4. NGINX Container]
        nginx --> wordpress[5. WordPress Container]
        wordpress --> mariadb[6. MariaDB Container]
    end

    subgraph Config [PHASE 3: CONFIGURATION]
        direction TB
        mariadb --> ssl[7. SSL/TLS Setup]
        ssl --> env[8. Environment Variables]
        env --> health[9. Health Checks]
    end

    health --> finish((DEPLOY))`,
    nodes: {
      'compose': {
        title: 'Docker Compose',
        explanation: 'Define multi-container applications. Services, networks, and volumes in YAML configuration.',
        resources: [{ label: 'Compose Docs', url: 'https://docs.docker.com/compose/' }]
      },
      'nginx': {
        title: 'NGINX Setup',
        explanation: 'Reverse proxy with TLS termination. Configure server blocks and proxy_pass to WordPress.',
        resources: []
      }
    }
  },

  'answer-protocol': {
    projectId: 'answer-protocol',
    projectTitle: 'The Answer Protocol',
    overview: 'Design and implement a custom network protocol. Define message formats, state machines, error handling, and ensure reliable communication between distributed components.',
    mermaidDiagram: `flowchart TD
    subgraph Design [PHASE 1: PROTOCOL DESIGN]
        direction TB
        start((START)) --> spec[1. Specification]
        spec --> format[2. Message Format]
        format --> states[3. State Machine]
    end

    subgraph Implement [PHASE 2: IMPLEMENTATION]
        direction TB
        states --> encode[4. Encoding/Decoding]
        encode --> transport[5. Transport Layer]
        transport --> handlers[6. Message Handlers]
    end

    subgraph Validate [PHASE 3: VALIDATION]
        direction TB
        handlers --> test[7. Protocol Testing]
        test --> edge[8. Edge Cases]
        edge --> document[9. Documentation]
    end

    document --> finish((COMPLETE))`,
    nodes: {
      'format': {
        title: 'Message Format',
        explanation: 'Define header structure, payload format, and serialization method (binary, JSON, protobuf).',
        resources: []
      },
      'states': {
        title: 'State Machine',
        explanation: 'Model protocol states and transitions. Handle connection, authentication, data transfer, and termination.',
        resources: []
      }
    }
  },

  'ft_transcendence': {
    projectId: 'ft_transcendence',
    projectTitle: 'ft_transcendence',
    overview: 'Build a full-stack web application with real-time multiplayer features. Implement user authentication, game logic, WebSocket communication, and a modern frontend framework.',
    mermaidDiagram: `flowchart TD
    subgraph Backend [PHASE 1: BACKEND]
        direction TB
        start((START)) --> framework[1. Backend Framework]
        framework --> auth[2. OAuth Authentication]
        auth --> database[3. Database Schema]
        database --> api[4. REST API]
    end

    subgraph Realtime [PHASE 2: REAL-TIME]
        direction TB
        api --> websocket[5. WebSocket Server]
        websocket --> game[6. Game Logic]
        game --> matchmaking[7. Matchmaking]
    end

    subgraph Frontend [PHASE 3: FRONTEND]
        direction TB
        matchmaking --> spa[8. SPA Framework]
        spa --> components[9. UI Components]
        components --> canvas[10. Game Rendering]
    end

    subgraph Deploy [PHASE 4: DEPLOYMENT]
        direction TB
        canvas --> docker[11. Dockerize]
        docker --> security[12. Security Audit]
    end

    security --> finish((LAUNCH))`,
    nodes: {
      'auth': {
        title: 'OAuth Authentication',
        explanation: 'Implement 42 OAuth login. Handle tokens, sessions, and user profile management.',
        resources: [{ label: 'OAuth 2.0', url: 'https://oauth.net/2/' }]
      },
      'websocket': {
        title: 'WebSocket Server',
        explanation: 'Real-time bidirectional communication. Handle game state sync, chat, and notifications.',
        resources: [{ label: 'Socket.io', url: 'https://socket.io/docs/' }]
      },
      'game': {
        title: 'Game Logic',
        explanation: 'Server-authoritative Pong game. Handle physics, collision detection, and scoring.',
        resources: []
      }
    }
  }
};

// Get roadmap by project ID
export function getRoadmapByProjectId(projectId: string): ProjectRoadmap | undefined {
  return projectRoadmaps[projectId];
}

// Get all available project IDs with roadmaps
export function getAvailableRoadmapIds(): string[] {
  return Object.keys(projectRoadmaps);
}
