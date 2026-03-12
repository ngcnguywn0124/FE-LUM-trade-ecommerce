'use client';

import React from 'react';
import { FileX, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { PostStatus } from '@/types/manage-posts';

interface EmptyPostStateProps {
  activeFilter: PostStatus | 'all';
}

const MESSAGES: Record<PostStatus | 'all', { title: string; desc: string }> = {
  all: {
    title: 'Bạn chưa có tin đăng nào',
    desc: 'Đăng tin ngay để rao bán đồ dùng không cần thiết và kiếm thêm thu nhập!',
  },
  active: {
    title: 'Không có tin đang hiển thị',
    desc: 'Các tin đang hoạt động và hiển thị công khai cho mọi người sẽ xuất hiện ở đây.',
  },
  pending: {
    title: 'Không có tin đang chờ duyệt',
    desc: 'Các tin vừa đăng và đang chờ admin xét duyệt sẽ xuất hiện ở đây.',
  },
  expired: {
    title: 'Không có tin hết hạn',
    desc: 'Các tin đã hết thời hạn hiển thị sẽ xuất hiện ở đây. Bạn có thể gia hạn để đăng lại.',
  },
  hidden: {
    title: 'Không có tin nào bị ẩn',
    desc: 'Các tin bạn chủ động ẩn khỏi danh sách tìm kiếm sẽ xuất hiện ở đây.',
  },
  sold: {
    title: 'Chưa có tin nào được đánh dấu đã bán',
    desc: 'Sau khi giao dịch thành công, hãy đánh dấu tin là "Đã bán" để lưu lại lịch sử.',
  },
  admin_hidden: {
    title: 'Không có tin nào bị vi phạm',
    desc: 'Nếu tin của bạn vi phạm quy định, Admin sẽ ẩn tin và thông báo lý do tại đây.',
  }
};

const EmptyPostState: React.FC<EmptyPostStateProps> = ({ activeFilter }) => {
  const { title, desc } = MESSAGES[activeFilter];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl border border-gray-100 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <FileX size={30} className="text-gray-400" />
      </div>
      <h3 className="text-base font-bold text-gray-800 mb-1.5">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-5">{desc}</p>
      {activeFilter === 'all' && (
        <Link
          href="/dang-tin"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 active:scale-95 transition-all"
        >
          <PlusCircle size={16} />
          Đăng tin ngay
        </Link>
      )}
    </div>
  );
};

export default EmptyPostState;
