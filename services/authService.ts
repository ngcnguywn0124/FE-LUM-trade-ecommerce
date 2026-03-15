import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from '@/types/auth';

/**
 * POST /api/v1/auth/register
 * Backend set httpOnly cookies trong response.
 * Trả về UserResponse (không còn trả token trong body).
 */
export async function register(data: RegisterRequest): Promise<UserResponse> {
  const res = await apiClient.post<ApiResponse<UserResponse>>(
    '/auth/register',
    data,
  );
  return res.data.data;
}

/**
 * POST /api/v1/auth/login
 * Backend set httpOnly cookies trong response.
 * Trả về UserResponse (không còn trả token trong body).
 */
export async function login(data: LoginRequest): Promise<UserResponse> {
  const res = await apiClient.post<ApiResponse<UserResponse>>(
    '/auth/login',
    data,
  );
  return res.data.data;
}

/**
 * POST /api/v1/auth/logout
 * Backend đọc refreshToken từ httpOnly cookie – không cần gửi body.
 * Backend clear cookies trong response.
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

/**
 * POST /api/v1/auth/forgot-password
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await apiClient.post('/auth/forgot-password', data);
}

/**
 * POST /api/v1/auth/reset-password
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/auth/reset-password', data);
}

/**
 * POST /api/v1/auth/change-password
 */
export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await apiClient.post('/auth/change-password', data);
}

/**
 * GET /api/v1/auth/me
 * Browser tự gửi httpOnly accessToken cookie.
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const res = await apiClient.get<ApiResponse<UserResponse>>('/users/me/profile');
  return res.data.data;
}

/**
 * Bắt đầu luồng Google OAuth2:
 * Redirect browser đến backend /auth/google/authorize.
 * Backend sẽ set state cookie và redirect sang Google.
 * Sau khi Google xác thực xong, backend callback set JWT cookies
 * và redirect về frontend trang chủ.
 */
export function loginWithGoogle(): void {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8686/api/v1';
  window.location.href = `${backendUrl}/auth/google/authorize`;
}
