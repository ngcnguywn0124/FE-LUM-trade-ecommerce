import type { Metadata } from 'next';
import BlogCategoryManagement from '@/components/features/admin/blog/BlogCategoryManagement';

export const metadata: Metadata = {
  title: 'Quản lý Danh mục Blog | Admin Dashboard',
  description: 'Giao diện CRUD danh mục blog cho quản trị viên',
};

export default function AdminBlogCategoriesPage() {
  return <BlogCategoryManagement />;
}
