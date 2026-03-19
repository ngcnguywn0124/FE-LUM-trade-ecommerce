import { NotificationItemData } from '@/types/notifications';

const now = Date.now();

export const mockNotifications: any[] = [];

export const formatNotificationTime = (isoDate: string) => {
  const diffInMinutes = Math.max(1, Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000));

  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  return new Date(isoDate).toLocaleDateString('vi-VN');
};
