import { useState, useEffect } from 'react';
import { Clock, ArrowRight, Copy, Check, RefreshCw } from 'lucide-react';

export default function TimestampConverter() {
  const [currentUnix, setCurrentUnix] = useState(Math.floor(Date.now() / 1000));
  const [isPlaying, setIsPlaying] = useState(true);

  // Time to Timestamp state
  const [inputDate, setInputDate] = useState(() => {
    const now = new Date();
    // Format to YYYY-MM-DDTHH:mm:ss for datetime-local input
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - (offset * 60 * 1000));
    return local.toISOString().slice(0, 19);
  });
  const [outputTimestamp, setOutputTimestamp] = useState<number | null>(null);

  // Timestamp to Time state
  const [inputTimestamp, setInputTimestamp] = useState<string>('');
  const [outputDate, setOutputDate] = useState<string>('');
  const [unit, setUnit] = useState<'s' | 'ms'>('s');

  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Clock effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentUnix(Math.floor(Date.now() / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Convert Date to Timestamp
  useEffect(() => {
    if (!inputDate) {
      setOutputTimestamp(null);
      return;
    }
    const date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
      setOutputTimestamp(Math.floor(date.getTime() / 1000));
    } else {
      setOutputTimestamp(null);
    }
  }, [inputDate]);

  // Convert Timestamp to Date
  useEffect(() => {
    if (!inputTimestamp) {
      setOutputDate('');
      return;
    }
    
    const num = Number(inputTimestamp);
    if (isNaN(num)) {
      setOutputDate('无效的时间戳');
      return;
    }

    const timestampMs = unit === 's' ? num * 1000 : num;
    const date = new Date(timestampMs);
    
    if (isNaN(date.getTime())) {
      setOutputDate('无效的时间戳');
    } else {
      // Format: YYYY-MM-DD HH:mm:ss
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      setOutputDate(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    }
  }, [inputTimestamp, unit]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const useCurrentTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - (offset * 60 * 1000));
    setInputDate(local.toISOString().slice(0, 19));
    setInputTimestamp(Math.floor(now.getTime() / 1000).toString());
    setUnit('s');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <Clock className="w-8 h-8 text-orange-500" />
          时间戳转换
        </h1>
        <p className="text-zinc-500 mt-2">在 Unix 时间戳与自然时间格式之间进行精准的双向转换。</p>
      </div>

      {/* Current Time Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-orange-100 font-medium mb-1 text-sm uppercase tracking-widest">
              当前 Unix 时间戳 (秒)
            </div>
            <div className="text-4xl md:text-5xl font-black font-mono tracking-tight">
              {currentUnix}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
              title={isPlaying ? "暂停刷新" : "继续刷新"}
            >
              <RefreshCw className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </button>
            <button
              onClick={() => handleCopy('current', currentUnix.toString())}
              className="flex items-center gap-2 px-5 py-3 bg-white text-orange-600 rounded-xl font-bold hover:scale-105 transition-transform shadow-sm"
            >
              {copiedStates['current'] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedStates['current'] ? '已复制' : '复制时间戳'}
            </button>
            <button
              onClick={useCurrentTime}
              className="flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white border border-orange-400/30 rounded-xl font-bold transition-colors"
            >
              应用到下方
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date -> Timestamp */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">自然时间 转换为 时间戳</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">选择时间 (本地时区)</label>
              <input
                type="datetime-local"
                step="1"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-orange-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex justify-center text-zinc-300 dark:text-zinc-700">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">转换结果 (Unix 时间戳)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={outputTimestamp || ''}
                  placeholder="等待输入..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-24 py-3 text-lg font-mono focus:outline-none text-orange-600 dark:text-orange-500"
                />
                <button
                  onClick={() => outputTimestamp && handleCopy('out-ts', outputTimestamp.toString())}
                  disabled={!outputTimestamp}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  {copiedStates['out-ts'] ? '已复制' : '复制'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamp -> Date */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">时间戳 转换为 自然时间</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">输入时间戳</label>
                <select
                  value={unit}
                  onChange={(e: any) => setUnit(e.target.value)}
                  className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-orange-500 outline-none text-zinc-600 dark:text-zinc-400"
                >
                  <option value="s">秒 (s)</option>
                  <option value="ms">毫秒 (ms)</option>
                </select>
              </div>
              <input
                type="number"
                value={inputTimestamp}
                onChange={(e) => setInputTimestamp(e.target.value)}
                placeholder="例如：1712345678"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-lg font-mono focus:ring-2 focus:ring-orange-500 outline-none text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="flex justify-center text-zinc-300 dark:text-zinc-700">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">转换结果 (YYYY-MM-DD HH:mm:ss)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={outputDate}
                  placeholder="等待输入..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-24 py-3 text-base font-mono focus:outline-none text-orange-600 dark:text-orange-500"
                />
                <button
                  onClick={() => outputDate && handleCopy('out-date', outputDate)}
                  disabled={!outputDate || outputDate === '无效的时间戳'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  {copiedStates['out-date'] ? '已复制' : '复制'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}