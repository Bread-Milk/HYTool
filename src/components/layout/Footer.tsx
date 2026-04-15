export default function Footer() {
  const links = [
    { name: '隐私政策', href: '#' },
    { name: '服务条款', href: '#' },
    { name: '关于我们', href: '#' },
    { name: '联系支持', href: '#' },
  ];

  return (
    <footer className="bg-[#050505] text-white/40 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-black font-black text-xs">X</span>
          </div>
          <span className="font-bold tracking-widest text-white/60">PROJECT X</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs hover:text-white transition-colors uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="text-xs text-center md:text-right font-light">
          &copy; {new Date().getFullYear()} PROJECT X Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
