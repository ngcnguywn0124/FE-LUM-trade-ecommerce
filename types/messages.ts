export type MessageDeliveryStatus = 'sent' | 'delivered' | 'seen';

export interface MessageUser {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  phone?: string;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  sentAt: string;
  status: MessageDeliveryStatus;
}

export interface MessageRelatedPost {
  id: number;
  title: string;
  price: string;
  image: string;
}

export interface Conversation {
  id: number;
  participant: MessageUser;
  relatedPost: MessageRelatedPost;
  messages: ChatMessage[];
  unreadCount: number;
  isPinned?: boolean;
}
