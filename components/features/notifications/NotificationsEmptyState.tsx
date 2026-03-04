'use client';

import Link from 'next/link';
import { BellOff } from 'lucide-react';

interface NotificationsEmptyStateProps {
  compact?: boolean;
}

const NotificationsEmptyState = ({ compact = false }: NotificationsEmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center ${
        compact ? 'px-4 py-8' : 'px-6 py-14'
      }`}
    >
      <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600">
        <BellOff size={20} />
      </span>
      <h3 className="text-base font-semibold text-gray-900">Bạn chưa có thông báo mới</h3>
      <p className="mt-1 max-w-md text-sm text-gray-500">Khi có tin nhắn, cập nhật tin đăng hoặc thay đổi hệ thống, bạn sẽ thấy tại đây.</p>
      {!compact && (
        <Link
          href="/"
          className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Khám phá sản phẩm
        </Link>
      )}
    </div>
  );
};

export default NotificationsEmptyState;
