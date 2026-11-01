import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  FolderGit2,
  Terminal,
  FileCode,
  HardDrive,
  Clock,
  Network,
  Info,
} from 'lucide-react';
import { LanguageId } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

export const DockerSandboxView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<LanguageId>('python');
  const spec = SUPPORTED_LANGUAGES[selectedLang];

  const generatedScript = `#!/bin/bash
# Code-Testing-System Container Test Runner (src/sandbox/dockering.py)
set -e

${spec.compileCmd ? `# Step 1: Compilation\n${spec.compileCmd}\n` : '# Step 1: Interpreted (No compilation required)'}
# Step 2: Test Case Iteration
for input in tests/*.in
do
    output="\${input%.in}.out"
    
    # Run user executable with timeout 2s inside isolated sandbox
    result=$(timeout 2s ${spec.runCmd} < "$input")
    
    expected=$(cat "$output")
    
    if [ "$result" = "$expected" ]; then
        echo "$input: OK"
    else
        echo "$input: FAIL"
        echo "Expected: $expected"
        echo "Got: $result"
    fi
done
`;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-slate-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px] mb-1">
          <Cpu className="w-4 h-4" />
          <span>SANDBOX RUNNER ENGINE SPECIFICATION</span>
        </div>
        <h2 className="text-lg font-bold text-slate-100">
          Sandbox Architecture & Docker Execution Lifecycle
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Direct implementation of <code className="text-slate-300">src/sandbox/dockering.py</code> and{' '}
          <code className="text-slate-300">src/sandbox/tempfolder.py</code> based on the design schematic in{' '}
          <code className="text-blue-300">image.png</code>.
        </p>
      </div>

      {/* Visual Sandbox Architecture Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <h3 className="text-xs uppercase font-mono font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Container Directory Layout (image.png schematic)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Section 1: User Submissions */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-300 font-mono flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-blue-400" />
                /sandbox/app/...
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">
                Mandatory Main
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              User submitted code files. Must contain a main entry point (
              <code className="text-slate-300 font-mono">main.py</code>,{' '}
              <code className="text-slate-300 font-mono">main.cpp</code>, or{' '}
              <code className="text-slate-300 font-mono">Main.java</code>) alongside optional helper modules.
            </p>
            <div className="p-2 bg-slate-900 rounded font-mono text-[10px] text-slate-300 space-y-0.5 border border-slate-800">
              <div>├── main.py (or main.cpp / Main.java)</div>
              <div>├── matrix_utils.py</div>
              <div>└── helper.py</div>
            </div>
          </div>

          {/* Section 2: Data Files */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-amber-400" />
                /sandbox/data/...
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                System Data
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              System data files mounted from problems library (e.g. <code className="text-slate-300 font-mono">.csv</code>,{' '}
              <code className="text-slate-300 font-mono">.npy</code>, datasets). Accessible directly via relative path.
            </p>
            <div className="p-2 bg-slate-900 rounded font-mono text-[10px] text-slate-300 space-y-0.5 border border-slate-800">
              <div>├── data.csv</div>
              <div>├── weights.npy</div>
              <div>└── lookup_table.txt</div>
            </div>
          </div>

          {/* Section 3: Checker / Test Suite */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                /sandbox/tests/...
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                Evaluator
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Evaluator pairs (<code className="text-slate-300 font-mono">*.in</code> and{' '}
              <code className="text-slate-300 font-mono">*.out</code>) and synthesized{' '}
              <code className="text-slate-300 font-mono">run.sh</code> script grading stdout vs expected output.
            </p>
            <div className="p-2 bg-slate-900 rounded font-mono text-[10px] text-slate-300 space-y-0.5 border border-slate-800">
              <div>├── tests/01.in & tests/01.out</div>
              <div>├── tests/02.in & tests/02.out</div>
              <div>└── run.sh (timeout 2s)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Resource Isolation Constraints */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
        <h3 className="text-xs uppercase font-mono font-bold text-slate-200 tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Container Constraints & Limits (src/sandbox/dockering.py)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Timeout
            </div>
            <div className="text-base font-bold text-slate-100 mt-1">2.0s</div>
            <div className="text-[10px] text-slate-400">timeout 2s &lt; "$input"</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              Memory Limit
            </div>
            <div className="text-base font-bold text-slate-100 mt-1">256MB</div>
            <div className="text-[10px] text-slate-400">mem_limit="256m"</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              PID Limit
            </div>
            <div className="text-base font-bold text-slate-100 mt-1">64 PIDs</div>
            <div className="text-[10px] text-slate-400">pids_limit=64</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase">
              <Network className="w-3.5 h-3.5 text-rose-400" />
              Network
            </div>
            <div className="text-base font-bold text-emerald-400 mt-1">Disabled</div>
            <div className="text-[10px] text-slate-400">network_disabled=True</div>
          </div>
        </div>
      </div>

      {/* Generated Scripts & Dockerfile Explorer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs uppercase font-mono font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            Language Environment & Runner Script Generator
          </h3>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
            {(['python', 'cpp', 'java'] as LanguageId[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedLang === lang
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Generated run.sh */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Synthesized /sandbox/run.sh:</span>
              <span className="text-slate-500">Auto-generated</span>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto whitespace-pre">
              {generatedScript}
            </pre>
          </div>

          {/* Dockerfile */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>{spec.dockerImage} Dockerfile:</span>
              <span className="text-blue-400 font-bold">{spec.version}</span>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre">
              {spec.dockerfile}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
