import ManagePostsPage from '@/components/features/manage-posts/ManagePostsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý tin đăng | Lụm',
  description: 'Theo dõi, chỉnh sửa và quản lý tất cả tin đăng của bạn trên Lụm.',
};

export default function QuanLyTinDangPage() {
  return <ManagePostsPage />;
}
