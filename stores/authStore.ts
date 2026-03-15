import { create } from 'zustand';
import { AxiosError } from 'axios';
import * as authService from '@/services/authService';
import * as profileService from '@/services/profileService';
import * as verificationService from '@/services/verificationService';
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from '@/types/auth';
import type {
  SendVerificationCodeRequest,
  StudentVerificationRequest,
  UpdateProfileRequest,
  UserVerificationResponse,
  VerifyCodeRequest,
} from '@/types/profile';

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
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  updateCover: (file: File) => Promise<void>;
  sendVerificationCode: (data: SendVerificationCodeRequest) => Promise<UserVerificationResponse>;
  confirmVerificationCode: (data: VerifyCodeRequest) => Promise<UserVerificationResponse>;
  submitStudentVerification: (data: StudentVerificationRequest) => Promise<UserVerificationResponse>;
  getMyVerifications: () => Promise<UserVerificationResponse[]>;
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

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.updateMyProfile(data);
      set({
        user: profileService.mapProfileToUserResponse(profile),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Cập nhật hồ sơ thất bại'),
      });
      throw error;
    }
  },

  updateAvatar: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.updateAvatar(file);
      set({
        user: profileService.mapProfileToUserResponse(profile),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Cập nhật ảnh đại diện thất bại'),
      });
      throw error;
    }
  },

  updateCover: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.updateCover(file);
      set({
        user: profileService.mapProfileToUserResponse(profile),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Cập nhật ảnh bìa thất bại'),
      });
      throw error;
    }
  },

  sendVerificationCode: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verificationService.sendVerificationCode(data);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Gửi mã xác thực thất bại'),
      });
      throw error;
    }
  },

  confirmVerificationCode: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verificationService.confirmVerificationCode(data);
      await authService.getCurrentUser().then((user) => {
        set({ user, isAuthenticated: true, isLoading: false });
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Xác thực mã thất bại'),
      });
      throw error;
    }
  },

  submitStudentVerification: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verificationService.submitStudentVerification(data);
      await authService.getCurrentUser().then((user) => {
        set({ user, isAuthenticated: true, isLoading: false });
      });
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Gửi hồ sơ xác thực sinh viên thất bại'),
      });
      throw error;
    }
  },

  getMyVerifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const responses = await verificationService.getMyVerifications();
      set({ isLoading: false });
      return responses;
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Không thể lấy lịch sử xác thực'),
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
