import React, { useState } from 'react';
import { SubmissionResult, VERDICTS, CodeVerdictType } from '../types';
import { History, Clock, HardDrive, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

interface SubmissionsHistoryProps {
  submissions: SubmissionResult[];
  onSelectSubmission: (submission: SubmissionResult) => void;
  onClearHistory: () => void;
}

export const SubmissionsHistory: React.FC<SubmissionsHistoryProps> = ({
  submissions,
  onSelectSubmission,
  onClearHistory,
}) => {
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = submissions.filter((sub) => {
    if (filterVerdict !== 'ALL' && sub.overallVerdict !== filterVerdict) return false;
    if (
      searchQuery &&
      !sub.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !sub.language.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-4 text-xs text-slate-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px] mb-1">
            <History className="w-4 h-4" />
            <span>EXECUTION ARCHIVE</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">Submission History</h2>
        </div>

        {submissions.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-900/40 hover:bg-rose-950/30 transition-colors"
          >
            Clear Archive
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by problem or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-400">Verdict:</span>
          <select
            value={filterVerdict}
            onChange={(e) => setFilterVerdict(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Verdicts</option>
            {Object.keys(VERDICTS).map((v) => (
              <option key={v} value={v}>
                {v} ({VERDICTS[v as CodeVerdictType].description})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions Table / List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 space-y-2">
          <History className="w-8 h-8 text-slate-700" />
          <span>No submissions recorded yet. Run or submit a problem to view logs.</span>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 select-none">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Problem</th>
                  <th className="py-2.5 px-3">Verdict</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Lang</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Memory</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((sub) => {
                  const vMeta = VERDICTS[sub.overallVerdict];
                  const isAccepted = sub.overallVerdict === 'OK';

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => onSelectSubmission(sub)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 text-slate-400">
                        {new Date(sub.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200 font-sans">
                        {sub.taskTitle}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${vMeta.badgeBg} ${vMeta.badgeBorder} ${vMeta.badgeText}`}
                        >
                          {vMeta.answer}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-200">
                        <span
                          className={isAccepted ? 'text-emerald-400' : 'text-slate-300'}
                        >
                          {sub.passedCount} / {sub.totalCount}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 uppercase text-blue-400">
                        {sub.language}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {sub.executionTimeMs}ms
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {sub.peakMemoryMb}MB
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-blue-400 hover:underline">
                          View &rarr;
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
