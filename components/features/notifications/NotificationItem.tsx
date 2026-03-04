'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bell, Bookmark, MessageCircle, Megaphone } from 'lucide-react';
import { formatNotificationTime } from '@/lib/mockNotifications';
import { NotificationItemData, NotificationType } from '@/types/notifications';

interface NotificationItemProps {
  notification: NotificationItemData;
  compact?: boolean;
  onMarkRead?: (id: number) => void;
}

const iconByType: Record<NotificationType, React.ReactNode> = {
  message: <MessageCircle size={16} />,
  post: <Megaphone size={16} />,
  wishlist: <Bookmark size={16} />,
  system: <Bell size={16} />,
};

const NotificationItem = ({ notification, compact = false, onMarkRead }: NotificationItemProps) => {
  return (
    <article
      className={`group rounded-xl border px-3 py-3 transition-colors ${
        notification.isRead ? 'border-gray-200 bg-white' : 'border-green-100 bg-green-50/60'
      } ${compact ? 'p-3' : 'md:px-4 md:py-4'}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
          {iconByType[notification.type]}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate text-sm font-semibold text-gray-900 md:text-base">{notification.title}</h4>
            {!notification.isRead && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />}
          </div>

          <p className="mt-1 text-sm text-gray-600">{notification.content}</p>

          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">{formatNotificationTime(notification.createdAt)}</span>

            <div className="flex items-center gap-3">
              {!notification.isRead && onMarkRead && (
                <button
                  type="button"
                  onClick={() => onMarkRead(notification.id)}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Đánh dấu đã đọc
                </button>
              )}

              {notification.targetHref && (
                <Link href={notification.targetHref} className="text-xs font-semibold text-gray-900 hover:underline">
                  {notification.targetLabel || 'Xem chi tiết'}
                </Link>
              )}
            </div>
          </div>
        </div>

        {!compact && notification.image && (
          <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 md:block">
            <Image
              src={notification.image}
              alt={notification.title}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default NotificationItem;
