'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface AdminGuardProps {
  children: React.ReactNode;
  /** Roles allowed. Default: ROLE_ADMIN, ROLE_SUPER_ADMIN */
  allowedRoles?: string[];
}

/**
 * Client-side guard for admin pages.
 * Redirects to / if not authenticated or lacks the required role.
 * (Backend Spring Security is the real enforcer — this is UX-only.)
 */
export default function AdminGuard({
  children,
  allowedRoles = ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
}: AdminGuardProps) {
  const { isAuthenticated, isLoading, isInitialized, user } = useAuthStore();
  const router = useRouter();

  const hasRole =
    isAuthenticated &&
    user?.roles?.some((r) => allowedRoles.includes(r));

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!isAuthenticated || !hasRole) {
        router.replace('/');
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, hasRole, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !hasRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-gray-500">
        <ShieldAlert size={48} className="text-red-400" />
        <p className="text-lg font-semibold">Không có quyền truy cập</p>
        <p className="text-sm">Bạn cần đăng nhập với quyền quản trị viên.</p>
      </div>
    );
  }

  return <>{children}</>;
}
