import type { Metadata } from 'next';
import ProductMetaManagePage from '@/components/features/admin/product-meta/ProductMetaManagePage';

export const metadata: Metadata = {
  title: 'Thông số, Thuộc tính & Tags | Lụm Admin',
};

export default function ThongSoThuocTinhTagsPage() {
  return <ProductMetaManagePage />;
}
