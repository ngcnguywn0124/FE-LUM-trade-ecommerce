import apiClient from '@/lib/apiClient';
import type { ApiResponse, UserResponse } from '@/types/auth';
import type { ProfileResponse, UpdateProfileRequest } from '@/types/profile';

export async function getMyProfile(): Promise<ProfileResponse> {
  const res = await apiClient.get<ApiResponse<ProfileResponse>>('/users/me/profile');
  return res.data.data;
}

export async function updateMyProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
  const res = await apiClient.put<ApiResponse<ProfileResponse>>('/users/me/profile', data);
  return res.data.data;
}

export async function updateAvatar(file: File): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post<ApiResponse<ProfileResponse>>('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function updateCover(file: File): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post<ApiResponse<ProfileResponse>>('/users/me/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function getPublicProfile(userId: string): Promise<ProfileResponse> {
  const res = await apiClient.get<ApiResponse<ProfileResponse>>(`/users/${userId}/profile`);
  return res.data.data;
}

export function mapProfileToUserResponse(profile: ProfileResponse): UserResponse {
  return {
    userId: profile.userId,
    email: profile.email ?? '',
    phoneNumber: profile.phoneNumber ?? '',
    fullName: profile.fullName,
    avatarUrl: profile.avatarUrl,
    coverUrl: profile.coverUrl,
    roles: profile.roles,
    isSocialAccount: profile.isSocialAccount,
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth,
    studentId: profile.studentId,
    universityId: profile.universityId,
    campusId: profile.campusId,
    graduationYear: profile.graduationYear,
    faculty: profile.faculty,
    bio: profile.bio,
    location: profile.location,
    reputationScore: profile.reputationScore,
    totalSales: profile.totalSales,
    totalPurchases: profile.totalPurchases,
    followersCount: profile.followersCount,
    followingCount: profile.followingCount,
    responseRate: profile.responseRate,
    responseTime: profile.responseTime,
    isEmailVerified: profile.isEmailVerified,
    isPhoneVerified: profile.isPhoneVerified,
    isStudentVerified: profile.isStudentVerified,
    isActive: profile.isActive,
    createdAt: profile.createdAt,
    lastLoginAt: profile.lastLoginAt,
  };
}
