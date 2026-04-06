import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types/auth';
import type { SpringPage } from '@/types/product-api';

export interface ProductCommentResponse {
  commentId: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  content: string;
  parentCommentId: string | null;
  likeCount: number;
  likedByCurrentUser: boolean;
  replies: ProductCommentResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductCommentPayload {
  content: string;
}

type ProductCommentPageApiResponse = ApiResponse<SpringPage<ProductCommentResponse>>;
type ProductCommentDetailApiResponse = ApiResponse<ProductCommentResponse>;

export async function getProductComments(
  productId: string,
  page = 0,
  size = 20,
): Promise<SpringPage<ProductCommentResponse>> {
  const res = await apiClient.get<ProductCommentPageApiResponse>(`/products/${productId}/comments`, {
    params: { page, size, sort: 'createdAt,desc' },
  });
  return res.data.data;
}

export async function createProductComment(
  productId: string,
  payload: CreateProductCommentPayload,
): Promise<ProductCommentResponse> {
  const res = await apiClient.post<ProductCommentDetailApiResponse>(
    `/products/${productId}/comments`,
    payload,
  );
  return res.data.data;
}

export async function createProductCommentReply(
  productId: string,
  commentId: string,
  payload: CreateProductCommentPayload,
): Promise<ProductCommentResponse> {
  const res = await apiClient.post<ProductCommentDetailApiResponse>(
    `/products/${productId}/comments/${commentId}/replies`,
    payload,
  );
  return res.data.data;
}

export async function toggleProductCommentLike(
  productId: string,
  commentId: string,
): Promise<ProductCommentResponse> {
  const res = await apiClient.post<ProductCommentDetailApiResponse>(
    `/products/${productId}/comments/${commentId}/like`,
  );
  return res.data.data;
}
