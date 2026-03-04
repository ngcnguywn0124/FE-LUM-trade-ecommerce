export type NotificationType = 'message' | 'post' | 'wishlist' | 'system';

export type NotificationFilter = 'all' | 'unread' | NotificationType;

export interface NotificationItemData {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  actorName?: string;
  actorAvatar?: string;
  targetLabel?: string;
  targetHref?: string;
  image?: string;
}
