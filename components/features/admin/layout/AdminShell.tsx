'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { ADMIN_NAV_ITEMS } from './adminNav';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentMeta = useMemo(() => {
    return (
      ADMIN_NAV_ITEMS.find((item) => item.href === pathname) ?? {
        label: 'Admin',
      }
    );
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <AdminSidebar mobile isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="min-h-screen lg:pl-72 flex flex-col">
        <AdminHeader
          title={currentMeta.label}
          onOpenSidebar={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
