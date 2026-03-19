'use client';

import { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import CustomSelect, { SelectOption } from '@/components/shared/CustomSelect';
import { NotificationFilter } from '@/types/notifications';
import NotificationTabs from './NotificationTabs';
import NotificationSection from './NotificationSection';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';

type SortOption = 'newest' | 'oldest';

const sortOptions: SelectOption[] = [
  { id: 'newest', name: 'Mới nhất' },
  { id: 'oldest', name: 'Cũ nhất' },
];

const NotificationsPage = () => {
  const { user } = useAuthStore();
  const userId = user?.userId ?? '';

  const {
    notifications,
    isLoading,
    hasMore,
    fetchNotifications,
    fetchMoreNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  useEffect(() => {
    if (userId) fetchNotifications(userId);
  }, [userId, fetchNotifications]);

  const stats = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    message: notifications.filter((n) => n.type === 'message').length,
    post: notifications.filter((n) => n.type === 'post').length,
    transaction: notifications.filter((n) => n.type === 'transaction').length,
  }), [notifications]);

  const filteredNotifications = useMemo(() => {
    const byFilter = notifications.filter((item) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return !item.isRead;
      return item.type === activeFilter;
    });
    return byFilter.slice().sort((a, b) => {
      const aT = new Date(a.createdAt).getTime();
      const bT = new Date(b.createdAt).getTime();
      return sortOption === 'newest' ? bT - aT : aT - bT;
    });
  }, [notifications, activeFilter, sortOption]);

  const handleMarkRead = (id: string) => {
    if (userId) markAsRead(userId, id);
  };

  const handleMarkAllRead = () => {
    if (userId) markAllAsRead(userId);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Thông báo' }]} />

        <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Thông báo của bạn</h1>
              <p className="mt-1 text-sm text-gray-500">Theo dõi cập nhật mới nhất từ tin nhắn, giao dịch và hệ thống.</p>
            </div>

            <div className="flex items-center gap-2">
              <CustomSelect
                value={sortOption}
                onChange={(value) => setSortOption(value as SortOption)}
                options={sortOptions}
                className="w-40"
              />
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="h-11.5 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                Đánh dấu tất cả đã đọc
              </button>
            </div>
          </div>

          <NotificationTabs
            activeFilter={activeFilter}
            onChange={setActiveFilter}
            totalCount={stats.total}
            unreadCount={stats.unread}
            messageCount={stats.message}
            postCount={stats.post}
          />

          <div className="mt-4">
            {isLoading && notifications.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
              </div>
            ) : (
              <>
                <NotificationSection notifications={filteredNotifications} onMarkRead={handleMarkRead} />

                {hasMore && !isLoading && (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => userId && fetchMoreNotifications(userId)}
                      className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Tải thêm
                    </button>
                  </div>
                )}

                {isLoading && notifications.length > 0 && (
                  <div className="mt-4 flex justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotificationsPage;
