import { useState, useMemo, useEffect } from 'react';
import { tools, ToolInfo } from '@/data/tools';
import { motion } from 'framer-motion';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const location = useLocation();
  const addRecentTool = useAppStore(state => state.addRecentTool);
  const recentToolIds = useAppStore(state => state.recentTools);
  
  const isRecentPage = location.pathname === '/recent';
  const isPopularPage = location.pathname === '/popular';

  const categories = useMemo(() => {
    const cats = new Set(tools.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Sync state with URL parameter when it changes
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    } else {
      setActiveCategory('all');
    }
  }, [urlCategory]);

  const filteredTools = useMemo(() => {
    if (isRecentPage) {
      // Map IDs back to tools, preserving the order of recentToolIds
      return recentToolIds
        .map(id => tools.find(t => t.id === id))
        .filter((t): t is ToolInfo => t !== undefined);
    }
    if (isPopularPage) {
      return tools.filter(t => t.isPopular);
    }
    if (activeCategory === 'all') return tools;
    return tools.filter(t => t.category === activeCategory);
  }, [activeCategory, isRecentPage, isPopularPage, recentToolIds]);

  const pageTitle = useMemo(() => {
    if (isRecentPage) return '近期使用';
    if (isPopularPage) return '推荐工具';
    if (urlCategory && activeCategory !== 'all') {
      const tool = tools.find(t => t.category === activeCategory);
      return tool ? tool.category.toUpperCase() : '未知分类';
    }
    return '个人工具箱';
  }, [isRecentPage, isPopularPage, urlCategory, activeCategory]);

  const pageDesc = useMemo(() => {
    if (isRecentPage) return '您最近访问和使用过的工具记录将保存在您的浏览器本地。';
    if (isPopularPage) return '为您精选的高频、热门的效率工具。';
    if (urlCategory) return `浏览所有 ${pageTitle} 相关的工具。`;
    return '纯净、极简、完全本地化。聚合了开发者与创作者日常高频使用的效率工具，所有数据均在您的浏览器中处理，不上传任何文件。';
  }, [isRecentPage, isPopularPage, urlCategory, pageTitle]);

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <section className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white capitalize">
          {pageTitle}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          {pageDesc}
        </p>
      </section>

      {/* Filters (Only show on default home page) */}
      {!urlCategory && !isRecentPage && !isPopularPage && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md scale-105'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {cat === 'all' ? '全部' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={tool.path}
                onClick={() => addRecentTool(tool.id)}
                className="group block h-full p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex flex-col h-full space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {tool.category}
                    </span>
                    {tool.isPopular && (
                      <span className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        HOT
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            {isRecentPage ? (
              <p>暂无近期使用记录</p>
            ) : (
              <p>未找到匹配的工具</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}