import type { Metadata } from 'next';
import MessagesPage from '@/components/features/messages/MessagesPage';

export const metadata: Metadata = {
  title: 'Tin nhắn | Lụm',
  description: 'Trao đổi với người mua và người bán ngay trên Lụm.',
};

export default function TinNhanPage() {
  return <MessagesPage />;
}
