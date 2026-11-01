import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TaskDetail } from './components/TaskDetail';
import { CodeEditor } from './components/CodeEditor';
import { TestCasesPanel } from './components/TestCasesPanel';
import { VerdictModal } from './components/VerdictModal';
import { DockerSandboxView } from './components/DockerSandboxView';
import { ApiTester } from './components/ApiTester';
import { SubmissionsHistory } from './components/SubmissionsHistory';
import { DEFAULT_TASKS } from './data/defaultTasks';
import { SUPPORTED_LANGUAGES } from './data/languages';
import {
  Task,
  LanguageId,
  SourceFile,
  TestCase,
  SubmissionResult,
  CodeVerdictType,
} from './types';
import { executeSubmission, executeCustomRun } from './engine/runner';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(DEFAULT_TASKS[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('python');
  const [currentTab, setCurrentTab] = useState<'editor' | 'sandbox' | 'api' | 'history'>('editor');

  // File states per task and language: Map<taskId, Record<LanguageId, SourceFile[]>>
  const [taskFiles, setTaskFiles] = useState<Record<string, Record<LanguageId, SourceFile[]>>>(() => {
    const initial: Record<string, Record<LanguageId, SourceFile[]>> = {};
    DEFAULT_TASKS.forEach((t) => {
      initial[t.id] = {
        python: [...(t.defaultFiles.python || [])],
        cpp: [...(t.defaultFiles.cpp || [])],
        java: [...(t.defaultFiles.java || [])],
      };
      // If task has data files (e.g. data.csv), also attach to each language workspace
      if (t.dataFiles && t.dataFiles.length > 0) {
        (['python', 'cpp', 'java'] as LanguageId[]).forEach((lang) => {
          t.dataFiles?.forEach((df) => {
            if (!initial[t.id][lang].some((f) => f.name === df.name)) {
              initial[t.id][lang].push({ ...df });
            }
          });
        });
      }
    });
    return initial;
  });

  const currentTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  // Current active files for current task and language
  const currentLanguageFiles: SourceFile[] =
    taskFiles[selectedTaskId]?.[selectedLanguage] &&
    taskFiles[selectedTaskId][selectedLanguage].length > 0
      ? taskFiles[selectedTaskId][selectedLanguage]
      : [
          {
            id: `default-${selectedTaskId}-${selectedLanguage}`,
            name: SUPPORTED_LANGUAGES[selectedLanguage].entryFile,
            isMain: true,
            content: SUPPORTED_LANGUAGES[selectedLanguage].boilerplate,
          },
        ];

  const [activeFileId, setActiveFileId] = useState<string>(
    currentLanguageFiles[0]?.id || ''
  );

  // Sync active file when switching task/lang
  useEffect(() => {
    if (currentLanguageFiles.length > 0) {
      if (!currentLanguageFiles.some((f) => f.id === activeFileId)) {
        setActiveFileId(currentLanguageFiles[0].id);
      }
    }
  }, [selectedTaskId, selectedLanguage, currentLanguageFiles, activeFileId]);

  // Custom runner input & output state
  const [customInput, setCustomInput] = useState<string>(
    currentTask.testCases[0]?.input || ''
  );
  const [customOutput, setCustomOutput] = useState<{
    stdout: string;
    stderr: string;
    verdict: CodeVerdictType;
    durationMs: number;
  } | null>(null);

  // Sync custom input default when task changes
  useEffect(() => {
    if (currentTask.testCases[0]?.input) {
      setCustomInput(currentTask.testCases[0].input);
    }
    setCustomOutput(null);
  }, [selectedTaskId]);

  // Submission results
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [latestSubmission, setLatestSubmission] = useState<SubmissionResult | null>(null);
  const [showVerdictModal, setShowVerdictModal] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);

  // Update code content
  const handleCodeChange = (fileId: string, content: string) => {
    setTaskFiles((prev) => {
      const currentTaskMap = prev[selectedTaskId] || {
        python: [],
        cpp: [],
        java: [],
      };
      const langList = currentTaskMap[selectedLanguage] || [];
      const updatedList = langList.map((f) =>
        f.id === fileId ? { ...f, content } : f
      );
      return {
        ...prev,
        [selectedTaskId]: {
          ...currentTaskMap,
          [selectedLanguage]: updatedList,
        },
      };
    });
  };

  // Add new file
  const handleAddFile = (name: string) => {
    const newFile: SourceFile = {
      id: 'file-' + Date.now(),
      name,
      content: `# ${name}\n`,
      isMain: false,
    };

    setTaskFiles((prev) => {
      const currentTaskMap = prev[selectedTaskId] || {
        python: [],
        cpp: [],
        java: [],
      };
      const langList = currentTaskMap[selectedLanguage] || [];
      return {
        ...prev,
        [selectedTaskId]: {
          ...currentTaskMap,
          [selectedLanguage]: [...langList, newFile],
        },
      };
    });
    setActiveFileId(newFile.id);
  };

  // Delete file
  const handleDeleteFile = (fileId: string) => {
    setTaskFiles((prev) => {
      const currentTaskMap = prev[selectedTaskId] || {
        python: [],
        cpp: [],
        java: [],
      };
      const langList = currentTaskMap[selectedLanguage] || [];
      const updatedList = langList.filter((f) => f.id !== fileId);
      return {
        ...prev,
        [selectedTaskId]: {
          ...currentTaskMap,
          [selectedLanguage]: updatedList,
        },
      };
    });
    if (activeFileId === fileId && currentLanguageFiles.length > 1) {
      const remaining = currentLanguageFiles.filter((f) => f.id !== fileId);
      setActiveFileId(remaining[0].id);
    }
  };

  // Reset files to default
  const handleResetFiles = () => {
    if (confirm('Reset workspace files to the problem defaults?')) {
      setTaskFiles((prev) => {
        const defaultForLang = currentTask.defaultFiles[selectedLanguage] || [];
        const combined = [...defaultForLang];
        if (currentTask.dataFiles) {
          currentTask.dataFiles.forEach((df) => {
            if (!combined.some((f) => f.name === df.name)) {
              combined.push({ ...df });
            }
          });
        }
        return {
          ...prev,
          [selectedTaskId]: {
            ...prev[selectedTaskId],
            [selectedLanguage]: combined,
          },
        };
      });
    }
  };

  // Run custom input
  const handleRunCustom = async () => {
    setIsRunning(true);
    try {
      const res = await executeCustomRun(
        selectedLanguage,
        currentLanguageFiles,
        customInput,
        selectedTaskId
      );
      setCustomOutput(res);
    } catch (err: any) {
      setCustomOutput({
        stdout: '',
        stderr: err?.message || String(err),
        verdict: 'RE',
        durationMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit and grade all test cases
  const handleSubmit = async () => {
    setIsRunning(true);
    try {
      const submission = await executeSubmission({
        taskId: currentTask.id,
        taskTitle: currentTask.title,
        language: selectedLanguage,
        files: currentLanguageFiles,
        testCases: currentTask.testCases,
        timeLimitSec: currentTask.timeLimitSec,
        memoryLimitMb: currentTask.memoryLimitMb,
      });

      setLatestSubmission(submission);
      setSubmissions((prev) => [submission, ...prev]);
      setShowVerdictModal(true);
    } catch (err: any) {
      alert('Error running submission: ' + err?.message);
    } finally {
      setIsRunning(false);
    }
  };

  // Add custom test case to current problem
  const handleAddTestCase = (input: string, output: string) => {
    const newCase: TestCase = {
      id: 'tc-custom-' + Date.now(),
      name: `User Test #${currentTask.testCases.length + 1}`,
      input,
      expectedOutput: output,
    };
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskId
          ? { ...t, testCases: [...t.testCases, newCase] }
          : t
      )
    );
  };

  // Delete test case
  const handleDeleteTestCase = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskId
          ? { ...t, testCases: t.testCases.filter((tc) => tc.id !== id) }
          : t
      )
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onSelectTask={setSelectedTaskId}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        isRunning={isRunning}
        onRunCustom={handleRunCustom}
        onSubmit={handleSubmit}
        submissionCount={submissions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {currentTab === 'editor' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 overflow-hidden">
            {/* Left Column: Problem Statement & Test Cases (5 cols on lg) */}
            <div className="lg:col-span-5 h-full flex flex-col gap-2 overflow-hidden">
              {/* Problem Statement Card */}
              <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
                <TaskDetail task={currentTask} />
              </div>

              {/* Bottom Test Cases Panel */}
              <div className="h-64 sm:h-72 overflow-hidden">
                <TestCasesPanel
                  testCases={currentTask.testCases}
                  customInput={customInput}
                  setCustomInput={setCustomInput}
                  customOutput={customOutput}
                  onRunCustom={handleRunCustom}
                  isRunning={isRunning}
                  onAddTestCase={handleAddTestCase}
                  onDeleteTestCase={handleDeleteTestCase}
                />
              </div>
            </div>

            {/* Right Column: Multi-File Code Editor (7 cols on lg) */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <CodeEditor
                files={currentLanguageFiles}
                activeFileId={activeFileId}
                setActiveFileId={setActiveFileId}
                onCodeChange={handleCodeChange}
                onAddFile={handleAddFile}
                onDeleteFile={handleDeleteFile}
                onResetFiles={handleResetFiles}
                selectedLanguage={selectedLanguage}
              />
            </div>
          </div>
        )}

        {currentTab === 'sandbox' && <DockerSandboxView />}

        {currentTab === 'api' && <ApiTester currentFiles={currentLanguageFiles} />}

        {currentTab === 'history' && (
          <SubmissionsHistory
            submissions={submissions}
            onSelectSubmission={(sub) => {
              setLatestSubmission(sub);
              setShowVerdictModal(true);
            }}
            onClearHistory={() => setSubmissions([])}
          />
        )}
      </main>

      {/* Evaluation Results Verdict Modal */}
      {showVerdictModal && (
        <VerdictModal
          result={latestSubmission}
          onClose={() => setShowVerdictModal(false)}
        />
      )}
    </div>
  );
};

export default App;
