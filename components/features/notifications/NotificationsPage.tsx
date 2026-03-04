'use client';

import { useMemo, useState } from 'react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import CustomSelect, { SelectOption } from '@/components/shared/CustomSelect';
import { mockNotifications } from '@/lib/mockNotifications';
import { NotificationFilter, NotificationItemData } from '@/types/notifications';
import NotificationTabs from './NotificationTabs';
import NotificationSection from './NotificationSection';

type SortOption = 'newest' | 'oldest';

const sortOptions: SelectOption[] = [
  { id: 'newest', name: 'Mới nhất' },
  { id: 'oldest', name: 'Cũ nhất' },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationItemData[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const stats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter((item) => !item.isRead).length,
      message: notifications.filter((item) => item.type === 'message').length,
      post: notifications.filter((item) => item.type === 'post').length,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const byFilter = notifications.filter((item) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return !item.isRead;
      return item.type === activeFilter;
    });

    return byFilter.sort((first, second) => {
      const firstTime = new Date(first.createdAt).getTime();
      const secondTime = new Date(second.createdAt).getTime();

      return sortOption === 'newest' ? secondTime - firstTime : firstTime - secondTime;
    });
  }, [notifications, activeFilter, sortOption]);

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: true,
            }
          : item
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <section className="min-h-screen bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Thông báo' }]} />

        <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Thông báo của bạn</h1>
              <p className="mt-1 text-sm text-gray-500">Theo dõi cập nhật mới nhất từ tin nhắn, tin đăng và hệ thống.</p>
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
            <NotificationSection notifications={filteredNotifications} onMarkRead={handleMarkRead} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotificationsPage;
