import React, { useState } from 'react';
import { TestCase, CodeVerdictType } from '../types';
import { Play, Eye, EyeOff, Terminal, Plus, Trash2 } from 'lucide-react';

interface TestCasesPanelProps {
  testCases: TestCase[];
  customInput: string;
  setCustomInput: (val: string) => void;
  customOutput: {
    stdout: string;
    stderr: string;
    verdict: CodeVerdictType;
    durationMs: number;
  } | null;
  onRunCustom: () => void;
  isRunning: boolean;
  onAddTestCase: (input: string, output: string) => void;
  onDeleteTestCase: (id: string) => void;
}

export const TestCasesPanel: React.FC<TestCasesPanelProps> = ({
  testCases,
  customInput,
  setCustomInput,
  customOutput,
  onRunCustom,
  isRunning,
  onAddTestCase,
  onDeleteTestCase,
}) => {
  const [activeTab, setActiveTab] = useState<'samples' | 'custom'>('samples');
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(
    testCases[0]?.id || ''
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIn, setNewIn] = useState('');
  const [newOut, setNewOut] = useState('');

  const selectedTest =
    testCases.find((tc) => tc.id === selectedTestCaseId) || testCases[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIn.trim()) return;
    onAddTestCase(newIn, newOut);
    setNewIn('');
    setNewOut('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden text-xs">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-3 py-1.5 select-none">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'samples'
                ? 'bg-slate-800 text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Test Suite</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-slate-400 border border-slate-800">
              {testCases.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'custom'
                ? 'bg-slate-800 text-blue-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Custom Input & Output</span>
          </button>
        </div>

        {activeTab === 'samples' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Test Case</span>
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'samples' ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Test Case Selector Sidebar */}
          <div className="w-full md:w-48 bg-slate-900/50 border-r border-slate-800 p-2 overflow-y-auto space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2 py-1">
              Test Files (tests/*.in)
            </div>
            {testCases.map((tc, idx) => {
              const isSelected = tc.id === selectedTest?.id;
              return (
                <div
                  key={tc.id}
                  onClick={() => setSelectedTestCaseId(tc.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 text-blue-300 font-medium border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {tc.isHidden ? (
                      <EyeOff className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">Case #{idx + 1}</span>
                  </div>

                  {testCases.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTestCase(tc.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Case Details */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono">
            {selectedTest && (
              <>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <span>{selectedTest.name}</span>
                    {selectedTest.isHidden && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        Hidden Evaluation Test
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Standard Input (stdin / .in)</span>
                      <span className="text-slate-500">{selectedTest.input.length} bytes</span>
                    </div>
                    <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-200 text-xs overflow-auto max-h-48 whitespace-pre font-mono">
                      {selectedTest.input}
                    </pre>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Expected Output (.out)</span>
                      <span className="text-slate-500">
                        {selectedTest.expectedOutput.length} bytes
                      </span>
                    </div>
                    <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-emerald-400 text-xs overflow-auto max-h-48 whitespace-pre font-mono">
                      {selectedTest.expectedOutput}
                    </pre>
                  </div>
                </div>

                {selectedTest.explanation && (
                  <div className="text-slate-400 bg-slate-900/30 p-2.5 rounded border border-slate-800/80 text-[11px] font-sans">
                    <span className="font-medium text-slate-300">Explanation:</span>{' '}
                    {selectedTest.explanation}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* Custom Input / Output Tab */
        <div className="flex-1 p-3 flex flex-col md:flex-row gap-3 overflow-y-auto">
          {/* Input Side */}
          <div className="flex-1 flex flex-col min-h-[140px]">
            <div className="flex items-center justify-between mb-1.5 text-slate-300 font-mono text-[11px]">
              <span>Custom Input (stdin):</span>
              <button
                onClick={onRunCustom}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-sans font-medium transition-colors disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Execute</span>
              </button>
            </div>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter custom input to feed via standard input..."
              className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px]"
            />
          </div>

          {/* Output Side */}
          <div className="flex-1 flex flex-col min-h-[140px]">
            <div className="flex items-center justify-between mb-1.5 text-slate-300 font-mono text-[11px]">
              <span>Execution Output (stdout / stderr):</span>
              {customOutput && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{customOutput.durationMs}ms</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      customOutput.verdict === 'OK'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {customOutput.verdict}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs overflow-auto min-h-[120px]">
              {customOutput ? (
                <div>
                  {customOutput.stdout && (
                    <pre className="text-slate-100 whitespace-pre">{customOutput.stdout}</pre>
                  )}
                  {customOutput.stderr && (
                    <pre className="text-rose-400 whitespace-pre mt-1 border-t border-slate-800 pt-1">
                      {customOutput.stderr}
                    </pre>
                  )}
                  {!customOutput.stdout && !customOutput.stderr && (
                    <span className="text-slate-500 italic">No output produced</span>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 italic">
                  Press 'Execute' or 'Run Code' to test your code with custom input
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Test Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-full max-w-md shadow-xl space-y-3">
            <h3 className="font-bold text-slate-100 text-sm">Add New Test Case</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Test Input (stdin):
                </label>
                <textarea
                  value={newIn}
                  onChange={(e) => setNewIn(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none"
                  placeholder="Input tokens or lines..."
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Expected Output (stdout):
                </label>
                <textarea
                  value={newOut}
                  onChange={(e) => setNewOut(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none"
                  placeholder="Expected output matching solution..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800 font-sans">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Add Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
