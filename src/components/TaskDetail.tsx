import React from 'react';
import { Task } from '../types';
import { Clock, HardDrive, Tag, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface TaskDetailProps {
  task: Task;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
      {/* Title & Metadata */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              task.difficulty === 'Easy'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : task.difficulty === 'Medium'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {task.difficulty}
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Tag className="w-3 h-3 text-slate-500" />
            {task.category}
          </span>
        </div>
        <h2 className="text-base font-bold text-slate-100">{task.title}</h2>
      </div>

      {/* Constraints Bar */}
      <div className="flex flex-wrap items-center gap-3 py-2 px-3 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Time Limit:</span>
          <span className="font-mono font-semibold text-slate-100">{task.timeLimitSec}s</span>
        </div>
        <div className="w-px h-3.5 bg-slate-800" />
        <div className="flex items-center gap-1.5 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-purple-400" />
          <span>Memory Limit:</span>
          <span className="font-mono font-semibold text-slate-100">{task.memoryLimitMb}MB</span>
        </div>
        {task.dataFiles && task.dataFiles.length > 0 && (
          <>
            <div className="w-px h-3.5 bg-slate-800" />
            <div className="flex items-center gap-1.5 text-amber-300">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Mounted Data:</span>
              <span className="font-mono font-semibold">
                {task.dataFiles.map((d) => d.name).join(', ')}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
          Description
        </h3>
        <div className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
          {task.description}
        </div>
      </div>

      {/* Input / Output Format */}
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-slate-200 mb-1">Input Format</h4>
          <pre className="bg-slate-950 p-2.5 rounded border border-slate-800/80 text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
            {task.inputFormat}
          </pre>
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 mb-1">Output Format</h4>
          <pre className="bg-slate-950 p-2.5 rounded border border-slate-800/80 text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
            {task.outputFormat}
          </pre>
        </div>
      </div>

      {/* Constraints */}
      <div>
        <h4 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
          Constraints
        </h4>
        <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px] bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
          {task.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Visible Samples */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
          Sample Test Cases ({task.testCases.filter((tc) => !tc.isHidden).length} visible)
        </h3>
        {task.testCases
          .filter((tc) => !tc.isHidden)
          .map((tc, idx) => (
            <div
              key={tc.id}
              className="bg-slate-900/60 rounded-lg border border-slate-800 p-3 space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>{tc.name}</span>
                <span className="text-slate-500 font-mono">Sample #{idx + 1}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5 font-mono">Input (.in)</div>
                  <pre className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-slate-200 overflow-x-auto max-h-24">
                    {tc.input}
                  </pre>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5 font-mono">
                    Expected Output (.out)
                  </div>
                  <pre className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-emerald-400 overflow-x-auto max-h-24">
                    {tc.expectedOutput}
                  </pre>
                </div>
              </div>
              {tc.explanation && (
                <div className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded border border-slate-800/50">
                  <span className="text-slate-500 font-medium">Note:</span> {tc.explanation}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
