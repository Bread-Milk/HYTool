import { Zap } from 'lucide-react';

export default function Footer() {
  const links = [
    { name: '隐私政策', href: '#' },
    { name: '使用条款', href: '#' },
    { name: '销售政策', href: '#' },
    { name: '法律信息', href: '#' },
    { name: '网站地图', href: '#' },
  ];

  return (
    <footer className="bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] py-8 border-t border-zinc-300 dark:border-zinc-800 w-full mt-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-zinc-300 dark:border-zinc-700 pb-6 mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-zinc-500" />
            <span className="font-semibold text-sm">HYToolBox</span>
          </div>
          <div className="text-xs text-zinc-500">
            专为创作者和开发者设计的效率工具集合。
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} HYToolBox Inc. 保留所有权利。
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {links.map((link, i) => (
              <div key={link.name} className="flex items-center gap-4">
                <a
                  href={link.href}
                  className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
                >
                  {link.name}
                </a>
                {i < links.length - 1 && <span className="w-[1px] h-3 bg-zinc-300 dark:bg-zinc-700"></span>}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
