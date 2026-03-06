import RoleManagePage from '@/components/features/admin/role/RoleManagePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý Phân quyền | Lụm Admin',
};

export default function PhanQuyenPage() {
  return <RoleManagePage />;
}
