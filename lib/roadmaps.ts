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
  "libft": {
    "projectId": "libft",
    "projectTitle": "Libft: The Essential C Library",
    "overview": "Libft is the foundational project of the 42 curriculum. You will rebuild standard C library functions to master memory management, pointers, and algorithms. This library will serve as your personal toolkit for all future projects.",
    "mermaidDiagram": "flowchart TD\n    Start((START)) --> Gen[General Requirements]\n\n    %% --- INFRASTRUCTURE (TOP WIDE) ---\n    subgraph Infra [0. INFRASTRUCTURE]\n        direction LR\n        Gen --> norm[The Norm]\n        norm --> makefile[Makefile]\n        makefile --> header[libft.h]\n        header --> static[Static Functions]\n        static --> ar[ar Command]\n    end\n\n    Infra --> Branch1\n    Infra --> Branch2\n    Infra --> Branch3\n\n    %% --- PART 1: LIBC (SPLIT INTO COLUMNS) ---\n    subgraph Part1 [PART 1: LIBC RE-IMPLEMENTATION]\n        direction TB\n        \n        %% Column 1: Simple Logic\n        subgraph Col1 [Char & Memory]\n            direction TB\n            isalpha[ft_isalpha] --> isdigit[ft_isdigit]\n            isdigit --> isalnum[ft_isalnum]\n            isalnum --> isascii[ft_isascii] --> isprint[ft_isprint]\n            memset[ft_memset] --> bzero[ft_bzero]\n            bzero --> memcpy[ft_memcpy] --> memmove[ft_memmove]\n        end\n\n        %% Column 2: Search & Compare\n        subgraph Col2 [Search & String Logic]\n            direction TB\n            strlen[ft_strlen] --> strchr[ft_strchr]\n            strchr --> strrchr[ft_strrchr]\n            strrchr --> strncmp[ft_strncmp]\n            memchr[ft_memchr] --> memcmp[ft_memcmp]\n            strlcpy[ft_strlcpy] --> strlcat[ft_strlcat]\n            strnstr[ft_strnstr] --> atoi[ft_atoi]\n        end\n        \n        %% Cross-column links\n        memmove -.-> Col2\n        isprint -.-> Col2\n    end\n\n    %% --- PART 2: ADDITIONAL (SPLIT INTO COLUMNS) ---\n    subgraph Part2 [PART 2: ADDITIONAL UTILITIES]\n        direction TB\n        \n        %% Column 3: Allocation & Mods\n        subgraph Col3 [Dynamic Memory & Strings]\n            direction TB\n            calloc[ft_calloc] --> strdup[ft_strdup]\n            substr[ft_substr] --> strjoin[ft_strjoin]\n            strjoin --> strtrim[ft_strtrim]\n            strtrim --> split[ft_split]\n        end\n\n        %% Column 4: Functional & IO\n        subgraph Col4 [Conversion & I/O]\n            direction TB\n            itoa[ft_itoa] --> strmapi[ft_strmapi]\n            strmapi --> striteri[ft_striteri]\n            putchar_fd[ft_putchar_fd] --> putstr_fd[ft_putstr_fd]\n            putstr_fd --> putendl_fd[ft_putendl_fd] --> putnbr_fd[ft_putnbr_fd]\n        end\n    end\n\n    %% --- PART 3: BONUS (WIDE BOTTOM) ---\n    subgraph Bonus [PART 3: LINKED LISTS]\n        direction LR\n        lstnew[ft_lstnew] --> lstadd_front[ft_lstadd_front]\n        lstadd_front --> lstsize[ft_lstsize]\n        lstsize --> lstlast[ft_lstlast]\n        lstlast --> lstadd_back[ft_lstadd_back]\n        lstadd_back --> lstdelone[ft_lstdelone]\n        lstdelone --> lstclear[ft_lstclear]\n        lstclear --> lstiter[ft_lstiter]\n        lstiter --> lstmap[ft_lstmap]\n    end\n\n    %% --- CONNECTIONS & FLOW ---\n    Branch1 --- Col1\n    Branch2 --- Col2\n    Branch3 --- Col3\n    Col3 --- Col4\n\n    %% Dependencies\n    strlen -.-> strlcpy\n    calloc -.-> lstnew\n    split -.-> lstmap\n    putnbr_fd --> Finish((COMPLETE))\n    lstmap --> Finish",
    "nodes": {
      "Gen": {
        "title": "General Resources & Requirements",
        "explanation": "Before coding, you must understand the project scope. Libft is about creating a 'Static Library' (.a). You are forbidden from using global variables and must manage all heap memory via malloc. Every function must be robust enough to handle unexpected inputs without crashing (except for undefined behavior specified in man pages).",
        "resources": [
          { "label": "C Standard Library Reference", "url": "https://en.cppreference.com/w/c/header" },
          { "label": "Unix System Calls & Library Functions", "url": "https://man7.org/linux/man-pages/dir_section_3.html" }
        ]
      },
      "norm": {
        "title": "The Norm",
        "explanation": "The Norm is the mandatory coding style at 42. Key rules: max 25 lines per function, max 5 functions per file, no 'for' loops (only 'while'), and very specific variable declaration formats. A single Norm error results in a project failure during automated grading.",
        "resources": [{ "label": "Norminette GitHub", "url": "https://github.com/42School/norminette" }]
      },
      "makefile": {
        "title": "Makefile & Relinking",
        "explanation": "A Makefile automates compilation. Your Makefile must compile with -Wall -Wextra -Werror. 'Relinking' occurs when the Makefile re-compiles files that haven't changed; this is strictly forbidden in 42 projects. You must implement $(NAME), all, clean, fclean, and re rules.",
        "resources": [{ "label": "Makefile Tutorial", "url": "https://makefiletutorial.com/" }, { "label": "GNU Make Manual", "url": "https://www.gnu.org/software/make/manual/make.html" }]
      },
      "header": {
        "title": "libft.h",
        "explanation": "The header file defines the interface of your library. It must include the t_list struct definition for the bonus and all function prototypes. Header guards (#ifndef LIBFT_H...) are essential to prevent circular dependencies during compilation.",
        "resources": [{ "label": "C Header Files", "url": "https://www.tutorialspoint.com/cprogramming/c_header_files.htm" }]
      },
      "static": {
        "title": "Static Functions",
        "explanation": "Functions declared as 'static' are only visible within the file they are defined in. This is used for 'helper functions' to prevent naming collisions and to encapsulate logic that shouldn't be accessed by the user of the library.",
        "resources": [{ "label": "Static Keywords in C", "url": "https://www.geeksforgeeks.org/static-variables-in-c/" }]
      },
      "ar": {
        "title": "ar & ranlib",
        "explanation": "The 'ar' (archiver) command creates the libft.a static library. It bundles the object files (.o) together. 'ranlib' generates an index to the archive, which makes linking faster and helps the compiler find symbols.",
        "resources": [{ "label": "Static Libraries in C", "url": "https://medium.com/@m_p_p/how-to-create-static-libraries-in-c-6e695d8f789e" }]
      },
      "isalpha": {
        "title": "ft_isalpha",
        "explanation": "Checks if a character is a letter (A-Z or a-z). This is the basis for character parsing.",
        "resources": [{ "label": "Man isalpha", "url": "https://linux.die.net/man/3/isalpha" }]
      },
      "isdigit": {
        "title": "ft_isdigit",
        "explanation": "Checks for a numeric digit (0-9). This is used in atoi and itoa for base-10 conversion.",
        "resources": [{ "label": "Man isdigit", "url": "https://linux.die.net/man/3/isdigit" }]
      },
      "isalnum": {
        "title": "ft_isalnum",
        "explanation": "Combines isalpha and isdigit to check for any alphanumeric character.",
        "resources": [{ "label": "Man isalnum", "url": "https://linux.die.net/man/3/isalnum" }]
      },
      "isascii": {
        "title": "ft_isascii",
        "explanation": "Checks if a character is part of the 7-bit ASCII set (values 0 to 127).",
        "resources": [{ "label": "ASCII Table Reference", "url": "https://www.asciitable.com/" }]
      },
      "isprint": {
        "title": "ft_isprint",
        "explanation": "Checks if a character is printable (includes space, excludes control characters like \\n).",
        "resources": [{ "label": "C isprint()", "url": "https://en.cppreference.com/w/c/string/byte/isprint" }]
      },
      "toupper": {
        "title": "ft_toupper",
        "explanation": "Converts a lowercase character to uppercase. If the character is not lowercase, it returns it unchanged.",
        "resources": [{ "label": "Man toupper", "url": "https://linux.die.net/man/3/toupper" }]
      },
      "tolower": {
        "title": "ft_tolower",
        "explanation": "Converts an uppercase character to lowercase.",
        "resources": [{ "label": "Man tolower", "url": "https://linux.die.net/man/3/tolower" }]
      },
      "memset": {
        "title": "ft_memset",
        "explanation": "Fills a block of memory with a specific constant byte. This is your introduction to pointer manipulation and the 'void *' type.",
        "resources": [{ "label": "memset Manual", "url": "https://linux.die.net/man/3/memset" }]
      },
      "bzero": {
        "title": "ft_bzero",
        "explanation": "A legacy function that fills memory with zeros. Implementation usually calls ft_memset(s, 0, n).",
        "resources": [{ "label": "bzero(3)", "url": "https://linux.die.net/man/3/bzero" }]
      },
      "memcpy": {
        "title": "ft_memcpy",
        "explanation": "Copies 'n' bytes from one memory area to another. Warning: It does not handle overlapping memory. Use memmove for that.",
        "resources": [{ "label": "Man memcpy", "url": "https://linux.die.net/man/3/memcpy" }]
      },
      "memmove": {
        "title": "ft_memmove",
        "explanation": "Copies memory while safely handling overlaps. If the destination is after the source in memory, you must copy from the end to the beginning to avoid data corruption.",
        "resources": [{ "label": "Overlap Logic Explanation", "url": "https://stackoverflow.com/questions/4415910/memcpy-vs-memmove" }]
      },
      "strlen": {
        "title": "ft_strlen",
        "explanation": "Computes the length of a string. Crucial: strings in C are null-terminated (\\0). You must iterate until this terminator is found.",
        "resources": [{ "label": "Man strlen", "url": "https://linux.die.net/man/3/strlen" }]
      },
      "strchr": {
        "title": "ft_strchr",
        "explanation": "Locates the first occurrence of a character in a string. It returns a pointer to that location.",
        "resources": [{ "label": "Man strchr", "url": "https://linux.die.net/man/3/strchr" }]
      },
      "strrchr": {
        "title": "ft_strrchr",
        "explanation": "Locates the LAST occurrence of a character in a string. Useful for finding file extensions.",
        "resources": [{ "label": "C strrchr", "url": "https://www.tutorialspoint.com/c_standard_library/c_function_strrchr.htm" }]
      },
      "strncmp": {
        "title": "ft_strncmp",
        "explanation": "Compares two strings up to 'n' characters. It returns the ASCII difference of the first differing characters.",
        "resources": [{ "label": "Man strncmp", "url": "https://linux.die.net/man/3/strncmp" }]
      },
      "memchr": {
        "title": "ft_memchr",
        "explanation": "Searches memory for a byte. Similar to strchr but it does not stop at null bytes.",
        "resources": [{ "label": "Man memchr", "url": "https://linux.die.net/man/3/memchr" }]
      },
      "memcmp": {
        "title": "ft_memcmp",
        "explanation": "Compares two memory blocks byte by byte. Essential for comparing non-string data.",
        "resources": [{ "label": "Man memcmp", "url": "https://linux.die.net/man/3/memcmp" }]
      },
      "strnstr": {
        "title": "ft_strnstr",
        "explanation": "Locates a substring in a string within a search limit. This is a BSD function, often not found in standard Linux libc.",
        "resources": [{ "label": "FreeBSD strnstr Manual", "url": "https://www.freebsd.org/cgi/man.cgi?query=strnstr" }]
      },
      "strlcpy": {
        "title": "ft_strlcpy",
        "explanation": "Copies a string to a buffer, ensuring it is always null-terminated. This is much safer than the standard 'strncpy'.",
        "resources": [{ "label": "Safe String Copying", "url": "https://linux.die.net/man/3/strlcpy" }]
      },
      "strlcat": {
        "title": "ft_strlcat",
        "explanation": "Appends a string to another with a size limit, ensuring null-termination. It returns the total length of the string it tried to create.",
        "resources": [{ "label": "strlcat logic", "url": "https://linux.die.net/man/3/strlcat" }]
      },
      "atoi": {
        "title": "ft_atoi",
        "explanation": "Converts a string (like ' -123') into an integer (-123). You must skip whitespace and handle the sign correctly.",
        "resources": [{ "label": "Man atoi", "url": "https://linux.die.net/man/3/atoi" }, { "label": "How atoi works", "url": "https://www.geeksforgeeks.org/write-your-own-atoi/" }]
      },
      "calloc": {
        "title": "ft_calloc",
        "explanation": "Allocates memory and clears it to zero. This is a combination of malloc and bzero. Essential for preventing 'garbage' data in your structures.",
        "resources": [{ "label": "Dynamic Memory Allocation", "url": "https://www.geeksforgeeks.org/calloc-versus-malloc/" }]
      },
      "strdup": {
        "title": "ft_strdup",
        "explanation": "Duplicates a string by allocating exact memory with malloc. You are responsible for freeing this memory later.",
        "resources": [{ "label": "Man strdup", "url": "https://linux.die.net/man/3/strdup" }]
      },
      "substr": {
        "title": "ft_substr",
        "explanation": "Extracts a portion of a string into a new allocation. This requires careful boundary checking for the 'start' and 'len' parameters.",
        "resources": [{ "label": "Substring logic in C", "url": "https://stackoverflow.com/questions/26620388/c-substring-function" }]
      },
      "strjoin": {
        "title": "ft_strjoin",
        "explanation": "Combines two strings into one new allocated string. You must calculate the lengths of both to malloc the correct size.",
        "resources": [{ "label": "Dynamic Concatenation", "url": "https://en.wikipedia.org/wiki/Concatenation" }]
      },
      "strtrim": {
        "title": "ft_strtrim",
        "explanation": "Removes specific characters (like whitespace) from both the start and end of a string. Does not modify the original string.",
        "resources": [{ "label": "String Trimming Concept", "url": "https://en.wikipedia.org/wiki/Trimming_(computer_programming)" }]
      },
      "split": {
        "title": "ft_split",
        "explanation": "Splits a string into an array of strings based on a delimiter. This is the hardest mandatory function. If one allocation fails halfway through, you must free all previous strings to prevent memory leaks.",
        "resources": [{ "label": "Protecting Malloc in Loops", "url": "https://pvs-studio.com/en/blog/posts/cpp/0754/" }]
      },
      "itoa": {
        "title": "ft_itoa",
        "explanation": "Converts an integer to a string (e.g., -42 to '-42'). You must calculate the number of digits first and handle INT_MIN (-2147483648) as a special case.",
        "resources": [{ "label": "Integer to ASCII Logic", "url": "https://en.wikipedia.org/wiki/Itoa" }]
      },
      "strmapi": {
        "title": "ft_strmapi",
        "explanation": "Applies a function to each character of a string to create a NEW string. This uses 'Function Pointers'.",
        "resources": [{ "label": "C Function Pointers", "url": "https://www.geeksforgeeks.org/function-pointer-in-c/" }]
      },
      "striteri": {
        "title": "ft_striteri",
        "explanation": "Similar to strmapi, but it modifies the string in-place (no new allocation).",
        "resources": [{ "label": "In-place Modification", "url": "https://www.tutorialspoint.com/cprogramming/c_pointers.htm" }]
      },
      "putchar_fd": {
        "title": "ft_putchar_fd",
        "explanation": "Outputs a character to a specific File Descriptor (FD). 1 is standard output, 2 is error output.",
        "resources": [{ "label": "Unix File Descriptors", "url": "https://en.wikipedia.org/wiki/File_descriptor" }]
      },
      "putstr_fd": {
        "title": "ft_putstr_fd",
        "explanation": "Outputs a string to a file descriptor using the write() system call.",
        "resources": [{ "label": "Write System Call", "url": "https://man7.org/linux/man-pages/man2/write.2.html" }]
      },
      "putendl_fd": {
        "title": "ft_putendl_fd",
        "explanation": "Outputs a string followed by a newline (\\n) to a file descriptor.",
        "resources": [{ "label": "Standard I/O", "url": "https://en.cppreference.com/w/c/io" }]
      },
      "putnbr_fd": {
        "title": "ft_putnbr_fd",
        "explanation": "Outputs an integer to a file descriptor. Usually implemented using recursion to handle multi-digit numbers.",
        "resources": [{ "label": "Recursive Print Number", "url": "https://www.geeksforgeeks.org/print-an-integer-using-recursion/" }]
      },
      "lstnew": {
        "title": "ft_lstnew",
        "explanation": "Creates a new node for a Linked List. The data is stored as a 'void *' so it can hold any type of content.",
        "resources": [{ "label": "Linked List Introduction", "url": "https://www.geeksforgeeks.org/data-structures/linked-list/" }]
      },
      "lstadd_front": {
        "title": "ft_lstadd_front",
        "explanation": "Adds a new node to the start of a list. Requires a 'pointer to a pointer' (**lst) so you can modify the head of the list.",
        "resources": [{ "label": "Pointers to Pointers", "url": "https://www.tutorialspoint.com/cprogramming/c_pointer_to_pointer.htm" }]
      },
      "lstsize": {
        "title": "ft_lstsize",
        "explanation": "Counts the number of elements in a linked list by traversing it.",
        "resources": [{ "label": "Traversal of Linked Lists", "url": "https://www.geeksforgeeks.org/linked-list-set-2-inserting-a-node/" }]
      },
      "lstlast": {
        "title": "ft_lstlast",
        "explanation": "Returns a pointer to the last node in the list.",
        "resources": [{ "label": "Finding the tail node", "url": "https://en.wikipedia.org/wiki/Linked_list" }]
      },
      "lstadd_back": {
        "title": "ft_lstadd_back",
        "explanation": "Appends a new node to the end of the list. Handles the case where the list is empty.",
        "resources": [{ "label": "Adding nodes to the end", "url": "https://www.tutorialspoint.com/data_structures_algorithms/linked_list_algorithms.htm" }]
      },
      "lstdelone": {
        "title": "ft_lstdelone",
        "explanation": "Frees a single node. It uses a custom 'del' function to free the content, then frees the node itself.",
        "resources": [{ "label": "Deleting a node", "url": "https://www.geeksforgeeks.org/linked-list-set-3-deleting-node/" }]
      },
      "lstclear": {
        "title": "ft_lstclear",
        "explanation": "Clears the entire list from a specific node onwards, ensuring all memory is freed and the head is set to NULL.",
        "resources": [{ "label": "Freeing Linked List Memory", "url": "https://stackoverflow.com/questions/7023030/how-to-free-memory-in-a-linked-list" }]
      },
      "lstiter": {
        "title": "ft_lstiter",
        "explanation": "Iterates through the list and applies a function 'f' to the content of every node.",
        "resources": [{ "label": "Higher Order Functions", "url": "https://en.wikipedia.org/wiki/Higher-order_function" }]
      },
      "lstmap": {
        "title": "ft_lstmap",
        "explanation": "The most complex bonus function. It creates a NEW list based on the result of a function applied to the old list. Requires perfect error handling.",
        "resources": [{ "label": "Functional Map in C", "url": "https://en.wikipedia.org/wiki/Map_(higher-order_function)" }]
      }
    }
  },

  "ft_printf": {
    "projectId": "ft_printf",
    "projectTitle": "ft_printf: The Variadic Challenge",
    "overview": "In this project, you will rebuild the famous C library function printf. You will master Variadic Functions, design an extensible dispatch system for different data types, and implement low-level number conversion algorithms. This project teaches you to manage the stack manually, understand type promotion, and write robust, buffer-free output logic.",
    "mermaidDiagram": "flowchart TD\n    Start((START)) --> Prereq[0. PREREQUISITES]\n\n    subgraph Infra [1. VARIADIC INFRASTRUCTURE]\n        direction TB\n        Prereq --> stdarg[\"<stdarg.h> Concepts\"]\n        stdarg --> Init[Function Signature]\n        Init --> va_macros[va_start, va_arg, va_end]\n    end\n\n    Infra --> Handlers\n\n    subgraph Handlers [2. FORMAT SPECIFIERS]\n        direction TB\n        \n        subgraph TextGroup [Text Operations]\n            Handle_C[%c: Character]\n            Handle_S[%s: String]\n            Handle_Pct[%%: Literal]\n        end\n\n        subgraph NumGroup [Decimal Operations]\n            Handle_Int[%d / %i: Signed Integer]\n            Handle_UInt[%u: Unsigned Integer]\n        end\n\n        subgraph HexGroup [Hexadecimal Operations]\n            Handle_Hex[%x / %X: Hexadecimal]\n            Handle_Ptr[%p: Memory Address]\n        end\n    end\n\n    Handlers --> Algos\n\n    subgraph Algos [3. CORE ALGORITHMS]\n        direction TB\n        Recursion[Recursive Digit Printing]\n        Base16[Base 16 Conversion Logic]\n    end\n\n    %% Conceptual Dependencies\n    va_macros -.-> Handlers\n    Handle_Int -.-> Recursion\n    Handle_UInt -.-> Recursion\n    Handle_Hex -.-> Base16\n    Handle_Ptr -.-> Base16\n    Base16 -.-> Recursion\n    \n    Base16 --> Finish((COMPLETE))",
    "nodes": {
      "Prereq": {
        "title": "Prerequisites & Constraints",
        "explanation": "Before writing code, you must understand the strict constraints. You are not allowed to use the standard C library buffer system (`FILE *`, `printf`, `sprintf`). Instead, you must rely entirely on the unbuffered `write(2)` system call. You also need to understand File Descriptors, specifically that `1` represents `stdout` (Standard Output). This means every character you process must be manually sent to the kernel for display, and you must track every single byte written to return the correct count.",
        "resources": [
          { "label": "Write System Call Man Page", "url": "https://man7.org/linux/man-pages/man2/write.2.html" },
          { "label": "File Descriptors Explained", "url": "https://en.wikipedia.org/wiki/File_descriptor" }
        ]
      },
      "stdarg": {
        "title": "Variadic Concepts",
        "explanation": "Variadic functions are functions that can accept an indefinite number of arguments (like `printf`). In C, arguments are pushed onto the stack. A variadic function knows where the fixed arguments end, but it doesn't inherently know how many extra arguments follow or what their types are. The `<stdarg.h>` library provides the mechanisms to manually traverse the stack memory to retrieve these values. Understanding this 'stack walking' is key to debugging segmentation faults in this project.",
        "resources": [
          { "label": "Variadic Functions in C", "url": "https://www.geeksforgeeks.org/variadic-functions-in-c/" }
        ]
      },
      "Init": {
        "title": "Function Signature & Return Value",
        "explanation": "The prototype `int ft_printf(const char *format, ...)` tells the compiler to expect a format string and 'any number of other things'. The return value is critical: `ft_printf` must return the total number of characters successfully written to stdout. You must maintain a counter throughout your entire program, incrementing it with every `write` call. If a write error occurs (rare, but possible), the standard behavior is to return -1.",
        "resources": [
          { "label": "Printf Manual", "url": "https://linux.die.net/man/3/printf" }
        ]
      },
      "va_macros": {
        "title": "va_start, va_arg, va_end",
        "explanation": "These macros manipulate the stack pointer. `va_start` initializes a pointer (`va_list`) to the location in memory right after your last fixed argument (`format`). `va_arg` does two things: it retrieves the data at the current pointer location casting it to the type you specify (e.g., `int`), and then advances the pointer to the next argument. `va_end` is used to clean up; while often a no-op on modern Intel CPUs, it is required for portability and proper stack frame restoration on other architectures.",
        "resources": [
          { "label": "Man stdarg(3)", "url": "https://linux.die.net/man/3/stdarg" }
        ]
      },
      "Handle_C": {
        "title": "%c (Character)",
        "explanation": "This handles printing a single character. A crucial concept here is 'Default Argument Promotion'. When passing a `char` to a variadic function, C automatically promotes it to an `int` to align with the CPU's word size. Therefore, you must use `va_arg(args, int)` to retrieve it, and then cast it back to `(unsigned char)` before passing it to `write`. Failing to do this can lead to reading garbage data.",
        "resources": [
          { "label": "Default Argument Promotions", "url": "https://stackoverflow.com/questions/28054194/char-argument-promotion-in-variadic-functions" }
        ]
      },
      "Handle_S": {
        "title": "%s (String)",
        "explanation": "This handles printing a string (char pointer). The primary complexity is safety. In standard C, passing a NULL pointer to `%s` is undefined behavior, but in robust implementations (like `ft_printf`), you are expected to detect NULL and print `(null)` instead of crashing. You must iterate through the string, writing one byte at a time (or using `strlen` and `write`) and adding the length to your total return count.",
        "resources": []
      },
      "Handle_Pct": {
        "title": "%% (Percent Literal)",
        "explanation": "Since `%` acts as the 'escape character' that triggers formatting, we need a way to print the actual percent symbol. The sequence `%%` is used for this. This handler consumes *no* arguments from the `va_list`; it simply writes a `%` to stdout and continues parsing the format string.",
        "resources": []
      },
      "Handle_Int": {
        "title": "%d / %i (Signed Integer)",
        "explanation": "This handles signed decimal integers. The most difficult edge case is `INT_MIN` (-2147483648). If you try to simply negate this number (`n = -n`) to print it as positive, it will overflow because `2147483648` cannot fit in a signed 32-bit integer (max is `2147483647`). You must handle this case specifically (hardcoding the string or using unsigned casting) to avoid logic errors.",
        "resources": [
          { "label": "Integer Limits & Two's Complement", "url": "https://en.wikipedia.org/wiki/2,147,483,647#In_computing" }
        ]
      },
      "Handle_UInt": {
        "title": "%u (Unsigned Integer)",
        "explanation": "This handles unsigned integers. Unlike `%d`, this specifier interprets the 32 bits of the integer purely as magnitude, with no sign bit. This allows it to represent numbers up to roughly 4.29 billion. Your printing logic must ensure it does not check for negative signs, as `(unsigned int)-1` is actually a very large positive number.",
        "resources": []
      },
      "Handle_Hex": {
        "title": "%x / %X (Hexadecimal)",
        "explanation": "This converts an integer into Base 16. In Base 16, we use digits 0-9 and letters a-f. The logic involves modulo 16 (`% 16`) to find the current digit and division by 16 (`/ 16`) to move to the next. `%x` implies using the lowercase set `abcdef`, while `%X` uses `ABCDEF`. This is typically solved by passing the specific 'base string' (e.g., \"0123456789abcdef\") to your recursive printing function.",
        "resources": [
          { "label": "Hexadecimal System", "url": "https://www.mathsisfun.com/hexadecimals.html" }
        ]
      },
      "Handle_Ptr": {
        "title": "%p (Pointer Address)",
        "explanation": "This prints the memory address a pointer holds. In hardware, a pointer is just a number (usually `unsigned long` or `uintptr_t`). You must cast the `void *` argument to a `uintptr_t` to ensure it holds the full address size (64-bit on modern machines). The standard format prefixes the output with `0x` followed by the hexadecimal value. Special care must be taken for NULL pointers, which often print as `(nil)` on Linux or `0x0` on Mac.",
        "resources": [
          { "label": "Pointers and Memory Addresses", "url": "https://www.tutorialspoint.com/cprogramming/c_pointers.htm" }
        ]
      },
      "Recursion": {
        "title": "Recursive Digit Printing",
        "explanation": "Since standard `write` only prints characters, you cannot print a number directly. You must convert it to digits. Recursion is the most elegant way to do this without a buffer. The logic is: 'If the number is > 9, call self with (number / 10)'. This effectively pushes all digits onto the stack. When the recursion unwinds, you print `number % 10`. This ensures the digits appear in the correct order (Left-to-Right) even though you process them Right-to-Left mathematically.",
        "resources": [
          { "label": "Recursive Printing Logic", "url": "https://www.geeksforgeeks.org/recursive-program-to-print-an-integer/" }
        ]
      },
      "Base16": {
        "title": "Base 16 Conversion Logic",
        "explanation": "This is a variation of the recursive printing algorithm. Instead of dividing/modulating by 10, you use 16. The critical addition is mapping the remainder to the correct character. If the remainder is between 0-9, you print the ASCII digit. If it is between 10-15, you must calculate the offset to print 'a' through 'f' (e.g., `remainder - 10 + 'a'`).",
        "resources": []
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

// Python module names and descriptions
const pythonModuleInfo: Record<number, { name: string; overview: string }> = {
  0: { name: 'Starting', overview: 'Introduction to Python basics. Learn about variables, data types, basic I/O operations, and Python syntax fundamentals. Your first steps into Python programming.' },
  1: { name: 'Array', overview: 'Working with arrays and lists in Python. Learn about list operations, slicing, comprehensions, and array manipulation techniques.' },
  2: { name: 'DataTable', overview: 'Data manipulation with tables. Introduction to structured data handling, CSV operations, and data organization patterns.' },
  3: { name: 'OOP', overview: 'Object-Oriented Programming in Python. Master classes, objects, inheritance, polymorphism, and encapsulation concepts.' },
  4: { name: 'DOD', overview: 'Data-Oriented Design patterns. Learn about decorators, generators, and advanced Python design patterns for efficient code.' },
  5: { name: 'SQL', overview: 'Database operations with Python. Connect to databases, write SQL queries, and integrate database functionality in your applications.' },
  6: { name: 'Django', overview: 'Web development with Django framework. Build web applications, understand MVC architecture, and create RESTful APIs.' },
  7: { name: 'Django Advanced', overview: 'Advanced Django concepts. Authentication, middleware, testing, deployment, and building production-ready applications.' },
  8: { name: 'Numpy', overview: 'Numerical computing with NumPy. Master array operations, mathematical functions, and scientific computing basics.' },
  9: { name: 'Pandas', overview: 'Data analysis with Pandas. DataFrame manipulation, data cleaning, and analysis techniques for data science workflows.' },
  10: { name: 'Machine Learning', overview: 'Introduction to Machine Learning. Supervised and unsupervised learning, model training, and evaluation with scikit-learn.' },
};

// Generate a roadmap for individual Python modules
function generatePythonModuleRoadmap(moduleNumber: number): ProjectRoadmap {
  const info = pythonModuleInfo[moduleNumber] || { name: `Module ${moduleNumber}`, overview: 'Python module content.' };

  return {
    projectId: `python-module-${moduleNumber}`,
    projectTitle: `Python ${info.name}`,
    overview: info.overview,
    mermaidDiagram: '',
    nodes: {}
  };
}

// Get roadmap by project ID
export function getRoadmapByProjectId(projectId: string): ProjectRoadmap | undefined {
  // Check if it's an individual Python module
  const pythonModuleMatch = projectId.match(/^python-module-(\d+)$/);
  if (pythonModuleMatch) {
    const moduleNumber = parseInt(pythonModuleMatch[1], 10);
    if (moduleNumber >= 0 && moduleNumber <= 10) {
      return generatePythonModuleRoadmap(moduleNumber);
    }
  }

  return projectRoadmaps[projectId];
}

// Get all available project IDs with roadmaps
export function getAvailableRoadmapIds(): string[] {
  return Object.keys(projectRoadmaps);
}
