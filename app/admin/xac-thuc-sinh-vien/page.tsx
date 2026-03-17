import type { Metadata } from 'next';
import StudentVerificationManagement from '@/components/features/admin/verifications/StudentVerificationManagement';

export const metadata: Metadata = {
  title: 'Duyệt xác thực sinh viên | Admin Dashboard',
  description: 'Quản trị yêu cầu xác thực sinh viên trên hệ thống LUM',
};

export default function AdminStudentVerificationPage() {
  return <StudentVerificationManagement />;
}
