"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * AuthProvider
 * Khởi tạo trạng thái xác thực từ localStorage khi app load.
 * Đặt component này bao bọc toàn bộ app trong layout.tsx.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
