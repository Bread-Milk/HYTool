import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '首页', href: '#home' },
    { name: '特色', href: '#features' },
    { name: '角色', href: '#characters' },
    { name: '预告', href: '#cinematic' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            <span className="text-black font-black text-xl tracking-tighter">X</span>
          </div>
          <span className="text-white font-bold tracking-widest">PROJECT X</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-white/70 hover:text-white transition-colors group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all group-hover:w-full" />
            </a>
          ))}
          <div className="w-[1px] h-4 bg-white/20" />
          <button className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/50 to-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform">
              立即预约
            </div>
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-0 left-0 right-0 bg-black/95 backdrop-blur-3xl h-screen flex flex-col items-center pt-32 gap-8 border-b border-white/10"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-3xl font-black text-white/80 hover:text-white tracking-widest"
            >
              {link.name}
            </a>
          ))}
          <div className="w-12 h-[1px] bg-white/20 my-4" />
          <button className="bg-white text-black px-10 py-4 rounded-full text-xl font-bold">
            立即预约
          </button>
        </motion.div>
      )}
    </motion.header>
  );
}