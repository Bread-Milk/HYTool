import { useState } from 'react';
import { FileJson, Copy, Check, Trash2, Code2 } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<number>(2);

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (err: any) {
      setError(err.message || '无效的 JSON 格式');
      setOutput('');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || '无效的 JSON 格式');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto flex flex-col pb-10">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <FileJson className="w-8 h-8 text-emerald-500" />
          JSON 格式化
        </h1>
        <p className="text-zinc-500 mt-2">在本地安全地格式化、验证、压缩 JSON 字符串，支持语法高亮。</p>
      </div>

      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">缩进:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
            >
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
            </select>
          </div>
          <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-700" />
          <button
            onClick={formatJson}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <Code2 className="w-4 h-4" />
            格式化
          </button>
          <button
            onClick={minifyJson}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            压缩
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setInput(''); setOutput(''); setError(null); }}
            className="flex items-center gap-2 px-4 py-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制结果'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-mono border border-red-200 dark:border-red-500/20">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
            <span className="text-xs font-mono font-semibold text-zinc-500">INPUT</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="粘贴 JSON 字符串到这里..."
            className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none"
            spellCheck="false"
          />
        </div>

        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex justify-between items-center">
            <span className="text-xs font-mono font-semibold text-zinc-500">OUTPUT</span>
          </div>
          <pre className="flex-1 w-full p-4 overflow-auto text-sm font-mono leading-relaxed text-emerald-600 dark:text-emerald-400 m-0">
            {output || '格式化后的结果将显示在这里...'}
          </pre>
        </div>
      </div>
    </div>
  );
}