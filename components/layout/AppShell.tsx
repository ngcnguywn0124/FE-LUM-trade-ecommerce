'use client';

import { ReactNode, useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '@/components/common/BackToTop';

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  //---------- tự động cập nhật tiêu đề trang ----------

  // Tự động cập nhật tiêu đề trang dựa trên URL
  useEffect(() => {
    if (!pathname) return;

    if (pathname === '/') {
      document.title = 'Lụm - Website Mua bán đồ cũ dành cho sinh viên';
      return;
    }

    // Chuyển đổi /test-error thành "Test Error | Lụm"
    const pageName = pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    if (pageName) {
      document.title = `${pageName} | Lụm`;
    }
  }, [pathname]);

  // ------------------------------------------------------

  const hideGlobalChrome = useMemo(() => {
    if (!pathname) {
      return false;
    }

    const authPaths = ['/dang-ky', '/dang-nhap', '/quen-mat-khau', '/dat-lai-mat-khau',];
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
          <Link 
            href="/dang-tin"
            className="bg-white text-emerald-700 font-heading font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            Đăng tin ngay
          </Link>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default AppShell;
