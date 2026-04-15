import { useState } from 'react';
import { QrCode, Download, Settings2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function QrCodeGenerator() {
  const [value, setValue] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState(true);

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto h-full">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <QrCode className="w-8 h-8 text-rose-500" />
          二维码生成器
        </h1>
        <p className="text-zinc-500 mt-2">将文本或链接转换为高清二维码，支持自定义颜色、尺寸和容错率。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Controls */}
        <div className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">内容</label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="输入网址或任意文本..."
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none text-zinc-900 dark:text-zinc-100 resize-none h-32"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">尺寸 ({size}px)</label>
              <input
                type="range"
                min="128"
                max="512"
                step="32"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">容错率</label>
              <select
                value={level}
                onChange={(e: any) => setLevel(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none text-zinc-900 dark:text-zinc-100"
              >
                <option value="L">低 (L) - 7%</option>
                <option value="M">中 (M) - 15%</option>
                <option value="Q">较高 (Q) - 25%</option>
                <option value="H">高 (H) - 30%</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">前景色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-none p-0"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none uppercase font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">背景色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-none p-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none uppercase font-mono"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="margin"
              checked={margin}
              onChange={(e) => setMargin(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-500"
            />
            <label htmlFor="margin" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
              包含安全边距 (Quiet Zone)
            </label>
          </div>
        </div>

        {/* Right: Preview & Download */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 mb-8 transition-all" style={{ backgroundColor: bgColor }}>
            <QRCodeSVG
              id="qr-code-svg"
              value={value || 'https://example.com'}
              size={200} // Display size is fixed, download size uses `size` state
              bgColor={bgColor}
              fgColor={fgColor}
              level={level}
              includeMargin={margin}
            />
          </div>
          
          <button
            onClick={downloadQR}
            disabled={!value}
            className="flex items-center gap-2 px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            下载 PNG 格式
          </button>
        </div>
      </div>
    </div>
  );
}