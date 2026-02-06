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
      <section className="bg-brand-mint py-12 text-center">
         <h2 className="text-2xl font-bold text-brand-dark">Bạn có đồ không dùng?</h2>
         <p className="mb-6">Đăng bán ngay để dọn phòng đón đồ mới!</p>
         <button className="bg-white text-emerald-700 font-heading font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer">Đăng tin ngay</button>
      </section>
      <Footer />
    </div>
  );
};

export default AppShell;
