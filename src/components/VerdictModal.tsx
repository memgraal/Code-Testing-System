import React, { useState } from 'react';
import { SubmissionResult, VERDICTS, CodeVerdictType } from '../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  AlertTriangle,
  FileCode,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface VerdictModalProps {
  result: SubmissionResult | null;
  onClose: () => void;
}

export const VerdictModal: React.FC<VerdictModalProps> = ({ result, onClose }) => {
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  if (!result) return null;

  const verdictMeta = VERDICTS[result.overallVerdict];
  const isAccepted = result.overallVerdict === 'OK';

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isAccepted
              ? 'bg-emerald-950/40 border-emerald-500/30'
              : 'bg-rose-950/40 border-rose-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {isAccepted ? (
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <XCircle className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-lg font-black tracking-wide px-2 py-0.5 rounded ${verdictMeta.badgeBg} ${verdictMeta.badgeBorder} ${verdictMeta.badgeText} border`}
                >
                  {verdictMeta.answer}
                </span>
                <span className="font-bold text-slate-100 text-sm sm:text-base">
                  {verdictMeta.description}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {result.taskTitle} • {result.language.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Tests Passed</span>
            <span className="font-mono font-bold text-slate-100 text-sm">
              {result.passedCount} / {result.totalCount}
            </span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Peak Time</span>
            <span className="font-mono font-bold text-slate-100 text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {result.executionTimeMs} ms
            </span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Memory</span>
            <span className="font-mono font-bold text-slate-100 text-sm flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              {result.peakMemoryMb} MB
            </span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Submitted</span>
            <span className="font-mono text-slate-300 text-xs truncate">
              {result.submittedFiles.map((f) => f.name).join(', ')}
            </span>
          </div>
        </div>

        {/* Compilation Log (if any) */}
        {result.compilationOutput && (
          <div className="p-3 bg-amber-950/20 border-b border-amber-900/40 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Compilation Diagnostics:</span>
            </div>
            <pre className="p-2 bg-slate-950 rounded border border-amber-900/50 font-mono text-[11px] text-amber-200 overflow-x-auto whitespace-pre">
              {result.compilationOutput}
            </pre>
          </div>
        )}

        {/* Test Case Breakdown List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
          <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-2 font-mono">
            Test Case Execution Breakdown
          </h4>

          {result.testResults.map((tr, index) => {
            const isTestOk = tr.verdict === 'OK';
            const isExpanded =
              expandedTestId === tr.testCaseId || (!isAccepted && !isTestOk && index === 0);
            const vInfo = VERDICTS[tr.verdict];

            return (
              <div
                key={tr.testCaseId}
                className={`rounded-lg border transition-all ${
                  isTestOk
                    ? 'border-slate-800 bg-slate-900/40'
                    : 'border-rose-900/60 bg-rose-950/15'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() =>
                    setExpandedTestId(isExpanded ? null : tr.testCaseId)
                  }
                  className="flex items-center justify-between p-2.5 cursor-pointer select-none hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${vInfo.badgeBg} ${vInfo.badgeBorder} ${vInfo.badgeText}`}
                    >
                      {tr.verdict}
                    </span>
                    <span className="font-semibold text-slate-200">{tr.testName}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span>{tr.executionTimeMs} ms</span>
                    <span>{tr.memoryUsedMb} MB</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2 font-mono text-[11px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">
                          Standard Input (stdin):
                        </span>
                        <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 max-h-28 overflow-auto whitespace-pre">
                          {tr.input || '(empty)'}
                        </pre>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">
                          Expected Output (.out):
                        </span>
                        <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 max-h-28 overflow-auto whitespace-pre">
                          {tr.expectedOutput}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">
                        Your Program Output (stdout):
                      </span>
                      <pre
                        className={`p-2 rounded border max-h-28 overflow-auto whitespace-pre ${
                          isTestOk
                            ? 'bg-slate-950 border-slate-800 text-slate-100'
                            : 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                        }`}
                      >
                        {tr.actualOutput || (
                          <span className="text-slate-600 italic">No output produced</span>
                        )}
                      </pre>
                    </div>

                    {tr.stderr && (
                      <div>
                        <span className="text-[10px] text-rose-400 block uppercase">
                          Standard Error / Traceback:
                        </span>
                        <pre className="bg-rose-950/20 p-2 rounded border border-rose-900/50 text-rose-300 max-h-32 overflow-auto whitespace-pre">
                          {tr.stderr}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            ID: {result.id} • {new Date(result.timestamp).toLocaleTimeString()}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
