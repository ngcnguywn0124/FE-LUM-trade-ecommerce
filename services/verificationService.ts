import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth';
import type {
  PendingStudentVerificationResponse,
  ReviewStudentVerificationRequest,
  SendVerificationCodeRequest,
  StudentVerificationRequest,
  UserVerificationResponse,
  VerifyCodeRequest,
} from '@/types/profile';

export async function sendVerificationCode(
  data: SendVerificationCodeRequest,
): Promise<UserVerificationResponse> {
  const res = await apiClient.post<ApiResponse<UserVerificationResponse>>('/verifications/send-code', data);
  return res.data.data;
}

export async function confirmVerificationCode(
  data: VerifyCodeRequest,
): Promise<UserVerificationResponse> {
  const res = await apiClient.post<ApiResponse<UserVerificationResponse>>('/verifications/confirm', data);
  return res.data.data;
}

export async function submitStudentVerification(
  data: StudentVerificationRequest,
): Promise<UserVerificationResponse> {
  const res = await apiClient.post<ApiResponse<UserVerificationResponse>>('/verifications/student/submit', data);
  return res.data.data;
}

export async function reviewStudentVerification(
  userId: string,
  data: ReviewStudentVerificationRequest,
): Promise<UserVerificationResponse> {
  const res = await apiClient.post<ApiResponse<UserVerificationResponse>>(
    `/verifications/student/${userId}/review`,
    data,
  );
  return res.data.data;
}

export async function getMyVerifications(): Promise<UserVerificationResponse[]> {
  const res = await apiClient.get<ApiResponse<UserVerificationResponse[]>>('/verifications/me');
  return res.data.data;
}

export async function getPendingStudentVerifications(): Promise<PendingStudentVerificationResponse[]> {
  const res = await apiClient.get<ApiResponse<PendingStudentVerificationResponse[]>>('/verifications/student/pending');
  return res.data.data;
}
