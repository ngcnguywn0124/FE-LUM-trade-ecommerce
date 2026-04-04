import { create } from 'zustand';
import { notificationService, ApiNotificationResponse } from '@/services/notificationService';
import { NotificationItemData, mapApiTypeToUiType } from '@/types/notifications';

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapApiToItem(n: ApiNotificationResponse): NotificationItemData {
  return {
    id: n.notificationId,
    type: mapApiTypeToUiType(n.notificationType),
    apiType: n.notificationType,
    title: n.title,
    content: n.content,
    createdAt: n.createdAt,
    isRead: n.isRead,
    actorId: n.actorId,
    actorName: n.actorName,
    actorAvatar: n.actorAvatarUrl,
    targetHref: n.targetHref,
    image: n.imageUrl,
    relatedEntityType: n.relatedEntityType,
    relatedEntityId: n.relatedEntityId,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface NotificationStore {
  notifications: NotificationItemData[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;

  /** Load trang đầu tiên (hoặc reload lại) */
  fetchNotifications: (userId: string) => Promise<void>;
  /** Load thêm (next page) */
  fetchMoreNotifications: (userId: string) => Promise<void>;
  /** Đánh dấu một thông báo đã đọc */
  markAsRead: (userId: string, notificationId: string) => Promise<void>;
  /** Đánh dấu tất cả đã đọc */
  markAllAsRead: (userId: string) => Promise<void>;
  /** Fetch unread count (cho header badge) */
  fetchUnreadCount: (userId: string) => Promise<void>;
  /** Thêm notification mới từ WebSocket real-time */
  addRealtimeNotification: (item: NotificationItemData) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasMore: true,
  currentPage: 0,

  fetchNotifications: async (userId) => {
    set({ isLoading: true });
    try {
      const [page, unreadCount] = await Promise.all([
        notificationService.getNotifications(userId, 0, 20),
        notificationService.getUnreadCount(userId),
      ]);
      set({
        notifications: page.content.map(mapApiToItem),
        hasMore: !page.last,
        currentPage: 0,
        unreadCount,
      });
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMoreNotifications: async (userId) => {
    const { isLoading, hasMore, currentPage, notifications } = get();
    if (isLoading || !hasMore) return;
    set({ isLoading: true });
    try {
      const nextPage = currentPage + 1;
      const page = await notificationService.getNotifications(userId, nextPage, 20);
      const newItems = page.content.map(mapApiToItem);
      const existingIds = new Set(notifications.map((n) => n.id));
      const unique = newItems.filter((n) => !existingIds.has(n.id));
      set({
        notifications: [...notifications, ...unique],
        hasMore: !page.last,
        currentPage: nextPage,
      });
    } catch (err) {
      console.error('Failed to load more notifications:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (userId, notificationId) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await notificationService.markAsRead(userId, notificationId);
    } catch {
      // Revert on failure
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: false } : n,
        ),
        unreadCount: state.unreadCount + 1,
      }));
    }
  },

  markAllAsRead: async (userId) => {
    const prevNotifs = get().notifications;
    const prevUnread = get().unreadCount;
    // Optimistic update
    set({ notifications: prevNotifs.map((n) => ({ ...n, isRead: true })), unreadCount: 0 });
    try {
      await notificationService.markAllAsRead(userId);
    } catch {
      set({ notifications: prevNotifs, unreadCount: prevUnread });
    }
  },

  fetchUnreadCount: async (userId) => {
    try {
      const count = await notificationService.getUnreadCount(userId);
      set({ unreadCount: count });
    } catch {
      // ignore
    }
  },

  addRealtimeNotification: (item) => {
    set((state) => ({
      notifications: [item, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
