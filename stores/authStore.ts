import { create } from 'zustand';
import { AxiosError } from 'axios';
import * as authService from '@/services/authService';
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from '@/types/auth';

// ── helpers ────────────────────────────────────────────────────────────────

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback;
  }
  return fallback;
}

// ── State shape ────────────────────────────────────────────────────────────

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  /** Redirect browser đến Google OAuth2 authorize endpoint trên backend */
  loginWithGoogle: () => void;
  clearError: () => void;
}

// ── Store ──────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Default to true until checked
  isInitialized: false,
  error: null,

  /**
   * Gọi GET /auth/me để kiểm tra cookie còn hợp lệ không.
   * Được gọi một lần khi app load (trong AuthProvider).
   * Không cần đọc token – browser tự gửi httpOnly cookie.
   */
  initialize: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false, isInitialized: true });
    } catch {
      // Cookie không tồn tại / hết hạn → chưa đăng nhập
      set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: true });
    }
  },

  /** Đăng nhập – backend set httpOnly cookies trong response */
  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(data);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Đăng nhập thất bại'),
      });
      throw error;
    }
  },

  /** Đăng ký – backend set httpOnly cookies trong response */
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(data);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Đăng ký thất bại'),
      });
      throw error;
    }
  },

  /** Đăng xuất – backend clear cookies trong response */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch {
      // Bỏ qua lỗi logout – clear state dù sao
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  /** Refresh user profile từ server */
  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  forgotPassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authService.forgotPassword(data);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Không thể gửi email khôi phục'),
      });
      throw error;
    }
  },

  resetPassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(data);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Đặt lại mật khẩu thất bại'),
      });
      throw error;
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authService.changePassword(data);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Đổi mật khẩu thất bại'),
      });
      throw error;
    }
  },

  /**
   * Redirect browser đến backend /auth/google/authorize.
   * Không có async – chỉ đơn giản đổi window.location.
   * Sau khi Google xác nhận, backend set cookies và redirect về /.
   * AuthProvider.initialize() sẽ tự nhận diện user từ cookie mới.
   */
  loginWithGoogle: () => {
    authService.loginWithGoogle();
  },

  clearError: () => set({ error: null }),
}));
