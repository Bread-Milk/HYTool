import { useState } from 'react';
import { Code, ArrowRightLeft, Copy, Check, Trash2 } from 'lucide-react';

export default function Base64Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || '无效的输入格式');
      setOutput('');
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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <Code className="w-8 h-8 text-violet-500" />
          Base64 编解码
        </h1>
        <p className="text-zinc-500 mt-2">快速将文本转换为 Base64 编码，或反向解码。纯本地计算，保护数据安全。</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 items-stretch mt-8 min-h-[500px]">
        {/* Left Input */}
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {mode === 'encode' ? '原始文本' : 'Base64 字符串'}
            </span>
            <button
              onClick={() => { setInput(''); setOutput(''); setError(null); }}
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的 Base64 字符串...'}
            className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none"
            spellCheck="false"
          />
        </div>

        {/* Center Controls */}
        <div className="flex flex-row md:flex-col justify-center items-center gap-4 py-4 md:py-0">
          <button
            onClick={() => {
              setMode(m => m === 'encode' ? 'decode' : 'encode');
              setInput(output);
              setOutput('');
            }}
            className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-full transition-all shadow-sm"
            title="互换方向"
          >
            <ArrowRightLeft className="w-5 h-5 md:rotate-90" />
          </button>
          
          <button
            onClick={handleConvert}
            className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:scale-105 transition-transform shadow-md"
          >
            {mode === 'encode' ? '编码' : '解码'}
          </button>
        </div>

        {/* Right Output */}
        <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm relative">
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex justify-between items-center">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {mode === 'encode' ? 'Base64 结果' : '解码结果'}
            </span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded transition-colors ${
                copied 
                  ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/20' 
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-200 dark:bg-zinc-800'
              }`}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {error ? (
              <div className="text-red-500 text-sm font-mono">{error}</div>
            ) : (
              <pre className="text-sm font-mono leading-relaxed text-violet-600 dark:text-violet-400 whitespace-pre-wrap break-all m-0">
                {output || '结果将显示在这里...'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}