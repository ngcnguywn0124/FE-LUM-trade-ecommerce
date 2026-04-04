import React from 'react';
import AdminBlogManagement from '@/components/features/admin/blog/AdminBlogManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý Blog | Admin Dashboard',
  description: 'Giao diện duyệt bài viết blog sinh viên trên LUM.VN',
};

export default function AdminBlogPage() {
  return <AdminBlogManagement />;
}
