/**
 * Loại thông báo khớp với backend API
 * DB: new_message | new_offer | transaction_update | product_sold |
 *     product_expired | review_received | wishlist_update | new_follower |
 *     admin_message | system
 * FE tabs nhóm: message → new_message|new_offer
 *               post    → product_sold|product_expired
 *               transaction → transaction_update
 *               system  → admin_message|system|review_received|new_follower
 */
export type ApiNotificationType =
  | 'new_message'
  | 'new_offer'
  | 'transaction_update'
  | 'product_sold'
  | 'product_expired'
  | 'review_received'
  | 'wishlist_update'
  | 'new_follower'
  | 'admin_message'
  | 'system';

/** Group hiển thị trên tabs UI */
export type NotificationType = 'message' | 'transaction' | 'post' | 'system';

export type NotificationFilter = 'all' | 'unread' | NotificationType;

/** Map từ API type → UI tab group */
export function mapApiTypeToUiType(apiType: string): NotificationType {
  if (apiType === 'new_message' || apiType === 'new_offer') return 'message';
  if (apiType === 'transaction_update') return 'transaction';
  if (apiType === 'product_sold' || apiType === 'product_expired') return 'post';
  return 'system';
}

export interface NotificationItemData {
  /** UUID từ API */
  id: string;
  type: NotificationType;
  /** Raw API type, dùng để hiển thị icon phù hợp */
  apiType: ApiNotificationType | string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  actorId?: string | null;
  actorName?: string | null;
  actorAvatar?: string | null;
  targetHref?: string | null;
  image?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}
