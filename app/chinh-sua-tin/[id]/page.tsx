import PostItemPage from '@/components/features/post-item/PostItemPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chỉnh sửa tin đăng | Lụm',
  description: 'Cập nhật thông tin bài đăng của bạn trên Lụm.',
};

export default async function ChinhSuaTinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostItemPage productId={id} />;
}
