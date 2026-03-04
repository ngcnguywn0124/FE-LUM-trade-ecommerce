import { Conversation } from '@/types/messages';

const now = new Date();

const minutesAgo = (value: number) => new Date(now.getTime() - value * 60 * 1000).toISOString();
const hoursAgo = (value: number) => new Date(now.getTime() - value * 60 * 60 * 1000).toISOString();
const daysAgo = (value: number) => new Date(now.getTime() - value * 24 * 60 * 60 * 1000).toISOString();

export const CURRENT_USER_ID = 1;

export const mockConversations: Conversation[] = [
  {
    id: 101,
    participant: {
      id: 201,
      name: 'Ngọc Trâm',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: true,
      phone: '0987654321',
    },
    relatedPost: {
      id: 301,
      title: 'Laptop Dell Inspiron i5, 16GB RAM',
      price: '9.200.000đ',
      image: '/template.png',
    },
    unreadCount: 2,
    isPinned: true,
    messages: [
      {
        id: 1,
        conversationId: 101,
        senderId: 201,
        content: 'Bạn ơi laptop còn không ạ?',
        sentAt: hoursAgo(3),
        status: 'seen',
      },
      {
        id: 2,
        conversationId: 101,
        senderId: CURRENT_USER_ID,
        content: 'Mình còn nhé, bạn muốn xem máy ở cơ sở nào?',
        sentAt: hoursAgo(2),
        status: 'seen',
      },
      {
        id: 3,
        conversationId: 101,
        senderId: 201,
        content: 'Chiều nay mình qua HUTECH Ung Văn Khiêm được không?',
        sentAt: minutesAgo(18),
        status: 'delivered',
      },
      {
        id: 4,
        conversationId: 101,
        senderId: 201,
        content: 'Nếu ổn bạn gửi mình vài ảnh bàn phím với pin nha.',
        sentAt: minutesAgo(6),
        status: 'delivered',
      },
    ],
  },
  {
    id: 102,
    participant: {
      id: 202,
      name: 'Minh Khang',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: minutesAgo(55),
    },
    relatedPost: {
      id: 302,
      title: 'Giáo trình Kinh tế vi mô - bản mới',
      price: '75.000đ',
      image: '/product/giao-trinh-nnptudm.jpg',
    },
    unreadCount: 0,
    messages: [
      {
        id: 5,
        conversationId: 102,
        senderId: 202,
        content: 'Mình lấy 2 cuốn thì bạn bớt chút được không?',
        sentAt: daysAgo(1),
        status: 'seen',
      },
      {
        id: 6,
        conversationId: 102,
        senderId: CURRENT_USER_ID,
        content: 'Bạn lấy 2 cuốn mình để 130k luôn nha.',
        sentAt: hoursAgo(22),
        status: 'seen',
      },
      {
        id: 7,
        conversationId: 102,
        senderId: 202,
        content: 'Ok bạn, mai mình ghé lấy sau 10h nhé.',
        sentAt: hoursAgo(20),
        status: 'seen',
      },
    ],
  },
  {
    id: 103,
    participant: {
      id: 203,
      name: 'Tuấn Anh',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: hoursAgo(5),
    },
    relatedPost: {
      id: 303,
      title: 'Balo laptop chống nước 15.6 inch',
      price: '220.000đ',
      image: '/template.png',
    },
    unreadCount: 1,
    messages: [
      {
        id: 8,
        conversationId: 103,
        senderId: CURRENT_USER_ID,
        content: 'Balo này còn mới 90%, bạn muốn xem trực tiếp không?',
        sentAt: daysAgo(2),
        status: 'seen',
      },
      {
        id: 9,
        conversationId: 103,
        senderId: 203,
        content: 'Bạn ship nội thành giúp mình được không?',
        sentAt: minutesAgo(42),
        status: 'sent',
      },
    ],
  },
  {
    id: 104,
    participant: {
      id: 204,
      name: 'Tuấn Anh',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: hoursAgo(5),
    },
    relatedPost: {
      id: 304,
      title: 'Balo laptop chống nước 15.6 inch',
      price: '220.000đ',
      image: '/template.png',
    },
    unreadCount: 1,
    messages: [
      {
        id: 8,
        conversationId: 104,
        senderId: CURRENT_USER_ID,
        content: 'Balo này còn mới 90%, bạn muốn xem trực tiếp không?',
        sentAt: daysAgo(2),
        status: 'seen',
      },
      {
        id: 9,
        conversationId: 104,
        senderId: 204,
        content: 'Bạn ship nội thành giúp mình được không?',
        sentAt: minutesAgo(42),
        status: 'sent',
      },
    ],
  },
  {
    id: 105,
    participant: {
      id: 205,
      name: 'Tuấn Anh',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: hoursAgo(5),
    },
    relatedPost: {
      id: 305,
      title: 'Balo laptop chống nước 15.6 inch',
      price: '220.000đ',
      image: '/template.png',
    },
    unreadCount: 1,
    messages: [
      {
        id: 8,
        conversationId: 105,
        senderId: CURRENT_USER_ID,
        content: 'Balo này còn mới 90%, bạn muốn xem trực tiếp không?',
        sentAt: daysAgo(2),
        status: 'seen',
      },
      {
        id: 9,
        conversationId: 105,
        senderId: 205,
        content: 'Bạn ship nội thành giúp mình được không?',
        sentAt: minutesAgo(42),
        status: 'sent',
      },
    ],
  },
  {
    id: 106,
    participant: {
      id: 206,
      name: 'Tuấn Anh',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: hoursAgo(5),
    },
    relatedPost: {
      id: 306,
      title: 'Balo laptop chống nước 15.6 inch',
      price: '220.000đ',
      image: '/template.png',
    },
    unreadCount: 1,
    messages: [
      {
        id: 8,
        conversationId: 106,
        senderId: CURRENT_USER_ID,
        content: 'Balo này còn mới 90%, bạn muốn xem trực tiếp không?',
        sentAt: daysAgo(2),
        status: 'seen',
      },
      {
        id: 9,
        conversationId: 106,
        senderId: 206,
        content: 'Bạn ship nội thành giúp mình được không?',
        sentAt: minutesAgo(42),
        status: 'sent',
      },
    ],
  },
  {
    id: 107,
    participant: {
      id: 207,
      name: 'Tuấn Anh',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: hoursAgo(5),
    },
    relatedPost: {
      id: 307,
      title: 'Balo laptop chống nước 15.6 inch',
      price: '220.000đ',
      image: '/template.png',
    },
    unreadCount: 1,
    messages: [
      {
        id: 8,
        conversationId: 107,
        senderId: CURRENT_USER_ID,
        content: 'Balo này còn mới 90%, bạn muốn xem trực tiếp không?',
        sentAt: daysAgo(2),
        status: 'seen',
      },
      {
        id: 9,
        conversationId: 107,
        senderId: 207,
        content: 'Bạn ship nội thành giúp mình được không?',
        sentAt: minutesAgo(42),
        status: 'sent',
      },
    ],
  },
  {
    id: 108,
    participant: {
      id: 208,
      name: 'Tuấn Anh',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: hoursAgo(5),
    },
    relatedPost: {
      id: 308,
      title: 'Balo laptop chống nước 15.6 inch',
      price: '220.000đ',
      image: '/template.png',
    },
    unreadCount: 1,
    messages: [
      {
        id: 8,
        conversationId: 108,
        senderId: CURRENT_USER_ID,
        content: 'Balo này còn mới 90%, bạn muốn xem trực tiếp không?',
        sentAt: daysAgo(2),
        status: 'seen',
      },
      {
        id: 9,
        conversationId: 108,
        senderId: 208,
        content: 'Bạn ship nội thành giúp mình được không?',
        sentAt: minutesAgo(42),
        status: 'sent',
      },
    ],
  },
  {
    id: 109,
    participant: {
      id: 209,
      name: 'Tuấn Anh',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: hoursAgo(5),
    },
    relatedPost: {
      id: 309,
      title: 'Balo laptop chống nước 15.6 inch',
      price: '220.000đ',
      image: '/template.png',
    },
    unreadCount: 1,
    messages: [
      {
        id: 8,
        conversationId: 109,
        senderId: CURRENT_USER_ID,
        content: 'Balo này còn mới 90%, bạn muốn xem trực tiếp không?',
        sentAt: daysAgo(2),
        status: 'seen',
      },
      {
        id: 9,
        conversationId: 109,
        senderId: 209,
        content: 'Bạn ship nội thành giúp mình được không?',
        sentAt: minutesAgo(42),
        status: 'sent',
      },
    ],
  },
  {
    id: 110,
    participant: {
      id: 210,
      name: 'Tuấn Anh',
      avatar: '/user/avatar-user-profile-default.png',
      isOnline: false,
      lastSeen: hoursAgo(5),
    },
    relatedPost: {
      id: 310,
      title: 'Balo laptop chống nước 15.6 inch',
      price: '220.000đ',
      image: '/template.png',
    },
    unreadCount: 1,
    messages: [
      {
        id: 8,
        conversationId: 110,
        senderId: CURRENT_USER_ID,
        content: 'Balo này còn mới 90%, bạn muốn xem trực tiếp không?',
        sentAt: daysAgo(2),
        status: 'seen',
      },
      {
        id: 9,
        conversationId: 110,
        senderId: 210,
        content: 'Bạn ship nội thành giúp mình được không?',
        sentAt: minutesAgo(42),
        status: 'sent',
      },
    ],
  },
];

export const formatMessageTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày`;

  return date.toLocaleDateString('vi-VN');
};

export const getConversationLastMessage = (conversation: Conversation) => {
  return conversation.messages[conversation.messages.length - 1];
};
