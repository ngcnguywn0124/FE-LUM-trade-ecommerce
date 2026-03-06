import AdminGuard from '@/components/features/admin/AdminGuard';
import AdminShell from '@/components/features/admin/layout/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
