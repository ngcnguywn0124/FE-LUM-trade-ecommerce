import type { Product } from '@/types';

export type VerificationType = 'email' | 'phone' | 'student';

export interface ProfileResponse {
  userId: string;
  email: string | null;
  phoneNumber: string | null;
  fullName: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  dateOfBirth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  roles: string[];
  isSocialAccount: boolean;
  studentId: string | null;
  universityId: string | null;
  campusId: string | null;
  faculty: string | null;
  graduationYear: number | null;
  bio: string | null;
  location: string | null;
  reputationScore: number;
  totalSales: number;
  totalPurchases: number;
  followersCount: number;
  followingCount: number;
  responseRate: number;
  responseTime: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isStudentVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;

  // Statistics for UI
  totalListings?: number;
  totalSold?: number;
  rating?: number;
  reviewCount?: number;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  studentId?: string | null;
  universityId?: string | null;
  campusId?: string | null;
  faculty?: string | null;
  graduationYear?: number | null;
  bio?: string | null;
  location?: string | null;
}

export interface SendVerificationCodeRequest {
  verificationType: VerificationType;
}

export interface VerifyCodeRequest {
  verificationType: VerificationType;
  verificationCode: string;
}

export interface StudentVerificationRequest {
  studentId: string;
  universityId: string;
  campusId: string;
  faculty?: string | null;
  graduationYear: number;
}

export interface ReviewStudentVerificationRequest {
  approved: boolean;
}

export interface UserVerificationResponse {
  verificationId: string;
  userId: string;
  verificationType: VerificationType;
  isVerified: boolean;
  expiresAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

export interface PendingStudentVerificationResponse {
  verificationId: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  studentId: string | null;
  universityId: string | null;
  universityName: string | null;
  campusId: string | null;
  campusName: string | null;
  faculty: string | null;
  graduationYear: number | null;
  submittedAt: string;
}

export interface UserReview {
  id: number;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  createdAt: string;
  comment: string;
  productName: string;
  isVerifiedPurchase: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  cover?: string;
  rating: number;
  reviewCount: number;
  totalListings: number;
  totalSold: number;
  followers: number;
  responseRate: number;
  responseTime: string;
  joinDate: string;
  lastActive: string;
  location: string;
}

export interface UserProfileData {
  profile: UserProfile;
  listings: Product[];
  reviews: UserReview[];
  ratingBreakdown: Record<number, number>;
}
