import React from 'react';
import AdminProductManagement from '@/components/features/admin/products/AdminProductManagement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý tin đăng | Admin Dashboard',
  description: 'Giao diện quản lý tất cả các sản phẩm trên hệ thống LUM',
};

export default function AdminProductsPage() {
  return <AdminProductManagement />;
}
