import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiNotificationResponse {
  notificationId: string;
  notificationType: string;
  title: string;
  content: string;
  actorId: string | null;
  actorName: string | null;
  actorAvatarUrl: string | null;
  imageUrl: string | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  targetHref: string | null;
  isRead: boolean;
  readAt: string | null;
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

// ─── Axios client ─────────────────────────────────────────────────────────────

const notifApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1$/, '')}/api/notifications`
    : '/api/notifications',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const headers = (userId: string) => ({ headers: { 'User-Id': userId } });

// ─── Service ──────────────────────────────────────────────────────────────────

export const notificationService = {
  /** Lấy danh sách thông báo (phân trang), mới nhất trước */
  async getNotifications(
    userId: string,
    page = 0,
    size = 20,
  ): Promise<SpringPage<ApiNotificationResponse>> {
    const res = await notifApiClient.get<SpringPage<ApiNotificationResponse>>('', {
      ...headers(userId),
      params: { page, size, sort: 'createdAt,desc' },
    });
    return res.data;
  },

  /** Số thông báo chưa đọc */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const res = await notifApiClient.get<{ count: number }>('/unread-count', headers(userId));
      return res.data.count ?? 0;
    } catch {
      return 0;
    }
  },

  /** Đánh dấu một thông báo đã đọc */
  async markAsRead(userId: string, notificationId: string): Promise<ApiNotificationResponse> {
    const res = await notifApiClient.put<ApiNotificationResponse>(
      `/${notificationId}/read`,
      {},
      headers(userId),
    );
    return res.data;
  },

  /** Đánh dấu tất cả thông báo đã đọc */
  async markAllAsRead(userId: string): Promise<void> {
    await notifApiClient.put('/read-all', {}, headers(userId));
  },
};
