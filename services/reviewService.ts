import axios from 'axios';

export interface CreateReviewPayload {
  transactionId: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  reviewId: string;
  transactionId: string;
  productName: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatarUrl: string | null;
  revieweeId: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface SpringPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const reviewApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1$/, '')}/api/reviews`
    : '/api/reviews',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const headers = (userId: string) => ({ headers: { 'User-Id': userId } });

export const reviewService = {
  async createReview(userId: string, payload: CreateReviewPayload): Promise<ReviewResponse> {
    const res = await reviewApiClient.post<ReviewResponse>('', payload, headers(userId));
    return res.data;
  },

  async getUserReviews(userId: string, page = 0, size = 10): Promise<SpringPage<ReviewResponse>> {
    const res = await reviewApiClient.get<SpringPage<ReviewResponse>>(`/user/${userId}`, {
      params: { page, size }
    });
    return res.data;
  }
};
