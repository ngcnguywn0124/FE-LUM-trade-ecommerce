'use client';

import React from 'react';
import { PostStatus, PostsAggregate } from '@/types/manage-posts';

type FilterTab = PostStatus | 'all';

interface Tab {
  key: FilterTab;
  label: string;
  count: number;
  color: string;
  dotColor: string;
}

interface PostStatusTabsProps {
  active: FilterTab;
  onChange: (status: FilterTab) => void;
  aggregate: PostsAggregate;
}

const PostStatusTabs: React.FC<PostStatusTabsProps> = ({ active, onChange, aggregate }) => {
  const tabs: Tab[] = [
    { key: 'all', label: 'Tất cả', count: aggregate.total, color: 'text-gray-700', dotColor: 'bg-gray-400' },
    { key: 'active', label: 'Đang hiển thị', count: aggregate.active, color: 'text-emerald-700', dotColor: 'bg-emerald-500' },
    { key: 'pending', label: 'Đang duyệt', count: aggregate.pending, color: 'text-amber-700', dotColor: 'bg-amber-400' },
    { key: 'expired', label: 'Hết hạn', count: aggregate.expired, color: 'text-orange-700', dotColor: 'bg-orange-400' },
    { key: 'hidden', label: 'Đã ẩn', count: aggregate.hidden, color: 'text-gray-600', dotColor: 'bg-gray-400' },
    { key: 'sold', label: 'Đã bán', count: aggregate.sold, color: 'text-blue-700', dotColor: 'bg-blue-400' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`
                  relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? `${tab.color} border-b-2 border-current bg-gray-50`
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 border-b-2 border-transparent'
                  }
                `}
              >
                {/* Status dot */}
                <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? tab.dotColor : 'bg-gray-300'}`} />
                {tab.label}
                {/* Count badge */}
                <span
                  className={`
                    ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold
                    ${isActive ? 'bg-current/10' : 'bg-gray-100 text-gray-500'}
                  `}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PostStatusTabs;
