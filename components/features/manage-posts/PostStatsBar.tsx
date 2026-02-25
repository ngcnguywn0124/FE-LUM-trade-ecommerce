'use client';

import React from 'react';
import { Eye, Heart, MessageCircle, FileText, Star } from 'lucide-react';
import { PostsAggregate } from '@/types/manage-posts';

interface PostStatsBarProps {
  aggregate: PostsAggregate;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) => (
  <div className="flex flex-col items-center justify-center gap-1.5 bg-white rounded-xl p-2 sm:p-4 border border-gray-100 min-w-0 text-center">
    <div className={`p-1.5 sm:p-2.5 rounded-lg ${color} shrink-0 mb-0.5 sm:mb-0`}>
      <Icon size={15} className="text-white sm:w-[20px] sm:h-[20px]" />
    </div>
    <div className="min-w-0 w-full">
      <p className="text-[9px] sm:text-xs text-gray-400 font-semibold uppercase tracking-tighter sm:tracking-normal truncate">
        {label}
      </p>
      <p className="text-[12px] sm:text-xl font-bold text-gray-900 leading-none sm:leading-tight font-heading mt-1">
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
      </p>
    </div>
  </div>
);

const PostStatsBar: React.FC<PostStatsBarProps> = ({ aggregate }) => {
  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="w-1 h-3 sm:h-4 bg-emerald-500 rounded-full" />
        Tổng quan tài khoản
      </h2>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-4 w-full">
        <StatCard
          icon={FileText}
          label="Tin đăng"
          value={aggregate.total}
          color="bg-emerald-500"
        />
        <StatCard
          icon={Eye}
          label="Lượt xem"
          value={aggregate.totalViews}
          color="bg-blue-500"
        />
        <StatCard
          icon={Heart}
          label="Yêu thích"
          value={aggregate.totalFavorites}
          color="bg-rose-500"
        />
        <StatCard
          icon={MessageCircle}
          label="Tin nhắn"
          value={aggregate.totalMessages}
          color="bg-violet-500"
        />
        <StatCard
          icon={Star}
          label="Đánh giá"
          value={`${aggregate.rating} (${aggregate.ratingCount})`}
          color="bg-amber-500"
        />
      </div>
    </div>
  );
};

export default PostStatsBar;
