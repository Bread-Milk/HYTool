import { FileText, ArrowRight, Construction } from 'lucide-react';

export default function DocumentConverter() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-500" />
          文档格式转换
        </h1>
        <p className="text-zinc-500 mt-2">在您的浏览器中直接完成 PDF, Word, Excel 等文档格式的相互转换。</p>
      </div>

      <div className="flex-1 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 relative">
          <Construction className="w-12 h-12 text-indigo-500" />
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-950 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            WIP
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          该工具模块正在全力开发中
        </h2>
        <p className="text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
          文档转换涉及到复杂的本地 WebAssembly 引擎集成（如 PDF.js 或 LibreOffice 端口），
          为了保证您的隐私安全和转换质量，我们正在打磨完全本地化的解决方案。
        </p>

        <div className="flex items-center gap-4 text-sm text-zinc-400 font-mono bg-white dark:bg-zinc-800 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <span>PDF</span>
          <ArrowRight className="w-4 h-4" />
          <span>DOCX</span>
          <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-2" />
          <span>EXCEL</span>
          <ArrowRight className="w-4 h-4" />
          <span>CSV</span>
        </div>
      </div>
    </div>
  );
}