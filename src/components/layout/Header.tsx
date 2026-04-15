import { Search, Menu, Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        <div className={`relative max-w-md w-full transition-all duration-300 ${searchFocused ? 'ring-2 ring-blue-500/20 rounded-xl' : ''}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="搜索工具 (Cmd+K)"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-10 pl-10 pr-4 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 hidden sm:flex">
            <kbd className="font-sans px-1.5 py-0.5 text-[10px] rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 shadow-sm">⌘</kbd>
            <kbd className="font-sans px-1.5 py-0.5 text-[10px] rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          {theme === 'light' ? <Sun className="w-5 h-5" /> : theme === 'dark' ? <Moon className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
          <div className="w-full h-full rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}