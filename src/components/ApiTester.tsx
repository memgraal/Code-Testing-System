import React, { useState } from 'react';
import { Server, Send, Copy, Check, FileCode2, Terminal, Code, ArrowRight } from 'lucide-react';
import { SourceFile } from '../types';

interface ApiTesterProps {
  currentFiles: SourceFile[];
}

export const ApiTester: React.FC<ApiTesterProps> = ({ currentFiles }) => {
  const [activeEndpoint, setActiveEndpoint] = useState<'files' | 'text'>('files');
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // For /test/text
  const [textFilename, setTextFilename] = useState('main.py');
  const [textContent, setTextContent] = useState(`import sys

def main():
    print("Testing via /testing/test/text")

if __name__ == '__main__':
    main()
`);

  const curlCommand =
    activeEndpoint === 'files'
      ? `curl -X POST "http://localhost:3000/testing/test/files" \\
  -H "accept: application/json" \\
  -H "Content-Type: multipart/form-data" \\
${currentFiles.map((f) => `  -F "uploaded_files=@${f.name}"`).join(' \\\n')}`
      : `curl -X POST "http://localhost:3000/testing/test/text" \\
  -H "Content-Type: application/json" \\
  -d '{"filename": "${textFilename}", "content": ${JSON.stringify(textContent)}}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - startTime);
      if (activeEndpoint === 'files') {
        const hasMain = currentFiles.some(
          (f) =>
            f.name === 'main.py' ||
            f.name === 'main.cpp' ||
            f.name === 'Main.java' ||
            f.isMain
        );

        if (!hasMain) {
          setResponse({
            status: 400,
            statusText: 'Bad Request',
            durationMs: elapsed,
            headers: { 'content-type': 'application/json' },
            body: {
              error: 'MissingEntryFile',
              detail:
                'Uploaded files must contain a main file (main.py, main.cpp, or Main.java)',
              received_files: currentFiles.map((f) => f.name),
            },
          });
        } else {
          setResponse({
            status: 200,
            statusText: 'OK',
            durationMs: elapsed,
            headers: { 'content-type': 'application/json' },
            body: {
              status: 'success',
              message: 'DockerContainer executed tests successfully',
              temp_folder: '/tmp/testing_sandbox_9f3a',
              files_received: currentFiles.map((f) => ({
                filename: f.name,
                bytes: f.content.length,
              })),
              container: {
                image: 'judge-python',
                mem_limit: '256m',
                pids_limit: 64,
                status_code: 0,
              },
            },
          });
        }
      } else {
        setResponse({
          status: 200,
          statusText: 'OK',
          durationMs: elapsed,
          headers: { 'content-type': 'application/json' },
          body: {
            status: 'success',
            filename: textFilename,
            content_length: textContent.length,
            temp_folder: '/tmp/testing_sandbox_text_41e0',
            message: 'TempFolder created, file written and force_deleted.',
          },
        });
      }
      setIsLoading(false);
    }, 450);
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-slate-300">
      <div>
        <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px] mb-1">
          <Server className="w-4 h-4" />
          <span>FASTAPI ROUTERS PLAYGROUND</span>
        </div>
        <h2 className="text-lg font-bold text-slate-100">
          FastAPI Router Simulation (<code className="text-blue-300">src/api/routers.py</code>)
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Interactive simulation of the FastAPI endpoints and TempFolderMiddleware defined in the original project.
        </p>
      </div>

      {/* Endpoint Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveEndpoint('files');
            setResponse(null);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
            activeEndpoint === 'files'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span className="bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded text-[10px] font-bold">
            POST
          </span>
          <span>/testing/test/files</span>
        </button>

        <button
          onClick={() => {
            setActiveEndpoint('text');
            setResponse(null);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
            activeEndpoint === 'text'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span className="bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded text-[10px] font-bold">
            POST
          </span>
          <span>/testing/test/text</span>
        </button>
      </div>

      {/* Request & Response Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Request Side */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-xs uppercase font-mono">
              Request Payload
            </span>
            <button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>

          {activeEndpoint === 'files' ? (
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400">
                Current workspace files will be packaged into <code className="text-slate-200">uploaded_files: List[UploadFile]</code>:
              </span>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                {currentFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                      {f.name}
                    </span>
                    <span className="text-slate-500">{f.content.length} bytes</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Query/Param filename:</label>
                <input
                  type="text"
                  value={textFilename}
                  onChange={(e) => setTextFilename(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Body param content:</label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* cURL Display */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span>Equivalent cURL:</span>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre">
              {curlCommand}
            </pre>
          </div>
        </div>

        {/* Response Side */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-xs uppercase font-mono">
              Response Preview
            </span>
            {response && (
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    response.status === 200
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {response.status} {response.statusText}
                </span>
                <span className="text-slate-400">{response.durationMs}ms</span>
              </div>
            )}
          </div>

          <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-3 overflow-auto min-h-[240px]">
            {response ? (
              <pre className="font-mono text-[11px] text-emerald-300 whitespace-pre">
                {JSON.stringify(response.body, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-1">
                <Server className="w-6 h-6 text-slate-700" />
                <span className="italic">Click "Send Request" to test endpoint</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
