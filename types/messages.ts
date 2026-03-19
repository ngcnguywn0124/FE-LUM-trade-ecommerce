export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'seen' | 'error';

// ─── Transaction Types ───────────────────────────────────────────────────────

/** Vòng đời trạng thái của một giao dịch trong cuộc hội thoại */
export type TransactionStatus =
  | 'idle'               // Chưa có giao dịch
  | 'buyer_requested'    // Người mua đã nhấn "Chốt lụm", chờ người bán xác nhận
  | 'seller_confirmed'   // Người bán xác nhận → Card giao dịch xuất hiện
  | 'meetup_confirmed'   // Hai bên đã xác nhận thông tin gặp mặt
  | 'payment_pending'    // Chờ xác nhận thanh toán
  | 'completed'          // Giao dịch hoàn tất thành công
  | 'cancelled'          // Huỷ giao dịch
  | 'disputed';          // Đang tranh chấp

export type TransactionPaymentMethod = 'cash' | 'transfer';

export type TransactionEventType = TransactionStatus;

/** Dữ liệu giao dịch gắn theo cuộc hội thoại */
export interface ConversationTransaction {
  /** UUID từ API */
  id: string;
  status: TransactionStatus;
  agreedPrice?: string;
  meetupLocation?: string;
  meetupTime?: string;
  paymentMethod?: TransactionPaymentMethod;
  shippingMethod?: string;
  /** Trạng thái xác nhận gặp mặt của từng bên */
  buyerConfirmedMeetup?: boolean;
  sellerConfirmedMeetup?: boolean;
  /** Trạng thái xác nhận thanh toán */
  buyerConfirmedPayment?: boolean;
  sellerConfirmedPayment?: boolean;
  cancellationReason?: string;
  cancelledBy?: string;
  notes?: string;
  isReviewed?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Message Types ───────────────────────────────────────────────────────────

export interface MessageUser {
  id: string | number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  phone?: string;
  sellerPhone?: string;
}

export interface ChatMessage {
  id: string | number;
  conversationId: string | number;
  senderId: string | number;
  content: string;
  sentAt: string;
  status: MessageDeliveryStatus;
  images?: string[];
  /** Nếu có → render TransactionSystemMessage thay vì MessageBubble */
  transactionEvent?: TransactionEventType;
  /** Thông tin transaction đính kèm (cho WebSocket sync) */
  transactionId?: string;
  transactionStatus?: TransactionStatus;
  meetupLocation?: string;
  meetupTime?: string;
  agreedPrice?: number;
  buyerConfirmedMeetup?: boolean;
  sellerConfirmedMeetup?: boolean;
  buyerConfirmedPayment?: boolean;
  sellerConfirmedPayment?: boolean;
}

export interface MessageRelatedPost {
  id: string | number;
  slug?: string;
  title: string;
  price: string;
  image: string;
  sellerId: string;
}

export interface Conversation {
  id: string | number;
  participant: MessageUser;
  relatedPost: MessageRelatedPost;
  messages: ChatMessage[];
  unreadCount: number;
  isPinned?: boolean;
  /** Dữ liệu giao dịch hiện tại của cuộc hội thoại (nếu có) */
  transaction?: ConversationTransaction;
}
