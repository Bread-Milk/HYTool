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

  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    } else {
      setActiveCategory('all');
    }
  }, [urlCategory]);

  const filteredTools = useMemo(() => {
    if (isRecentPage) {
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
    if (isRecentPage) return '近期使用。';
    if (isPopularPage) return '热门推荐。';
    if (urlCategory && activeCategory !== 'all') {
      const tool = tools.find(t => t.category === activeCategory);
      return tool ? `${tool.category.toUpperCase()}。` : '未知分类。';
    }
    return '尽情创造。';
  }, [isRecentPage, isPopularPage, urlCategory, activeCategory]);

  const pageDesc = useMemo(() => {
    if (isRecentPage) return '您的最近访问记录，安全保存在本地。';
    if (isPopularPage) return '大家都在用的高频效率工具。';
    if (urlCategory) return `探索所有 ${pageTitle.replace('。', '')} 相关的强大工具。`;
    return '纯净、极简、完全本地化。汇聚您日常所需的各种专业工具。';
  }, [isRecentPage, isPopularPage, urlCategory, pageTitle]);

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-700 flex-1 h-full">
      {/* Hero Section */}
      <section className="w-full pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-6"
        >
          {pageTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl font-normal text-[#86868b] tracking-wide"
        >
          {pageDesc}
        </motion.p>
      </section>

      {/* Filters (Only show on default home page) */}
      {!urlCategory && !isRecentPage && !isPopularPage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 px-6 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#1d1d1f] text-white dark:bg-[#f5f5f7] dark:text-black shadow-md'
                  : 'bg-white/50 text-[#1d1d1f] dark:bg-[#1d1d1f]/50 dark:text-[#f5f5f7] hover:bg-white dark:hover:bg-[#1d1d1f] backdrop-blur-md'
              }`}
            >
              {cat === 'all' ? '全部工具' : cat.toUpperCase()}
            </button>
          ))}
        </motion.div>
      )}

      {/* Grid */}
      <div className="w-full max-w-[1200px] px-6 pb-20">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={tool.path}
                  onClick={() => addRecentTool(tool.id)}
                  className="group block h-full p-8 bg-white dark:bg-[#1d1d1f] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-none hover:-translate-y-1 transition-all duration-400 overflow-hidden relative"
                >
                  <div className="flex flex-col h-full space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] dark:bg-[#2d2d2f] flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:scale-110 group-hover:bg-[#0066cc] group-hover:text-white transition-all duration-500">
                      <tool.icon className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-[#86868b] text-sm leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-[#86868b] bg-[#f5f5f7] dark:bg-[#2d2d2f] px-3 py-1 rounded-full">
                        {tool.category}
                      </span>
                      {tool.isPopular && (
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#bf4800] dark:text-[#ff6b00]">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-[#86868b]">
              <p className="text-xl font-medium">
                {isRecentPage ? '暂无近期使用记录。' : '未找到匹配的工具。'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}