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
  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-100 flex-1 min-w-0">
    <div className={`p-2 rounded-lg ${color} shrink-0`}>
      <Icon size={18} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 leading-tight">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-800 leading-tight font-heading">
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
      </p>
    </div>
  </div>
);

const PostStatsBar: React.FC<PostStatsBarProps> = ({ aggregate }) => {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Tổng quan tài khoản
      </h2>
      <div className="flex flex-wrap gap-3">
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
