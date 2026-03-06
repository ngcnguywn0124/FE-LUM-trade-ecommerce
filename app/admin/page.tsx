import AdminDashboard from '@/components/features/admin/AdminDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Lụm',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
