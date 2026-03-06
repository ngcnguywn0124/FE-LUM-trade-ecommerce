"use client";

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';

/**
 * AuthProvider
 * 1. Khởi tạo trạng thái xác thực từ httpOnly cookie khi app load.
 * 2. Xử lý kết quả Google OAuth2 callback:
 *    - Backend redirect về / sau khi đặt JWT cookie (success)
 *    - Backend redirect về /?error=google_denied | invalid_state (failure)
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Xử lý lỗi Google OAuth2 từ query param
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');

    if (oauthError) {
      const errorMessages: Record<string, string> = {
        google_denied: 'Bạn đã hủy đăng nhập bằng Google.',
        invalid_state: 'Phiên đăng nhập không hợp lệ, vui lòng thử lại.',
        google_failed: 'Đăng nhập bằng Google thất bại, vui lòng thử lại.',
      };
      const message = errorMessages[oauthError] ?? 'Đăng nhập thất bại, vui lòng thử lại.';
      toast.error(message);

      // Xóa query param khỏi URL mà không reload trang
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }

    initialize();
  }, [initialize]);

  return <>{children}</>;
}

