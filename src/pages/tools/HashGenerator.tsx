import { useState } from 'react';
import { Hash, Copy, Check, Shield } from 'lucide-react';
// import crypto-js dynamically if needed, but for browser we can use Web Crypto API

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({
    SHA1: '',
    SHA256: '',
    SHA384: '',
    SHA512: '',
  });
  const [copied, setCopied] = useState<string | null>(null);

  const generateHashes = async (text: string) => {
    setInput(text);
    if (!text) {
      setResults({ SHA1: '', SHA256: '', SHA384: '', SHA512: '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const newResults: Record<string, string> = {};

    for (const algo of algorithms) {
      try {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        newResults[algo.replace('-', '')] = hashHex;
      } catch (e) {
        console.error(e);
      }
    }
    setResults(newResults);
  };

  const handleCopy = async (hash: string, algo: string) => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(algo);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <Hash className="w-8 h-8 text-teal-500" />
          Hash 生成器
        </h1>
        <p className="text-zinc-500 mt-2">使用浏览器原生 Web Crypto API 实时计算文本的各种哈希值，确保数据安全不外泄。</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[200px]">
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            原始文本
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
            <Shield className="w-3 h-3" />
            本地计算
          </span>
        </div>
        <textarea
          value={input}
          onChange={(e) => generateHashes(e.target.value)}
          placeholder="在此输入文本以生成哈希值..."
          className="flex-1 w-full p-6 bg-transparent border-none resize-none focus:ring-0 text-base leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none"
          spellCheck="false"
        />
      </div>

      <div className="flex-1 space-y-4 min-h-0 overflow-y-auto pr-2 pb-4">
        {Object.entries(results).map(([algo, hash]) => (
          <div key={algo} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-4 md:gap-6 group hover:border-teal-500/30 transition-colors">
            <div className="w-24 shrink-0">
              <span className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg font-mono">
                {algo}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm text-zinc-600 dark:text-zinc-400 break-all bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                {hash || '等待输入...'}
              </div>
            </div>

            <button
              onClick={() => handleCopy(hash, algo)}
              disabled={!hash}
              className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                copied === algo
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="复制"
            >
              {copied === algo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}