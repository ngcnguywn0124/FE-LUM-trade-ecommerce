'use client';

import Link from 'next/link';
import { NotificationItemData } from '@/types/notifications';
import NotificationSection from './NotificationSection';

interface NotificationsDropdownProps {
  notifications: NotificationItemData[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

const NotificationsDropdown = ({ notifications, onMarkRead, onMarkAllRead, onClose }: NotificationsDropdownProps) => {
  return (
    <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(92vw,26rem)] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-gray-900">Thông báo</h3>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          Đánh dấu đã đọc
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto pr-1">
        <NotificationSection
          notifications={notifications}
          compact
          onMarkRead={onMarkRead}
        />
      </div>

      <div className="mt-3 border-t border-gray-100 pt-3 text-center">
        <Link
          href="/thong-bao"
          onClick={onClose}
          className="inline-flex rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
