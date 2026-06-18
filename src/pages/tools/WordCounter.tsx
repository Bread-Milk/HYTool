import { useState, useMemo } from 'react';
import { Type, RefreshCcw } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        words: 0,
        lines: 0,
        chineseChars: 0,
        englishWords: 0,
        readingTime: 0, // 分钟
      };
    }

    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split(/\r\n|\r|\n/).length;
    
    // 匹配中文字符
    const chineseMatches = text.match(/[\u4e00-\u9fa5]/g);
    const chineseChars = chineseMatches ? chineseMatches.length : 0;

    // 匹配英文单词
    const englishMatches = text.match(/[a-zA-Z]+/g);
    const englishWords = englishMatches ? englishMatches.length : 0;

    // 总词数（中文算一个词，英文单词算一个词）
    const words = chineseChars + englishWords;

    // 估算阅读时间 (假设 250字/分钟)
    const readingTime = Math.ceil(words / 250) || 1;

    return {
      charsWithSpaces,
      charsNoSpaces,
      words,
      lines,
      chineseChars,
      englishWords,
      readingTime,
    };
  }, [text]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full flex-1 flex flex-col pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-3">
            <Type className="w-8 h-8 text-[#0066cc] dark:text-[#2997ff]" />
            字数统计
          </h1>
          <p className="text-[#86868b] mt-2 text-sm">实时统计输入文本的字符数、单词数、行数及预估阅读时间。</p>
        </div>
        <button
          onClick={() => setText('')}
          className="flex items-center gap-2 px-4 py-2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] bg-white dark:bg-[#1d1d1f] border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          清空内容
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: '总字数', value: stats.words, color: 'text-[#0066cc] dark:text-[#2997ff]' },
          { label: '字符(含空格)', value: stats.charsWithSpaces },
          { label: '字符(不含空格)', value: stats.charsNoSpaces },
          { label: '中文字符', value: stats.chineseChars },
          { label: '英文单词', value: stats.englishWords },
          { label: '段落行数', value: stats.lines },
          { label: '阅读时间(分)', value: stats.readingTime },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1d1d1f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <span className="text-xs font-medium text-[#86868b] mb-2">{stat.label}</span>
            <span className={`text-2xl font-semibold font-mono ${stat.color || 'text-[#1d1d1f] dark:text-[#f5f5f7]'}`}>
              {stat.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-[500px] bg-white dark:bg-[#1d1d1f] border border-zinc-200 dark:border-zinc-800 rounded-[24px] overflow-hidden shadow-sm flex flex-col focus-within:ring-2 focus-within:ring-[#0066cc]/20 transition-shadow">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在此输入或粘贴需要统计的文本..."
          className="flex-1 w-full h-full p-8 bg-transparent border-none resize-none focus:ring-0 text-base leading-relaxed text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] outline-none"
          spellCheck="false"
        />
      </div>
    </div>
  );
}