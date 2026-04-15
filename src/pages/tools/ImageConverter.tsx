import { useState, useCallback, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Download, Settings2, RefreshCw } from 'lucide-react';

export default function ImageConverter() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('image/webp');
  const [quality, setQuality] = useState<number>(0.8);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

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
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件！');
      return;
    }
    setSelectedFile(file);
    setConvertedUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const convertImage = () => {
    if (!previewUrl || !selectedFile) return;
    setIsConverting(true);

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL(targetFormat, quality);
      setConvertedUrl(dataUrl);
      setIsConverting(false);
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-blue-500" />
          图片格式转换
        </h1>
        <p className="text-zinc-500 mt-2">在浏览器本地安全、快速地转换图片格式（支持 JPG, PNG, WEBP 等）。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upload & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[400px] cursor-pointer ${
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
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full shadow-sm flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                点击或拖拽图片到这里
              </p>
              <p className="text-sm text-zinc-500 mt-2">支持 PNG, JPG, WEBP, GIF 等格式</p>
            </div>
          ) : (
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-4 border border-zinc-200 dark:border-zinc-700 relative overflow-hidden flex items-center justify-center min-h-[400px]">
              <img
                src={previewUrl!}
                alt="Preview"
                className="max-w-full max-h-[500px] object-contain rounded-xl"
              />
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setConvertedUrl(null);
                }}
                className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur text-sm px-3 py-1.5 rounded-full font-medium shadow-sm hover:bg-white dark:hover:bg-black transition-colors"
              >
                重新选择
              </button>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-fit shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-100 font-semibold">
            <Settings2 className="w-5 h-5" />
            转换设置
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">目标格式</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-zinc-100"
              >
                <option value="image/webp">WEBP (推荐，体积小)</option>
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>

            {targetFormat !== 'image/png' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">压缩质量</label>
                  <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            )}

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                disabled={!selectedFile || isConverting}
                onClick={convertImage}
                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    开始转换
                  </>
                )}
              </button>
            </div>

            {convertedUrl && (
              <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                <a
                  href={convertedUrl}
                  download={`converted.${targetFormat.split('/')[1]}`}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <Download className="w-5 h-5" />
                  下载图片
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}