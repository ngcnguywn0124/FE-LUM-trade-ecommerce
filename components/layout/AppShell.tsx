'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();

  const hideGlobalChrome = useMemo(() => {
    if (!pathname) {
      return false;
    }

    const authPaths = ['/dang-ky', '/dang-nhap', '/quen-mat-khau', '/reset-password'];
    const specialPages = ['/unauthorized', '/not-found'];
    return pathname.startsWith('/admin') || authPaths.includes(pathname) || specialPages.includes(pathname);
  }, [pathname]);

  if (hideGlobalChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {/* Banner phụ: Kêu gọi tải App hoặc tham gia cộng đồng */}
      <section className="bg-brand-mint py-16 text-center relative overflow-hidden">
        {/* Hiệu ứng nền trang trí */}
        <div className="absolute top-0 left-10 w-32 h-32 bg-white opacity-40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-48 h-48 bg-emerald-300 opacity-30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-brand-dark mb-2">
            Bạn có đồ <span className="text-emerald-600">không dùng?</span>
          </h2>
          <p className="mb-8 text-brand-dark/80 text-lg">Đăng bán ngay để dọn phòng đón đồ mới!</p>
          <button className="bg-white text-emerald-700 font-heading font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            Đăng tin ngay
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AppShell;
