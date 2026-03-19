import axios from 'axios';

export interface ChatConversationResponse {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatarUrl: string | null;
  otherUserOnline?: boolean | null;
  otherUserLastSeenAt?: string | null;
  productId: string | null;
  productTitle: string | null;
  productImageUrl: string | null;
  productSlug: string | null;
  productPrice: number | null;
  sellerId: string | null;
  sellerPhone: string | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  isUnread: boolean;
  unreadCount?: number;
  isPinned: boolean;
  joinedAt: string;
  transactionId?: string | null;
  transactionStatus?: string | null;
}

export interface ChatMessageResponse {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string | null;
  messageType: string;
  content: string;
  attachmentUrl: string | null;
  offerAmount: number | null;
  transactionEventType: string | null;
  deliveryStatus: string | null;
  isEdited: boolean | null;
  createdAt: string;
  // Transaction detail fields (sent via WebSocket event messages)
  transactionId?: string | null;
  transactionStatus?: string | null;
  meetupLocation?: string | null;
  meetupTime?: string | null;
  agreedPrice?: number | null;
  buyerConfirmedMeetup?: boolean | null;
  sellerConfirmedMeetup?: boolean | null;
  buyerConfirmedPayment?: boolean | null;
  sellerConfirmedPayment?: boolean | null;
  isReviewed?: boolean | null;
}

export interface SpringPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CreateConversationPayload {
  targetUserId: string;
  productId?: string;
}

export interface SendMessagePayload {
  conversationId: string;
  messageType?: 'text' | 'image' | 'images' | 'offer';
  content?: string;
  attachmentUrl?: string;
  offerAmount?: number;
}

const chatApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1$/, '')}/api/chat`
    : '/api/chat',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getUserHeader = (userId: string) => ({
  headers: {
    'User-Id': userId,
  },
});

export const chatService = {
  async getConversations(userId: string, page: number = 0, size: number = 20): Promise<SpringPage<ChatConversationResponse>> {
    const response = await chatApiClient.get<SpringPage<ChatConversationResponse>>('/conversations', {
      ...getUserHeader(userId),
      params: { page, size },
    });
    return response.data;
  },

  async createOrGetConversation(userId: string, payload: CreateConversationPayload): Promise<ChatConversationResponse> {
    const response = await chatApiClient.post<ChatConversationResponse>(
      '/conversations',
      payload,
      getUserHeader(userId)
    );
    return response.data;
  },

  async getMessages(userId: string, conversationId: string, page: number = 0, size: number = 50): Promise<SpringPage<ChatMessageResponse>> {
    const response = await chatApiClient.get<SpringPage<ChatMessageResponse>>(
      `/conversations/${conversationId}/messages`,
      {
        ...getUserHeader(userId),
        params: { page, size },
      }
    );
    return response.data;
  },

  async sendMessage(userId: string, conversationId: string, payload: Omit<SendMessagePayload, 'conversationId'>): Promise<ChatMessageResponse> {
    const response = await chatApiClient.post<ChatMessageResponse>(
      `/conversations/${conversationId}/messages`,
      { ...payload, conversationId },
      getUserHeader(userId)
    );
    return response.data;
  },

  async markAsRead(userId: string, conversationId: string): Promise<void> {
    await chatApiClient.put(
      `/conversations/${conversationId}/read`,
      {},
      getUserHeader(userId)
    );
  },

  async getTotalUnreadCount(userId: string): Promise<number> {
    try {
      const response = await chatApiClient.get<number>('/unread-count', getUserHeader(userId));
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch unread count from server, falling back to 0:', error);
      return 0; // Trả về 0 thay vì báo lỗi 500 để không làm treo UI
    }
  },
};
