import { Search, Menu, Moon, Sun, Monitor, Zap } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { label: '全部工具', path: '/' },
    { label: '近期使用', path: '/recent' },
    { label: '推荐工具', path: '/popular' },
    { label: '图片处理', path: '/cat/image' },
    { label: '文本工具', path: '/cat/text' },
    { label: '开发者工具', path: '/cat/developer' },
  ];

  return (
    <header className="h-12 flex-shrink-0 bg-white/70 dark:bg-[#000000]/70 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center justify-between transition-colors border-b border-zinc-200 dark:border-zinc-800/50">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity">
          <Zap className="w-4 h-4" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-10 px-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`text-[12px] font-medium tracking-wide transition-colors ${
                location.pathname === item.path
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className={`relative transition-all duration-300 ${searchFocused ? 'w-48' : 'w-8'} overflow-hidden flex items-center justify-end`}>
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 cursor-pointer ${searchFocused ? 'hidden' : 'block'}`} onClick={() => setSearchFocused(true)} />
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 ${searchFocused ? 'block' : 'hidden'}`} />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`h-7 pl-8 pr-3 bg-zinc-100 dark:bg-zinc-800 border-none rounded-full text-xs focus:outline-none text-zinc-900 dark:text-zinc-100 transition-all ${
                searchFocused ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
            />
          </div>

          <button 
            onClick={toggleTheme}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
          >
            {theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>

          <button 
            className="md:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-12 left-0 right-0 bg-white dark:bg-[#000000] border-b border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
