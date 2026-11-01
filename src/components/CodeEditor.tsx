import React, { useRef, useState } from 'react';
import {
  FileCode,
  FilePlus,
  Trash2,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  FileText,
  Lock,
} from 'lucide-react';
import { SourceFile, LanguageId } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface CodeEditorProps {
  files: SourceFile[];
  activeFileId: string;
  setActiveFileId: (id: string) => void;
  onCodeChange: (fileId: string, content: string) => void;
  onAddFile: (name: string) => void;
  onDeleteFile: (id: string) => void;
  onResetFiles: () => void;
  selectedLanguage: LanguageId;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFileId,
  setActiveFileId,
  onCodeChange,
  onAddFile,
  onDeleteFile,
  onResetFiles,
  selectedLanguage,
}) => {
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const langSpec = SUPPORTED_LANGUAGES[selectedLanguage];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onCodeChange(activeFile.id, newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const updateCursorPos = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const value = target.value.substring(0, target.selectionStart);
    const lines = value.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFileName.trim();
    if (!trimmed) return;
    if (files.some((f) => f.name.toLowerCase() === trimmed.toLowerCase())) {
      alert('A file with this name already exists.');
      return;
    }
    onAddFile(trimmed);
    setNewFileName('');
    setIsAddingFile(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onAddFile(file.name);
        // Delay slightly to update content
        setTimeout(() => {
          const added = files.find((f) => f.name === file.name);
          if (added) {
            onCodeChange(added.id, content);
          }
        }, 50);
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadAllFiles = () => {
    files.forEach((f) => {
      const blob = new Blob([f.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = f.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const lineCount = (activeFile?.content || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden shadow-inner">
      {/* File Tabs Header */}
      <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-2 py-1 select-none overflow-x-auto">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {files.map((file) => {
            const isActive = file.id === activeFile?.id;
            const isMainFile =
              file.isMain || file.name.toLowerCase() === langSpec.entryFile.toLowerCase();
            const isData = file.type === 'data';

            return (
              <div
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono cursor-pointer transition-all ${
                  isActive
                    ? 'bg-slate-950 text-blue-400 font-semibold border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {isData ? (
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>{file.name}</span>

                {isMainFile && (
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 py-0.2 rounded font-sans uppercase font-bold">
                    main
                  </span>
                )}

                {file.isReadOnly && (
                  <span title="Read only file">
                    <Lock className="w-2.5 h-2.5 text-slate-500" />
                  </span>
                )}

                {!isMainFile && !file.isReadOnly && files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-400 rounded transition-opacity"
                    title="Delete file"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add file inline trigger */}
          {isAddingFile ? (
            <form onSubmit={handleCreateFile} className="flex items-center gap-1 pl-1">
              <input
                type="text"
                autoFocus
                placeholder="filename.py"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={() => {
                  if (!newFileName.trim()) setIsAddingFile(false);
                }}
                className="bg-slate-950 border border-blue-500 rounded px-2 py-1 text-xs text-slate-200 font-mono w-28 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Add
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingFile(true)}
              className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 text-xs transition-colors ml-1"
              title="Add helper or data file"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span className="text-[11px]">New File</span>
            </button>
          )}
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded text-xs transition-colors"
            title="Upload file(s) into sandbox"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={downloadAllFiles}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded text-xs transition-colors"
            title="Download files"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetFiles}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded text-xs transition-colors"
            title="Reset to task defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-xs">
        {/* Line Numbers */}
        <div className="w-12 py-3 bg-slate-950/80 border-r border-slate-800/80 text-slate-600 select-none text-right pr-3 font-mono leading-5 overflow-hidden">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={activeFile?.content || ''}
          onChange={(e) => onCodeChange(activeFile.id, e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={updateCursorPos}
          onClick={updateCursorPos}
          readOnly={activeFile?.isReadOnly}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-200 resize-none focus:outline-none font-mono leading-5 selection:bg-blue-600/30 overflow-auto whitespace-pre tab-4"
          placeholder={`Enter code for ${activeFile?.name}...`}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>{activeFile?.name}</span>
          <span className="text-slate-600">•</span>
          <span>{lineCount} lines</span>
          <span className="text-slate-600">•</span>
          <span>{(activeFile?.content?.length || 0)} chars</span>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-blue-400 uppercase">{selectedLanguage}</span>
        </div>
      </div>
    </div>
  );
};
