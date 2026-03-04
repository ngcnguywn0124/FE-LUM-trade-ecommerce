import type { Metadata } from 'next';
import NotificationsPage from '@/components/features/notifications/NotificationsPage';

export const metadata: Metadata = {
  title: 'Thông báo | Lụm',
  description: 'Theo dõi tin nhắn, trạng thái tin đăng và các cập nhật mới nhất từ Lụm.',
};

export default function ThongBaoPage() {
  return <NotificationsPage />;
}
