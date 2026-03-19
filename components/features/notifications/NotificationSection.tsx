'use client';

import { NotificationItemData } from '@/types/notifications';
import NotificationItem from './NotificationItem';
import NotificationsEmptyState from './NotificationsEmptyState';

interface NotificationSectionProps {
  notifications: NotificationItemData[];
  compact?: boolean;
  onMarkRead?: (id: string) => void;
}

const NotificationSection = ({ notifications, compact = false, onMarkRead }: NotificationSectionProps) => {
  if (!notifications.length) {
    return <NotificationsEmptyState compact={compact} />;
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          compact={compact}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
};

export default NotificationSection;
