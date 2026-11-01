export type CodeVerdictType = 'OK' | 'WA' | 'TLE' | 'MLE' | 'RE' | 'CE';

export interface CodeVerdictInfo {
  answer: CodeVerdictType;
  description: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const VERDICTS: Record<CodeVerdictType, CodeVerdictInfo> = {
  OK: {
    answer: 'OK',
    description: 'Accepted',
    color: '#22c55e',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-400',
  },
  WA: {
    answer: 'WA',
    description: 'Wrong Answer',
    color: '#ef4444',
    badgeBg: 'bg-red-500/10',
    badgeBorder: 'border-red-500/30',
    badgeText: 'text-red-400',
  },
  TLE: {
    answer: 'TLE',
    description: 'Time Limit Exceeded',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
  },
  MLE: {
    answer: 'MLE',
    description: 'Memory Limit Exceeded',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-400',
  },
  RE: {
    answer: 'RE',
    description: 'Runtime Error',
    color: '#f43f5e',
    badgeBg: 'bg-rose-500/10',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-400',
  },
  CE: {
    answer: 'CE',
    description: 'Compilation Error',
    color: '#eab308',
    badgeBg: 'bg-yellow-500/10',
    badgeBorder: 'border-yellow-500/30',
    badgeText: 'text-yellow-400',
  },
};

export type LanguageId = 'python' | 'cpp' | 'java';

export interface LanguageSpec {
  id: LanguageId;
  name: string;
  version: string;
  entryFile: string;
  compileCmd: string | null;
  runCmd: string;
  dockerImage: string;
  dockerfile: string;
  boilerplate: string;
}

export interface SourceFile {
  id: string;
  name: string;
  content: string;
  isMain?: boolean;
  isReadOnly?: boolean;
  type?: 'code' | 'data' | 'test';
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface Task {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  timeLimitSec: number;
  memoryLimitMb: number;
  allowedLanguages: LanguageId[];
  defaultFiles: Record<LanguageId, SourceFile[]>;
  dataFiles?: SourceFile[];
  testCases: TestCase[];
}

export interface TestResult {
  testCaseId: string;
  testName: string;
  verdict: CodeVerdictType;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
  memoryUsedMb: number;
  stderr?: string;
  errorDetails?: string;
}

export interface SubmissionResult {
  id: string;
  taskId: string;
  taskTitle: string;
  timestamp: number;
  language: LanguageId;
  overallVerdict: CodeVerdictType;
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  peakMemoryMb: number;
  compilationOutput?: string;
  logs?: string;
  testResults: TestResult[];
  submittedFiles: { name: string; size: number }[];
}

export interface SandboxEnvironmentConfig {
  networkDisabled: boolean;
  memoryLimit: string;
  pidsLimit: number;
  timeoutSec: number;
  workdir: string;
}
