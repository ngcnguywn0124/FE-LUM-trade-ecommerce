import { NotificationItemData } from '@/types/notifications';

const now = Date.now();

export const mockNotifications: NotificationItemData[] = [
  {
    id: 1,
    type: 'message',
    title: 'Bạn có tin nhắn mới',
    content: 'Ngọc Anh vừa gửi bạn một tin nhắn về sản phẩm “Tai nghe Bluetooth”.',
    createdAt: new Date(now - 8 * 60 * 1000).toISOString(),
    isRead: false,
    actorName: 'Ngọc Anh',
    actorAvatar: '/user/avatar-user-profile-default.png',
    targetLabel: 'Mở chat',
    targetHref: '/tin-nhan',
  },
  {
    id: 2,
    type: 'post',
    title: 'Tin đăng sắp hết hạn',
    content: 'Tin “Sách Giải tích 1” của bạn sẽ hết hạn trong 24 giờ nữa.',
    createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    targetLabel: 'Gia hạn tin',
    targetHref: '/quan-ly-tin-dang',
  },
  {
    id: 3,
    type: 'wishlist',
    title: 'Giá sản phẩm đã giảm',
    content: '“Laptop Dell Latitude 5420” trong tin đã lưu của bạn vừa giảm giá.',
    createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    image: '/product/laptop.png',
    targetLabel: 'Xem sản phẩm',
    targetHref: '/tin-da-luu',
  },
  {
    id: 4,
    type: 'system',
    title: 'Xác minh tài khoản thành công',
    content: 'Tài khoản của bạn đã được xác minh. Bạn có thể đăng tin không giới hạn.',
    createdAt: new Date(now - 7 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 5,
    type: 'message',
    title: 'Tin nhắn chưa phản hồi',
    content: 'Bạn có 2 cuộc trò chuyện chưa phản hồi trong hôm nay.',
    createdAt: new Date(now - 18 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    targetLabel: 'Xem ngay',
    targetHref: '/tin-nhan',
  },
  {
    id: 6,
    type: 'post',
    title: 'Tin đăng đã được duyệt',
    content: 'Tin “Bàn học gấp gọn” của bạn đã được duyệt và hiển thị.',
    createdAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    targetLabel: 'Xem tin',
    targetHref: '/quan-ly-tin-dang',
  },
  {
    id: 7,
    type: 'system',
    title: 'Cập nhật chính sách giao dịch',
    content: 'Lụm đã cập nhật quy định an toàn giao dịch dành cho sinh viên.',
    createdAt: new Date(now - 52 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    targetLabel: 'Xem chi tiết',
    targetHref: '/',
  },
];

export const formatNotificationTime = (isoDate: string) => {
  const diffInMinutes = Math.max(1, Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000));

  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  return new Date(isoDate).toLocaleDateString('vi-VN');
};
