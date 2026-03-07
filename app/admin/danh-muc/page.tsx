import type { Metadata } from 'next';
import CategoryManagePage from '@/components/features/admin/category/CategoryManagePage';

export const metadata: Metadata = {
  title: 'Quản lý Danh mục | Lụm Admin',
};

export default function DanhMucPage() {
  return <CategoryManagePage />;
}
