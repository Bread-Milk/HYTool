import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '@/hooks/useTheme';

export default function Layout() {
  useTheme(); // Initialize theme logic

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] font-sans antialiased selection:bg-[#0066cc] selection:text-white">
      <Header />
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}