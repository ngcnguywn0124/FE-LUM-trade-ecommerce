'use client';

import { NotificationFilter } from '@/types/notifications';

interface NotificationTabsProps {
  activeFilter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
  totalCount: number;
  unreadCount: number;
  messageCount: number;
  postCount: number;
}

const tabs: Array<{ key: NotificationFilter; label: string }> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unread', label: 'Chưa đọc' },
  { key: 'message', label: 'Tin nhắn' },
  { key: 'post', label: 'Tin đăng' },
];

const NotificationTabs = ({
  activeFilter,
  onChange,
  totalCount,
  unreadCount,
  messageCount,
  postCount,
}: NotificationTabsProps) => {
  const getCountByTab = (key: NotificationFilter) => {
    if (key === 'all') return totalCount;
    if (key === 'unread') return unreadCount;
    if (key === 'message') return messageCount;
    if (key === 'post') return postCount;
    return 0;
  };

  return (
    <div className="flex w-full overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-visible md:pb-0 gap-2">
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
              isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
              ({getCountByTab(tab.key)})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default NotificationTabs;
