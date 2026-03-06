import UniversityManagePage from '@/components/features/admin/university/UniversityManagePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý Trường & Cơ sở | Lụm Admin',
};

export default function TruongDaiHocPage() {
  return <UniversityManagePage />;
}
