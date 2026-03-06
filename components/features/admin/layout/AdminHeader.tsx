'use client';

import { Menu, Shield, LogOut, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenSidebar: () => void;
}

export default function AdminHeader({ title, subtitle, onOpenSidebar }: AdminHeaderProps) {
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Đã đăng xuất thành công');
      router.push('/tai-khoan'); // Hoặc trang login bạn muốn
    } catch (err) {
      toast.error('Lỗi khi đăng xuất');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Mở sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-base lg:text-lg font-bold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Shield size={16} className="text-emerald-700" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-800 max-w-44 truncate">{user?.fullName ?? 'Admin'}</p>
            <p className="text-[11px] text-gray-400 max-w-44 truncate">{user?.roles?.join(', ') || 'N/A'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all font-medium text-sm"
          title="Đăng xuất"
        >
          {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
          {/* <span className="hidden md:inline">Đăng xuất</span> */}
        </button>
      </div>
    </header>
  );
}
