# Code Testing System

An automated online code testing and evaluation system ported from Python/FastAPI to React, TypeScript, and Tailwind CSS.

## Overview

Code Testing System models the architecture outlined in the original schematic (`image.png`) and sandboxed runner (`src/sandbox/dockering.py`):
- **Multi-File Workspace**: Supports multi-file submissions containing a mandatory main entry point (`main.py`, `main.cpp`, `Main.java`) alongside helper modules and utility files.
- **System Data Files**: Supports mounting external dataset files (such as `.csv`, `.npy`, `.txt`) into the sandbox working directory for data analysis and algorithm testing.
- **Sandboxed Runner & Verdict Pipeline**: Evaluates user code against test cases with strict timeout limits (2.0s) and memory constraints (256MB), generating standard verdicts:
  - `OK` (Accepted)
  - `WA` (Wrong Answer)
  - `TLE` (Time Limit Exceeded)
  - `MLE` (Memory Limit Exceeded)
  - `RE` (Runtime Error)
  - `CE` (Compilation Error)
- **FastAPI Endpoints Simulator**: Interactive playground for the original `/testing/test/files` (multipart uploads) and `/testing/test/text` (direct code string) routes.
- **Languages Supported**: Python 3.11 (via Pyodide in-browser sandbox with virtual filesystem and mock runner fallback), C++ 20 (GCC 12), and Java 17 (OpenJDK).

## Development

```bash
npm install
npm run dev
```

The development server runs on `http://0.0.0.0:3000`.
