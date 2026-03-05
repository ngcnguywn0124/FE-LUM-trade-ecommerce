// ============================================================
// Auth Types - matching Spring Boot backend DTOs exactly
// ============================================================

/** ApiResponse wrapper from backend */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** UserResponse từ backend */
export interface UserResponse {
  userId: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  roles: string[];
  studentId: string | null;
  universityId: number | null;
  campusId: number | null;
  faculty: string | null;
  bio: string | null;
  location: string | null;
  reputationScore: number;
  totalSales: number;
  totalPurchases: number;
  followersCount: number;
  followingCount: number;
  responseRate: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isStudentVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

/** AuthResponse từ backend */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // seconds
  user: UserResponse;
}

// ============================================================
// Request DTOs
// ============================================================

export interface LoginRequest {
  identifier: string; // email hoặc số điện thoại
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
