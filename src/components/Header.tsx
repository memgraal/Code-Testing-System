import React from 'react';
import {
  Code2,
  Terminal,
  Server,
  History,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  FileCode2,
} from 'lucide-react';
import { LanguageId, Task } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface HeaderProps {
  currentTab: 'editor' | 'sandbox' | 'api' | 'history';
  setCurrentTab: (tab: 'editor' | 'sandbox' | 'api' | 'history') => void;
  tasks: Task[];
  selectedTaskId: string;
  onSelectTask: (id: string) => void;
  selectedLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
  isRunning: boolean;
  onRunCustom: () => void;
  onSubmit: () => void;
  submissionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  tasks,
  selectedTaskId,
  onSelectTask,
  selectedLanguage,
  onSelectLanguage,
  isRunning,
  onRunCustom,
  onSubmit,
  submissionCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Task Picker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400">
            <Code2 className="w-5 h-5 text-blue-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-slate-100 flex items-center gap-1.5">
                Code Testing System
                <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30">
                  Sandboxed
                </span>
              </span>
            </div>
          </div>

          {/* Task Dropdown */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <span className="text-xs text-slate-400 hidden sm:inline">Problem:</span>
            <select
              value={selectedTaskId}
              onChange={(e) => onSelectTask(e.target.value)}
              className="bg-slate-950 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium max-w-[220px] sm:max-w-[280px] truncate"
            >
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              currentTab === 'editor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => setCurrentTab('sandbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              currentTab === 'sandbox'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Sandbox Architecture</span>
          </button>

          <button
            onClick={() => setCurrentTab('api')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              currentTab === 'api'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>FastAPI Endpoints</span>
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors relative ${
              currentTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            {submissionCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                {submissionCount}
              </span>
            )}
          </button>
        </nav>

        {/* Language selector & Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs">
            <span className="text-slate-500 mr-1.5 font-mono">LANG:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as LanguageId)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {(Object.keys(SUPPORTED_LANGUAGES) as LanguageId[]).map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-slate-100">
                  {SUPPORTED_LANGUAGES[lang].name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Run */}
          <button
            onClick={onRunCustom}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all disabled:opacity-50"
            title="Execute against custom test input"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span className="hidden sm:inline">Run Code</span>
          </button>

          {/* Submit & Test */}
          <button
            onClick={onSubmit}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            title="Evaluate against all problem test cases"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Judging...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit & Test</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
