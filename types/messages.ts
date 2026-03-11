export type MessageDeliveryStatus = 'sent' | 'delivered' | 'seen';

// ─── Transaction Types ───────────────────────────────────────────────────────

/** Vòng đời trạng thái của một giao dịch trong cuộc hội thoại */
export type TransactionStatus =
  | 'idle'               // Chưa có giao dịch
  | 'buyer_requested'    // Người mua đã nhấn "Chốt lụm", chờ người bán xác nhận
  | 'seller_confirmed'   // Người bán xác nhận → Card giao dịch xuất hiện
  | 'meetup_confirmed'   // Hai bên đã xác nhận thông tin gặp mặt
  | 'payment_pending'    // Chờ xác nhận thanh toán
  | 'completed'          // Giao dịch hoàn tất thành công
  | 'cancelled';         // Huỷ giao dịch

export type TransactionPaymentMethod = 'cash' | 'transfer';

export type TransactionEventType =
  | 'buyer_requested'
  | 'seller_confirmed'
  | 'meetup_confirmed'
  | 'payment_confirmed'
  | 'completed'
  | 'cancelled';

/** Dữ liệu giao dịch gắn theo cuộc hội thoại */
export interface ConversationTransaction {
  id: number;
  status: TransactionStatus;
  agreedPrice?: string;
  meetupLocation?: string;
  meetupTime?: string;
  paymentMethod?: TransactionPaymentMethod;
  /** Trạng thái xác nhận gặp mặt của từng bên */
  buyerConfirmedMeetup?: boolean;
  sellerConfirmedMeetup?: boolean;
  /** Trạng thái xác nhận thanh toán */
  buyerConfirmedPayment?: boolean;
  sellerConfirmedPayment?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Message Types ───────────────────────────────────────────────────────────

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
  images?: string[];
  /** Nếu có → render TransactionSystemMessage thay vì MessageBubble */
  transactionEvent?: TransactionEventType;
}

export interface MessageRelatedPost {
  id: number;
  slug?: string;
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
  /** Dữ liệu giao dịch hiện tại của cuộc hội thoại (nếu có) */
  transaction?: ConversationTransaction;
}
