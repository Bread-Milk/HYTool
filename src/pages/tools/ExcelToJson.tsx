import { useState, useRef, useCallback } from 'react';
import { Table, FileJson, Download, UploadCloud, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExcelToJson() {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setError('请上传 .xlsx, .xls 或 .csv 文件');
      return;
    }
    
    setFileName(file.name);
    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        setPreviewData(JSON.stringify(json, null, 2));
      } catch (err: any) {
        setError('解析文件失败: ' + err.message);
        setPreviewData(null);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError('读取文件失败');
      setIsProcessing(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const downloadJson = () => {
    if (!previewData) return;
    
    const blob = new Blob([previewData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName ? fileName.replace(/\.[^/.]+$/, "") + '.json' : 'converted.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <Table className="w-8 h-8 text-blue-500" />
          Excel 转 JSON
        </h1>
        <p className="text-zinc-500 mt-2">将 Excel 或 CSV 文件快速转换为 JSON 格式，支持批量导出。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left: Input */}
        <div className="flex flex-col h-full">
          <div
            className={`flex-1 border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[400px] cursor-pointer ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={handleChange}
            />
            <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full shadow-sm flex items-center justify-center mb-6">
              <UploadCloud className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              拖拽 Excel 文件到这里
            </h3>
            <p className="text-zinc-500 max-w-sm">
              或者点击此处浏览文件。支持 .xlsx, .xls, .csv 格式。纯前端解析，保障数据隐私。
            </p>
            {fileName && (
              <div className="mt-8 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-500/20 flex items-center gap-2">
                <Table className="w-4 h-4" />
                已选择: {fileName}
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview & Action */}
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm relative">
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex justify-between items-center">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-500" />
              JSON 预览
            </span>
            <button
              onClick={downloadJson}
              disabled={!previewData}
              className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              导出 JSON
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {error ? (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-mono border border-red-200 dark:border-red-500/20">
                {error}
              </div>
            ) : isProcessing ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" /> 解析中...
              </div>
            ) : previewData ? (
              <pre className="text-sm font-mono leading-relaxed text-emerald-600 dark:text-emerald-400 m-0 break-all whitespace-pre-wrap">
                {previewData}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                请先上传表格文件
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}