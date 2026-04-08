import PostBlogForm from '@/components/features/blog/PostBlogForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chỉnh sửa bài viết | Admin Dashboard',
  description: 'Cập nhật nội dung bài viết trên Lụm.vn',
};

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50/50 pt-6">
      <PostBlogForm blogId={id} />
    </main>
  );
}
