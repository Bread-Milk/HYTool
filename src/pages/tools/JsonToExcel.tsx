import { useState, useRef, useCallback } from 'react';
import { FileJson, Table, Download, UploadCloud, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function JsonToExcel() {
  const [jsonInput, setJsonInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  
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
    if (!file.name.endsWith('.json')) {
      setError('请上传 .json 文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setJsonInput(text);
        processJson(text);
      }
    };
    reader.readAsText(file);
  };

  const processJson = (text: string = jsonInput) => {
    if (!text.trim()) {
      setPreviewData(null);
      setError(null);
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      let parsed = JSON.parse(text);
      
      // Ensure it's an array of objects for Excel
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }
      
      setPreviewData(parsed);
    } catch (err: any) {
      setError(err.message || '无效的 JSON 格式');
      setPreviewData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadExcel = () => {
    if (!previewData || previewData.length === 0) return;
    
    try {
      const worksheet = XLSX.utils.json_to_sheet(previewData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "converted_data.xlsx");
    } catch (err: any) {
      setError('生成 Excel 失败: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto flex flex-col pb-10">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <FileJson className="w-8 h-8 text-emerald-500" />
          JSON 转 Excel
        </h1>
        <p className="text-zinc-500 mt-2">将 JSON 数据（对象数组）快速转换为 Excel 表格文件，纯本地处理。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left: Input */}
        <div className="flex flex-col gap-4 h-full">
          <div
            className={`shrink-0 border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
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
              accept=".json"
              className="hidden"
              onChange={handleChange}
            />
            <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              拖拽 JSON 文件到这里，或点击上传
            </p>
          </div>

          <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">或直接粘贴 JSON</span>
              <button
                onClick={() => processJson()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                解析
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="[\n  {\n    &#34;name&#34;: &#34;John&#34;,\n    &#34;age&#34;: 30\n  }\n]"
              className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Right: Preview & Action */}
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm relative">
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex justify-between items-center">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-500" />
              数据预览
            </span>
            <button
              onClick={downloadExcel}
              disabled={!previewData || previewData.length === 0}
              className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              导出 Excel
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
            ) : previewData && previewData.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                  <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 uppercase text-xs font-semibold">
                    <tr>
                      {Object.keys(previewData[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        {Object.values(row).map((val: any, colIndex) => (
                          <td key={colIndex} className="px-4 py-3">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 10 && (
                  <div className="p-3 text-center text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                    仅显示前 10 条数据预览，导出后包含全部 {previewData.length} 条数据
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                暂无数据预览
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}