import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionStatus =
  | 'buyer_requested'
  | 'seller_confirmed'
  | 'meetup_confirmed'
  | 'payment_pending'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface TransactionStatusHistoryItem {
  historyId: string;
  status: string;
  changedById: string | null;
  changedByName: string;
  notes: string | null;
  createdAt: string;
}

export interface ApiTransactionResponse {
  transactionId: string;
  // Product
  productId: string;
  productTitle: string;
  productSlug: string | null;
  productImageUrl: string | null;
  productPrice: number | null;
  // Buyer
  buyerId: string;
  buyerName: string;
  buyerAvatarUrl: string | null;
  // Seller
  sellerId: string;
  sellerName: string;
  sellerAvatarUrl: string | null;
  // Info
  transactionType: string;
  status: TransactionStatus;
  agreedPrice: number | null;
  paymentMethod: string | null;
  shippingMethod: string | null;
  meetupLocation: string | null;
  meetupTime: string | null;
  // Confirmations
  buyerConfirmedMeetup: boolean;
  sellerConfirmedMeetup: boolean;
  buyerConfirmedPayment: boolean;
  sellerConfirmedPayment: boolean;
  isReviewed: boolean | null;
  // Cancel
  cancellationReason: string | null;
  cancelledBy: string | null;
  notes: string | null;
  // Timeline
  requestedAt: string | null;
  sellerConfirmedAt: string | null;
  meetupConfirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  // History
  statusHistory: TransactionStatusHistoryItem[] | null;
}

export interface CreateTransactionPayload {
  productId: string;
  transactionType?: 'sale' | 'exchange';
  agreedPrice?: number;
  paymentMethod?: 'cash' | 'transfer';
  shippingMethod?: 'meetup' | 'delivery';
  meetupLocation?: string;
  meetupTime?: string;
  notes?: string;
}

export interface UpdateTransactionStatusPayload {
  status: TransactionStatus;
  notes?: string;
  meetupLocation?: string;
  meetupTime?: string;
  agreedPrice?: number;
  paymentMethod?: string;
  cancellationReason?: string;
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

export interface GetMyTransactionsParams {
  page?: number;
  size?: number;
  role?: 'buyer' | 'seller' | 'all';
  status?: TransactionStatus | 'all';
  fromDate?: string;
  toDate?: string;
}

// ─── Axios client ─────────────────────────────────────────────────────────────

const txApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1$/, '')}/api/transactions`
    : '/api/transactions',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const headers = (userId: string) => ({ headers: { 'User-Id': userId } });

// ─── Service ──────────────────────────────────────────────────────────────────

export const transactionService = {
  /** Tạo giao dịch mới (buyer_requested) */
  async createTransaction(
    userId: string,
    payload: CreateTransactionPayload,
  ): Promise<ApiTransactionResponse> {
    const res = await txApiClient.post<ApiTransactionResponse>('', payload, headers(userId));
    return res.data;
  },

  /** Danh sách giao dịch của tôi (buyer & seller) */
  async getMyTransactions(
    userId: string,
    params: GetMyTransactionsParams = {},
  ): Promise<SpringPage<ApiTransactionResponse>> {
    const {
      page = 0,
      size = 20,
      role = 'all',
      status,
      fromDate,
      toDate,
    } = params;

    const res = await txApiClient.get<SpringPage<ApiTransactionResponse>>('', {
      ...headers(userId),
      params: {
        page,
        size,
        ...(role && role !== 'all' ? { role } : {}),
        ...(status && status !== 'all' ? { status } : {}),
        ...(fromDate ? { fromDate } : {}),
        ...(toDate ? { toDate } : {}),
      },
    });
    return res.data;
  },

  /** Chi tiết giao dịch + lịch sử trạng thái */
  async getTransactionDetail(
    userId: string,
    transactionId: string,
  ): Promise<ApiTransactionResponse> {
    const res = await txApiClient.get<ApiTransactionResponse>(
      `/${transactionId}`,
      headers(userId),
    );
    return res.data;
  },

  /** Cập nhật trạng thái giao dịch */
  async updateTransactionStatus(
    userId: string,
    transactionId: string,
    payload: UpdateTransactionStatusPayload,
  ): Promise<ApiTransactionResponse> {
    const res = await txApiClient.put<ApiTransactionResponse>(
      `/${transactionId}/status`,
      payload,
      headers(userId),
    );
    return res.data;
  },
};
