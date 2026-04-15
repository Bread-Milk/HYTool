import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Zap, Moon, Sun, Monitor, Github } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { icon: Home, label: '全部工具', path: '/' },
    { icon: Compass, label: '近期使用', path: '/recent' },
    { icon: Zap, label: '推荐', path: '/popular' },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 h-screen sticky top-0 flex flex-col hidden md:flex">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <Zap className="w-4 h-4 text-white dark:text-black" />
          </div>
          <span className="font-bold text-lg text-zinc-900 dark:text-white tracking-tight">Toolbox</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">发现</div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-8 mb-4 px-2">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">工具分类</div>
        </div>
        {[
          { label: '图片处理', path: '/cat/image' },
          { label: '文档转换', path: '/cat/document' },
          { label: '开发者工具', path: '/cat/developer' },
          { label: '文本工具', path: '/cat/text' },
          { label: 'AI 工具', path: '/cat/ai' },
        ].map(cat => {
          const isActive = location.pathname === cat.path;
          return (
            <Link
              key={cat.label}
              to={cat.path}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                isActive
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            {theme === 'light' ? '亮色模式' : theme === 'dark' ? '暗色模式' : '跟随系统'}
          </div>
        </button>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
          <Github className="w-4 h-4" />
          GitHub
        </a>
      </div>
    </aside>
  );
}