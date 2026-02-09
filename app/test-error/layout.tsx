import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lỗi hệ thống',
  description: 'Trang hiển thị lỗi của hệ thống Lụm',
};

export default function TestErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
