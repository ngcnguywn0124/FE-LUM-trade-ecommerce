'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { MessageCircleWarning } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { chatService, ChatConversationResponse, ChatMessageResponse } from '@/services/chatService';
import { transactionService, ApiTransactionResponse } from '@/services/transactionService';
import { useNotificationStore } from '@/stores/notificationStore';
import { mapApiTypeToUiType, NotificationItemData } from '@/types/notifications';
import { ChatMessage, Conversation, ConversationTransaction, TransactionPaymentMethod, TransactionStatus, TransactionEventType } from '@/types/messages';
import ChatHeader from './ChatHeader';
import ConversationList from './ConversationList';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import EmptyConversationState from './EmptyConversationState';
import ProductSnippet from './ProductSnippet';
import TransactionSystemMessage from './transaction/TransactionSystemMessage';
import TransactionActionCard from './transaction/TransactionActionCard';

const CHAT_WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8686/ws';

const normalizeId = (value: string | number | null | undefined): string =>
  (value == null ? '' : String(value).trim().toLowerCase());

type PresenceEvent = {
  userId: string;
  online: boolean;
  lastSeenAt?: string | null;
};

const isTempMessageId = (id: string | number): boolean => String(id).startsWith('temp-');

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
    reader.readAsDataURL(file);
  });

const mapDeliveryStatus = (status: string | null | undefined): ChatMessage['status'] => {
  if (!status) return 'sent';
  const normalized = status.toLowerCase();
  if (normalized === 'seen' || normalized === 'read' || normalized === 'đã xem' || normalized === 'đã đọc') return 'seen';
  if (normalized === 'delivered' || normalized === 'đã nhận') return 'delivered';
  return 'sent';
};

const mapApiMessage = (message: ChatMessageResponse): ChatMessage => {
  const images = (message.messageType === 'image' || message.messageType === 'images')
    ? (message.content?.includes('|') ? message.content.split('|') : [message.content || message.attachmentUrl || ''])
    : undefined;

  return {
    id: message.messageId,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content || '',
    sentAt: message.createdAt,
    status: mapDeliveryStatus(message.deliveryStatus),
    images: images && images.length > 0 && images[0] !== '' ? images : undefined,
    transactionEvent: message.transactionEventType
      ? (message.transactionEventType.toLowerCase() as ChatMessage['transactionEvent'])
      : undefined,
  };
};

const getConversationLastMessage = (conversation: Conversation): ChatMessage | undefined => {
  return conversation.messages?.at(-1);
};

const getLastMessageTimestamp = (conversation: Conversation): number => {
  const last = getConversationLastMessage(conversation);
  const sentAt = last?.sentAt;
  const t = sentAt ? Date.parse(sentAt) : Number.NaN;
  return Number.isFinite(t) ? t : 0;
};

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const mapApiConversation = (conversation: ChatConversationResponse): Conversation => {
  const fallbackTime = conversation.lastMessageAt || conversation.joinedAt || new Date().toISOString();

  // Only create preview if there is no real message history known yet
  const previewMessage: ChatMessage = {
    id: `preview-${conversation.conversationId}`,
    conversationId: conversation.conversationId,
    senderId: conversation.otherUserId,
    content: conversation.lastMessagePreview || 'Bắt đầu cuộc trò chuyện',
    sentAt: fallbackTime,
    status: 'sent',
    // If it's an image preview, we might want to flag it or just let it be text
  };

  return {
    id: conversation.conversationId,
    participant: {
      id: conversation.otherUserId,
      name: conversation.otherUserName || 'Người dùng',
      avatar: conversation.otherUserAvatarUrl || '/user/avatar-user-profile-default.png',
      isOnline: Boolean(conversation.otherUserOnline),
      lastSeen: conversation.otherUserLastSeenAt || undefined,
      sellerPhone: conversation.sellerPhone || undefined,
    },
    relatedPost: {
      id: conversation.productId || `product-${conversation.conversationId}`,
      slug: conversation.productSlug || undefined,
      title: conversation.productTitle || 'Sản phẩm',
      price: conversation.productPrice != null
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(conversation.productPrice))
        : 'Giá liên hệ',
      image: conversation.productImageUrl || '/template.png',
      sellerId: conversation.sellerId || '',
    },
    messages: [previewMessage],
    unreadCount: conversation.isUnread ? 1 : 0,
    isPinned: conversation.isPinned,
    transaction: conversation.transactionId ? {
      id: conversation.transactionId,
      status: (conversation.transactionStatus as ConversationTransaction['status']) || 'buyer_requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } : undefined
  };
};

/** Map ApiTransactionResponse → ConversationTransaction để cập nhật local state */
const mapApiTxToConversationTx = (tx: ApiTransactionResponse): ConversationTransaction => ({
  id: tx.transactionId,
  status: tx.status,
  agreedPrice: tx.agreedPrice != null ? String(tx.agreedPrice) : undefined,
  meetupLocation: tx.meetupLocation ?? undefined,
  meetupTime: tx.meetupTime ?? undefined,
  paymentMethod: (tx.paymentMethod as TransactionPaymentMethod) ?? undefined,
  shippingMethod: tx.shippingMethod ?? undefined,
  buyerConfirmedMeetup: tx.buyerConfirmedMeetup,
  sellerConfirmedMeetup: tx.sellerConfirmedMeetup,
  buyerConfirmedPayment: tx.buyerConfirmedPayment,
  sellerConfirmedPayment: tx.sellerConfirmedPayment,
  cancellationReason: tx.cancellationReason ?? undefined,
  cancelledBy: tx.cancelledBy ?? undefined,
  notes: tx.notes ?? undefined,
  createdAt: tx.createdAt,
  updatedAt: tx.updatedAt,
});

const MessagesPage = () => {
  const { user } = useAuthStore();
  const { setTotalUnreadCount } = useChatStore();
  const { addRealtimeNotification } = useNotificationStore();
  const currentUserId = user?.userId || '';
  const wsClientRef = useRef<Client | null>(null);
  const loadedConversationIdsRef = useRef<Set<string>>(new Set());
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [activeConversationId, setActiveConversationId] = useState<string | number | null>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, { userId: string; timestamp: number }>>({});
  const [hasMoreMessages, setHasMoreMessages] = useState<Record<string, boolean>>({});
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => normalizeId(conversation.id) === normalizeId(activeConversationId)) ?? null,
    [conversations, activeConversationId]
  );

  // ─── Role determination ──────────────────────────────────────────────────
  const isSeller = useMemo(() => {
    if (!activeConversation || !currentUserId) return false;
    const postSellerId = normalizeId(activeConversation.relatedPost.sellerId);
    return postSellerId === normalizeId(currentUserId);
  }, [activeConversation, currentUserId]);

  // ─── Transaction state helpers ────────────────────────────────────────────

  /** Tạo system message sự kiện giao dịch vào cuối danh sách tin nhắn */
  const addTransactionSystemMessage = useCallback(
    (convId: string | number, eventType: ChatMessage['transactionEvent'], content: string) => {
      const systemMsg: ChatMessage = {
        id: Date.now(),
        conversationId: convId,
        senderId: currentUserId,
        content,
        sentAt: new Date().toISOString(),
        status: 'seen',
        transactionEvent: eventType,
      };
      setConversations((prev) =>
        prev.map((c) =>
          normalizeId(c.id) === normalizeId(convId) ? { ...c, messages: [...c.messages, systemMsg] } : c
        )
      );
    },
    [currentUserId]
  );

  /** Cập nhật dữ liệu giao dịch cho cuộc hội thoại */
  const updateTransaction = useCallback(
    (convId: string | number, patch: Partial<ConversationTransaction>) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (normalizeId(c.id) !== normalizeId(convId)) return c;
          const existing: ConversationTransaction = c.transaction ?? {
            id: '',
            status: 'idle' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            ...c,
            transaction: { ...existing, ...patch, updatedAt: new Date().toISOString() },
          };
        })
      );
    },
    []
  );

  // ─── Transaction handlers ─────────────────────────────────────────────────

  /** Tạo giao dịch mới qua API và cập nhật local state */
  const handleBuyerRequest = useCallback(async () => {
    if (!activeConversationId || !activeConversation || isSubmittingTransaction) return;
    const productId = String(activeConversation.relatedPost.id);
    setIsSubmittingTransaction(true);
    try {
      const tx = await transactionService.createTransaction(currentUserId, { productId });
      updateTransaction(activeConversationId, mapApiTxToConversationTx(tx));
      addTransactionSystemMessage(activeConversationId, 'buyer_requested', '🛒 Bạn đã gửi yêu cầu mua');
    } catch (err: any) {
      console.error('createTransaction failed:', err);
    } finally {
      setIsSubmittingTransaction(false);
    }
  }, [activeConversationId, activeConversation, isSubmittingTransaction, currentUserId, updateTransaction, addTransactionSystemMessage]);

  const handleBuyerCancelRequest = useCallback(async () => {
    if (!activeConversationId || !activeConversation?.transaction?.id) return;
    const txId = activeConversation.transaction.id;
    try {
      const tx = await transactionService.updateTransactionStatus(currentUserId, txId, {
        status: 'cancelled',
        cancellationReason: 'Người mua đã huỷ yêu cầu',
      });
      updateTransaction(activeConversationId, mapApiTxToConversationTx(tx));
      addTransactionSystemMessage(activeConversationId, 'cancelled', 'Bạn đã huỷ yêu cầu mua');
    } catch (err) {
      console.error('cancelTransaction failed:', err);
    }
  }, [activeConversationId, activeConversation, currentUserId, updateTransaction, addTransactionSystemMessage]);

  const handleSellerConfirm = useCallback(async () => {
    if (!activeConversationId || !activeConversation?.transaction?.id) return;
    const txId = activeConversation.transaction.id;
    try {
      const tx = await transactionService.updateTransactionStatus(currentUserId, txId, {
        status: 'seller_confirmed',
      });
      updateTransaction(activeConversationId, mapApiTxToConversationTx(tx));
      addTransactionSystemMessage(activeConversationId, 'seller_confirmed', 'Giao dịch đã được xác nhận!');
    } catch (err) {
      console.error('sellerConfirm failed:', err);
    }
  }, [activeConversationId, activeConversation, currentUserId, updateTransaction, addTransactionSystemMessage]);

  const handleSellerReject = useCallback(async () => {
    if (!activeConversationId || !activeConversation?.transaction?.id) return;
    const txId = activeConversation.transaction.id;
    try {
      const tx = await transactionService.updateTransactionStatus(currentUserId, txId, {
        status: 'cancelled',
        cancellationReason: 'Người bán từ chối yêu cầu',
      });
      updateTransaction(activeConversationId, mapApiTxToConversationTx(tx));
      addTransactionSystemMessage(activeConversationId, 'cancelled', 'Người bán đã từ chối yêu cầu');
    } catch (err) {
      console.error('sellerReject failed:', err);
    }
  }, [activeConversationId, activeConversation, currentUserId, updateTransaction, addTransactionSystemMessage]);

  const handleSellerSetMeetup = useCallback(
    async (location: string, time: string, price?: number) => {
      if (!activeConversationId || !activeConversation?.transaction?.id) return;
      const txId = activeConversation.transaction.id;
      const currentStatus = activeConversation.transaction.status;
      try {
        // Nếu đã ở seller_confirmed rồi, chỉ cập nhật meetup local (không cần gọi API thêm)
        // bắt buộc gọi API với seller_confirmed khi chưa có location (lần confirm đầu tiên)
        if (currentStatus === 'seller_confirmed' && activeConversation.transaction.meetupLocation) {
          // Đã confirm rồi và đã có location: chỉ cập nhật local state, không đổi status
          updateTransaction(activeConversationId, { meetupLocation: location, meetupTime: time, agreedPrice: price?.toString() });
        } else {
          // Lần đầu tiên gửi đề xuất: gọi API với meetupLocation và agreedPrice đính kèm
          const tx = await transactionService.updateTransactionStatus(currentUserId, txId, {
            status: 'seller_confirmed',
            meetupLocation: location,
            meetupTime: time,
            agreedPrice: price,
          });
          updateTransaction(activeConversationId, mapApiTxToConversationTx(tx));
        }
      } catch {
        // Fallback: cập nhật local thôi
        updateTransaction(activeConversationId, { meetupLocation: location, meetupTime: time, agreedPrice: price?.toString() });
      }
    },
    [activeConversationId, activeConversation, currentUserId, updateTransaction]
  );

  const handleBuyerConfirmMeetup = useCallback(
    async (paymentMethod: TransactionPaymentMethod) => {
      if (!activeConversationId || !activeConversation?.transaction?.id) return;
      const txId = activeConversation.transaction.id;
      try {
        const tx = await transactionService.updateTransactionStatus(currentUserId, txId, {
          status: 'meetup_confirmed',
          paymentMethod,
        });
        updateTransaction(activeConversationId, { ...mapApiTxToConversationTx(tx), paymentMethod });
        if (tx.status === 'meetup_confirmed') {
          addTransactionSystemMessage(activeConversationId, 'meetup_confirmed', 'Hai bên đã xác nhận thông tin gặp mặt');
        }
      } catch {
        updateTransaction(activeConversationId, { buyerConfirmedMeetup: true, paymentMethod });
      }
    },
    [activeConversationId, activeConversation, currentUserId, updateTransaction, addTransactionSystemMessage]
  );

  const handleBuyerConfirmPayment = useCallback(async () => {
    if (!activeConversationId || !activeConversation?.transaction?.id) return;
    const txId = activeConversation.transaction.id;
    try {
      const tx = await transactionService.updateTransactionStatus(currentUserId, txId, {
        status: 'completed',
      });
      updateTransaction(activeConversationId, mapApiTxToConversationTx(tx));
      if (tx.status === 'completed') {
        addTransactionSystemMessage(activeConversationId, 'completed', 'Giao dịch hoàn tất!');
      }
    } catch {
      updateTransaction(activeConversationId, { buyerConfirmedPayment: true });
    }
  }, [activeConversationId, activeConversation, currentUserId, updateTransaction, addTransactionSystemMessage]);

  const handleSellerConfirmPayment = useCallback(async () => {
    if (!activeConversationId || !activeConversation?.transaction?.id) return;
    const txId = activeConversation.transaction.id;
    try {
      const tx = await transactionService.updateTransactionStatus(currentUserId, txId, {
        status: 'completed',
      });
      updateTransaction(activeConversationId, mapApiTxToConversationTx(tx));
      if (tx.status === 'completed') {
        addTransactionSystemMessage(activeConversationId, 'completed', 'Giao dịch hoàn tất!');
      }
    } catch {
      updateTransaction(activeConversationId, { sellerConfirmedPayment: true });
    }
  }, [activeConversationId, activeConversation, currentUserId, updateTransaction, addTransactionSystemMessage]);

  const handleCancelTransaction = useCallback(async (reason?: string | React.MouseEvent | any) => {
    if (!activeConversationId || !activeConversation?.transaction?.id) return;
    const txId = activeConversation.transaction.id;
    // Đảm bảo reason thực sự là chuỗi
    const finalReason = (typeof reason === 'string' && reason.trim().length > 0) ? reason : 'Huỷ giao dịch';
    try {
      const tx = await transactionService.updateTransactionStatus(currentUserId, txId, {
        status: 'cancelled',
        cancellationReason: finalReason,
      });
      updateTransaction(activeConversationId, mapApiTxToConversationTx(tx));
      addTransactionSystemMessage(activeConversationId, 'cancelled', 'Giao dịch đã bị huỷ');
    } catch {
      updateTransaction(activeConversationId, { status: 'cancelled' });
      addTransactionSystemMessage(activeConversationId, 'cancelled', 'Giao dịch đã bị huỷ');
    }
  }, [activeConversationId, activeConversation, currentUserId, updateTransaction, addTransactionSystemMessage]);

  const loadMessagesForConversation = useCallback(
    async (
      conversationId: string | number,
      options?: { force?: boolean; page?: number; isLoadMore?: boolean }
    ) => {
      if (!currentUserId) return;

      const normalizedConversationId = normalizeId(conversationId);
      const forceReload = Boolean(options?.force);
      const isLoadMore = Boolean(options?.isLoadMore);
      const pageIndex = options?.page ?? 0;

      // Prevent redundant loads or loads when no more messages
      if (
        !normalizedConversationId ||
        (!forceReload && !isLoadMore && loadedConversationIdsRef.current.has(normalizedConversationId)) ||
        (isLoadMore && hasMoreMessages[normalizedConversationId] === false)
      ) {
        return;
      }

      if (isLoadMore) setIsLoadingMore(true);

      try {
        const pageSize = 20;
        const page = await chatService.getMessages(
          currentUserId,
          normalizedConversationId,
          pageIndex,
          pageSize
        );

        const newMessages = [...page.content].reverse().map(mapApiMessage);

        setHasMoreMessages((prev) => ({
          ...prev,
          [normalizedConversationId]: !page.last,
        }));

        setCurrentPages((prev) => ({
          ...prev,
          [normalizedConversationId]: pageIndex,
        }));

        if (scrollContainerRef.current) {
          prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
        }

        setConversations((prev) =>
          prev.map((conversation) =>
            normalizeId(conversation.id) === normalizedConversationId
              ? {
                ...conversation,
                messages: (() => {
                  if (isLoadMore) {
                    // Avoid duplicates when prepending
                    const existingIds = new Set(conversation.messages.map((m) => normalizeId(m.id)));
                    const filteredNew = newMessages.filter((m) => !existingIds.has(normalizeId(m.id)));
                    return [...filteredNew, ...conversation.messages];
                  }

                  // Original logic for first load/refresh
                  const serverMessageIds = new Set(newMessages.map((message) => normalizeId(message.id)));
                  const localOnlyMessages = conversation.messages.filter((message) => {
                    const localMessageId = normalizeId(message.id);
                    return (
                      (isTempMessageId(localMessageId) || !serverMessageIds.has(localMessageId)) &&
                      !String(localMessageId).startsWith('preview-')
                    );
                  });

                  const merged = [...newMessages, ...localOnlyMessages];
                  return merged.sort(
                    (first, second) =>
                      new Date(first.sentAt).getTime() - new Date(second.sentAt).getTime()
                  );
                })(),
              }
              : conversation
          )
        );

        if (!isLoadMore) {
          loadedConversationIdsRef.current.add(normalizedConversationId);
        }

        // Fix 4: Sau khi load messages, fetch transaction detail nếu conversation đang có transaction
        // để đảm bảo buyer/seller luôn có đủ dữ liệu (meetupLocation, agreedPrice...)
        setConversations((prevConvs) => {
          const conv = prevConvs.find((c) => normalizeId(c.id) === normalizedConversationId);
          if (conv?.transaction?.id && currentUserId) {
            void transactionService.getTransactionDetail(currentUserId, conv.transaction.id)
              .then((tx) => updateTransaction(normalizedConversationId, mapApiTxToConversationTx(tx)))
              .catch(() => undefined);
          }
          return prevConvs; // không thay đổi state ở đây, chỉ trigger side effect
        });
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        if (isLoadMore) setIsLoadingMore(false);
      }
    },
    [currentUserId]
  );

  const loadConversations = useCallback(async () => {
    if (!currentUserId) return;

    const page = await chatService.getConversations(currentUserId, 0, 50);
    const mapped = page.content.map(mapApiConversation);

    setConversations(mapped);
    loadedConversationIdsRef.current.clear();

    if (mapped.length === 0) {
      setActiveConversationId(null);
      return;
    }

    const firstConvId = mapped[0].id;
    setActiveConversationId((prev) => {
      const targetId = prev ? prev : firstConvId;
      // Auto-load messages for the initial active conversation
      void loadMessagesForConversation(targetId, { force: true }).catch(() => undefined);
      return targetId;
    });
  }, [currentUserId, loadMessagesForConversation]);

  const handleIncomingSocketMessage = useCallback(
    async (payload: string) => {
      try {
        const parsed = JSON.parse(payload) as ChatMessageResponse;
        if (!parsed?.conversationId || !parsed?.messageId) return;

        const incomingMessage = mapApiMessage(parsed);
        const incomingConversationId = normalizeId(parsed.conversationId);
        const isActive = normalizeId(activeConversationId) === incomingConversationId;
        const currentUserIdNormalized = normalizeId(currentUserId);
        const isFromMe = normalizeId(incomingMessage.senderId) === currentUserIdNormalized;
        let conversationFound = false;

        setConversations((prev) => {
          const next = prev.map((conversation) => {
            if (normalizeId(conversation.id) !== incomingConversationId) {
              return conversation;
            }

            conversationFound = true;
            // If background conversation gets a message, trigger initial load to ensure history is ready
            if (!isActive && !loadedConversationIdsRef.current.has(incomingConversationId)) {
              void loadMessagesForConversation(incomingConversationId, { force: true }).catch(() => undefined);
            }

            const alreadyExists = conversation.messages.some(
              (message) => normalizeId(message.id) === normalizeId(incomingMessage.id)
            );

            // Logic to find and replace temp message if this is from me
            let updatedMessages = conversation.messages;
            if (isFromMe && !alreadyExists) {
              // Find a temp message from me with same content
              const tempMessageIndex = updatedMessages.findLastIndex(
                (m) => isTempMessageId(m.id) &&
                  normalizeId(m.senderId) === currentUserIdNormalized &&
                  m.content === incomingMessage.content
              );

              if (tempMessageIndex !== -1) {
                // Replace temp message with real one to prevent jumping/flicker
                updatedMessages = [
                  ...updatedMessages.slice(0, tempMessageIndex),
                  incomingMessage,
                  ...updatedMessages.slice(tempMessageIndex + 1)
                ];
              } else {
                updatedMessages = [...updatedMessages.filter(m => !String(m.id).startsWith('preview-')), incomingMessage];
              }
            } else if (!alreadyExists) {
              updatedMessages = [...updatedMessages.filter(m => !String(m.id).startsWith('preview-')), incomingMessage];
            }

            updatedMessages = [...updatedMessages].sort(
              (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );

            // Real-time Transaction Status Sync
            let updatedTransaction = conversation.transaction;
            
            // Dùng transactionEvent (đã được map bởi mapApiMessage) để đồng bộ trạng thái giao dịch
            const eventType = incomingMessage.transactionEvent;
            
            if (eventType) {
              // Đọc transaction fields từ `parsed` (raw WebSocket payload - có đầy đủ fields từ backend)
              updatedTransaction = {
                ...(conversation.transaction || {
                  id: parsed.transactionId || '',
                  createdAt: new Date().toISOString(),
                }),
                id: parsed.transactionId || conversation.transaction?.id || '',
                status: (parsed.transactionStatus || eventType) as TransactionStatus,
                meetupLocation: parsed.meetupLocation ?? conversation.transaction?.meetupLocation,
                meetupTime: parsed.meetupTime ?? conversation.transaction?.meetupTime,
                agreedPrice: parsed.agreedPrice != null ? String(parsed.agreedPrice) : conversation.transaction?.agreedPrice,
                buyerConfirmedMeetup: parsed.buyerConfirmedMeetup ?? conversation.transaction?.buyerConfirmedMeetup,
                sellerConfirmedMeetup: parsed.sellerConfirmedMeetup ?? conversation.transaction?.sellerConfirmedMeetup,
                buyerConfirmedPayment: parsed.buyerConfirmedPayment ?? conversation.transaction?.buyerConfirmedPayment,
                sellerConfirmedPayment: parsed.sellerConfirmedPayment ?? conversation.transaction?.sellerConfirmedPayment,
                updatedAt: new Date().toISOString(),
              };
            }


            return {
              ...conversation,
              messages: updatedMessages,
              unreadCount: isActive ? 0 : (conversation.unreadCount || 0) + (isFromMe ? 0 : 1),
              transaction: updatedTransaction,
            };
          });

          return conversationFound ? next : prev;
        });

        // Browser handles auto-scrolling to visual bottom (scrollTop 0) in flex-col-reverse naturally
        // when prepending new items to the DOM.

        if (!conversationFound) {
          await loadConversations();
        }

        // Real-time Seen: If active chat and message is from OTHER person, mark as read immediately
        if (isActive && !isFromMe && currentUserIdNormalized) {
          void chatService.markAsRead(currentUserIdNormalized, incomingConversationId).catch(() => undefined);
        }
      } catch {
        // ignore malformed messages
      }
    },
    [activeConversationId, currentUserId, loadConversations, loadMessagesForConversation]
  );

  const handleIncomingStatusUpdate = useCallback((statusUpdate: any) => {
    const updates = Array.isArray(statusUpdate) ? statusUpdate : [statusUpdate];

    setConversations((prev) =>
      prev.map((conv) => {
        const currentUserIdNormalized = normalizeId(currentUserId);
        const convUpdates = updates.filter(u => normalizeId(u.conversationId) === normalizeId(conv.id));
        if (convUpdates.length === 0) return conv;

        // Check if it's a conversation-wide "seen" update by the OTHER user
        const isSeenByOther = convUpdates.some(u =>
          u.status === 'seen' && !u.messageId && normalizeId(u.userId) !== currentUserIdNormalized
        );

        return {
          ...conv,
          messages: conv.messages.map((m) => {
            // If conversation-wide seen by OTHER, update all 'sent' or 'delivered' messages from ME to 'seen'
            if (isSeenByOther && normalizeId(m.senderId) === currentUserIdNormalized) {
              if (m.status !== 'seen' && !isTempMessageId(m.id)) {
                return { ...m, status: 'seen' as const };
              }
            }

            // Otherwise check for specific message ID updates
            const specificUpdate = convUpdates.find(u => normalizeId(u.messageId) === normalizeId(m.id));
            if (specificUpdate) {
              return { ...m, status: mapDeliveryStatus(specificUpdate.status) };
            }

            return m;
          }),
        };
      })
    );
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    loadConversations().catch(() => {
      setConversations([]);
      setActiveConversationId(null);
    });
  }, [currentUserId, loadConversations]);

  useEffect(() => {
    if (!activeConversationId) return;

    loadMessagesForConversation(activeConversationId).catch(() => {
      // keep existing messages if fetch fails
    });
  }, [activeConversationId, loadMessagesForConversation]);

  useEffect(() => {
    if (!currentUserId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(CHAT_WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        'user-id': currentUserId,
      },
    });

    client.onConnect = () => {
      client.subscribe('/user/queue/messages', (message) => {
        void handleIncomingSocketMessage(message.body);
      });

      // Fallback khi /user/queue không hoạt động ổn định qua proxy/ngrok
      client.subscribe(`/topic/user-${currentUserId}`, (message) => {
        void handleIncomingSocketMessage(message.body);
      });

      // Fallback status topic
      client.subscribe(`/topic/user-${currentUserId}/status`, (message) => {
        try {
          const statusUpdate = JSON.parse(message.body);
          handleIncomingStatusUpdate(statusUpdate);
        } catch { /* ignore */ }
      });

      // Real-time notifications
      client.subscribe(`/topic/user-${currentUserId}/notifications`, (message) => {
        try {
          const n = JSON.parse(message.body);
          if (!n?.notificationId) return;
          const item: NotificationItemData = {
            id: n.notificationId,
            type: mapApiTypeToUiType(n.notificationType ?? 'system'),
            apiType: n.notificationType ?? 'system',
            title: n.title ?? '',
            content: n.content ?? '',
            createdAt: n.createdAt ?? new Date().toISOString(),
            isRead: false,
            actorId: n.actorId ?? null,
            actorName: n.actorName ?? null,
            actorAvatar: n.actorAvatarUrl ?? null,
            targetHref: n.targetHref ?? null,
            image: n.imageUrl ?? null,
            relatedEntityType: n.relatedEntityType ?? null,
            relatedEntityId: n.relatedEntityId ?? null,
          };
          addRealtimeNotification(item);
        } catch { /* ignore malformed */ }
      });

      // Presence: online/offline + last seen
      client.subscribe('/topic/presence', (message) => {
        try {
          const evt = JSON.parse(message.body) as PresenceEvent;
          const changedUserId = normalizeId(evt.userId);
          if (!changedUserId) return;

          setConversations((prev) =>
            prev.map((conv) => {
              if (normalizeId(conv.participant.id) !== changedUserId) return conv;
              return {
                ...conv,
                participant: {
                  ...conv.participant,
                  isOnline: Boolean(evt.online),
                  lastSeen: evt.lastSeenAt ?? conv.participant.lastSeen,
                },
              };
            })
          );
        } catch {
          // ignore malformed
        }
      });

      // Lắng nghe sự kiện cập nhật trạng thái tin nhắn (đã nhận/đã xem)
      client.subscribe('/user/queue/status', (message) => {
        try {
          const statusUpdate = JSON.parse(message.body);
          handleIncomingStatusUpdate(statusUpdate);
        } catch (err) {
          // ignore malformed updates
        }
      });

      // Lắng nghe sự kiện đang soạn tin nhắn (typing)
      client.subscribe('/user/queue/typing', (message) => {
        try {
          const data = JSON.parse(message.body);
          const { conversationId, userId, isTyping } = data;

          if (normalizeId(userId) === normalizeId(currentUserId)) return;

          setTypingUsers(prev => {
            const next = { ...prev };
            if (isTyping) {
              next[normalizeId(conversationId)] = { userId, timestamp: Date.now() };
            } else {
              delete next[normalizeId(conversationId)];
            }
            return next;
          });
        } catch (err) {
          // ignore
        }
      });
    };

    client.onStompError = () => {
      // ignore, auto reconnect will retry
    };

    client.activate();
    wsClientRef.current = client;

    return () => {
      if (wsClientRef.current) {
        wsClientRef.current.deactivate();
        wsClientRef.current = null;
      }
    };
  }, [currentUserId, handleIncomingSocketMessage, handleIncomingStatusUpdate]);

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (scrollContainerRef.current) {
      // In flex-col-reverse, visual bottom is scrollTop: 0
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior,
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    // Với flex-col-reverse, cuộn lên trên (để tải thêm) tương đương với việc cuộn xuống dưới cùng của scrollHeight
    const isAtTopVisual = Math.abs(container.scrollTop) + container.clientHeight >= container.scrollHeight - 5;

    if (isAtTopVisual && !isLoadingMore && activeConversationId) {
      const convId = normalizeId(activeConversationId);
      const currentPage = currentPages[convId] ?? 0;
      const hasMore = hasMoreMessages[convId] !== false;

      if (hasMore) {
        void loadMessagesForConversation(convId, {
          isLoadMore: true,
          page: currentPage + 1,
        });
      }
    }
  };

  useEffect(() => {
    // Với flex-col-reverse, trình duyệt tự động giữ vị trí cuộn ở "bottom" (scrollTop: 0)
    // khi có phần tử mới được thêm vào đầu danh sách (bottom visual).
  }, [activeConversationId]);

  useEffect(() => {
    // Không cần scrollToBottom thủ công nữa
  }, [activeConversation?.messages?.length, currentUserId]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    const matched = conversations.filter((conversation) => {
      // Filter by unread status
      if (filter === 'unread' && (conversation.unreadCount || 0) <= 0) return false;

      if (!normalizedSearch) return true;

      return (
        conversation.participant.name.toLowerCase().includes(normalizedSearch) ||
        conversation.relatedPost.title.toLowerCase().includes(normalizedSearch)
      );
    });

    return matched.sort((first, second) => getLastMessageTimestamp(second) - getLastMessageTimestamp(first));
  }, [conversations, search, filter]);

  const handleSelectConversation = (conversationId: string | number) => {
    const normalizedId = normalizeId(conversationId);
    setActiveConversationId(normalizedId);
    setIsMobileChatOpen(true);

    if (currentUserId) {
      void chatService.markAsRead(currentUserId, normalizedId).catch(() => undefined);

      // Sync unread count to Header
      void (async () => {
        try {
          const count = await chatService.getTotalUnreadCount(currentUserId);
          setTotalUnreadCount(count);
          // Dispatch custom event just in case
          window.dispatchEvent(new CustomEvent('chat-unread-sync', { detail: { count } }));
        } catch (e) { /* ignore */ }
      })();
    }

    void loadMessagesForConversation(normalizedId, { force: true }).catch(() => undefined);

    setConversations((prev) =>
      prev.map((conversation) =>
        normalizeId(conversation.id) === normalizedId
          ? {
            ...conversation,
            unreadCount: 0,
          }
          : conversation
      )
    );
  };

  const handleSendMessage = async (event?: React.FormEvent<HTMLFormElement>, contentOverride?: string) => {
    event?.preventDefault();

    const content = contentOverride ?? draftMessage.trim();
    if (!content || !activeConversationId || !currentUserId) {
      return;
    }

    const conversationId = normalizeId(activeConversationId);
    const tempId = `temp-${Date.now()}`;

    const newMessage: ChatMessage = {
      id: tempId,
      conversationId,
      senderId: currentUserId,
      content,
      sentAt: new Date().toISOString(),
      status: 'sending',
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        normalizeId(conversation.id) === conversationId
          ? {
            ...conversation,
            messages: [...conversation.messages, newMessage],
          }
          : conversation
      )
    );

    if (!contentOverride) {
      setDraftMessage('');
      handleTyping(false);
    }

    try {
      const sent = await chatService.sendMessage(currentUserId, conversationId, {
        messageType: 'text',
        content,
      });
      const sentMessage = mapApiMessage(sent);

      setConversations((prev) =>
        prev.map((conversation) => {
          if (normalizeId(conversation.id) !== conversationId) return conversation;

          const alreadyExists = conversation.messages.some(
            (message) => normalizeId(message.id) === normalizeId(sentMessage.id)
          );

          if (alreadyExists) {
            return {
              ...conversation,
              messages: conversation.messages.filter(m => normalizeId(m.id) !== tempId)
            };
          }

          return {
            ...conversation,
            messages: conversation.messages.map(m =>
              normalizeId(m.id) === tempId ? sentMessage : m
            ),
          };
        })
      );
    } catch {
      setConversations((prev) =>
        prev.map((conversation) => {
          if (normalizeId(conversation.id) !== conversationId) return conversation;
          return {
            ...conversation,
            messages: conversation.messages.map((message) =>
              normalizeId(message.id) === tempId
                ? { ...message, status: 'error' }
                : message
            ),
          };
        })
      );
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (!wsClientRef.current || !activeConversationId || !currentUserId) return;

    wsClientRef.current.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({
        conversationId: activeConversationId,
        userId: currentUserId,
        isTyping,
      }),
    });
  };

  const handleImagesSelect = async (files: File[]) => {
    if (!activeConversationId || !currentUserId || files.length === 0) return;

    const conversationId = normalizeId(activeConversationId);
    const dataUrls: string[] = [];

    // 1. Convert all files to data URLs
    for (const file of files) {
      try {
        const dataUrl = await fileToDataUrl(file);
        dataUrls.push(dataUrl);
      } catch (err) {
        console.error('Failed to convert file to dataUrl:', err);
      }
    }

    if (dataUrls.length === 0) return;

    // 2. Create a single temp message for all images
    const tempId = `temp-images-${Date.now()}`;
    const tempImageMessage: ChatMessage = {
      id: tempId,
      conversationId,
      senderId: currentUserId,
      content: '',
      images: dataUrls,
      sentAt: new Date().toISOString(),
      status: 'sending',
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        normalizeId(conversation.id) === conversationId
          ? {
            ...conversation,
            messages: [...conversation.messages, tempImageMessage],
          }
          : conversation
      )
    );

    try {
      // 3. Send as a single message with type 'images'
      const sent = await chatService.sendMessage(currentUserId, conversationId, {
        messageType: 'images',
        content: '',
        attachmentUrl: dataUrls.join('|'),
      });

      const sentMessage = mapApiMessage(sent);

      setConversations((prev) =>
        prev.map((conversation) => {
          if (normalizeId(conversation.id) !== conversationId) return conversation;

          const alreadyExists = conversation.messages.some(
            (message) => normalizeId(message.id) === normalizeId(sentMessage.id)
          );

          if (alreadyExists) {
            return {
              ...conversation,
              messages: conversation.messages.filter(m => normalizeId(m.id) !== tempId)
            };
          }

          return {
            ...conversation,
            messages: conversation.messages.map(m =>
              normalizeId(m.id) === tempId ? sentMessage : m
            ),
          };
        })
      );
    } catch {
      setConversations((prev) =>
        prev.map((conversation) => {
          if (normalizeId(conversation.id) !== conversationId) return conversation;
          return {
            ...conversation,
            messages: conversation.messages.map((message) =>
              normalizeId(message.id) === tempId
                ? { ...message, status: 'error' }
                : message
            ),
          };
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 pt-18 bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 w-full max-w-7xl mx-auto flex overflow-hidden lg:p-4">
        <div className="flex w-full overflow-hidden bg-white lg:rounded-2xl border border-gray-100">
          <div className={`${isMobileChatOpen ? 'hidden lg:block' : 'block'} border-r border-gray-100 w-full lg:w-80 xl:w-96 shrink-0`}>
            <ConversationList
              conversations={filteredConversations}
              activeConversationId={activeConversationId}
              searchValue={search}
              filter={filter}
              onSearchChange={setSearch}
              onFilterChange={setFilter}
              onConversationSelect={handleSelectConversation}
            />
          </div>

          <section
            className={`
              ${isMobileChatOpen ? 'flex' : 'hidden lg:flex'}
              flex-col flex-1 bg-white overflow-hidden
            `}
          >
            {!activeConversation ? (
              <EmptyConversationState />
            ) : (
              <>
                <ChatHeader
                  conversation={activeConversation}
                  isMobile={isMobileChatOpen}
                  isSeller={isSeller}
                  onBack={() => setIsMobileChatOpen(false)}
                />

                <ProductSnippet
                  product={activeConversation.relatedPost}
                  isSeller={isSeller}
                  transaction={activeConversation.transaction}
                  onBuyerRequest={handleBuyerRequest}
                  onBuyerCancelRequest={handleBuyerCancelRequest}
                  onSellerConfirm={handleSellerConfirm}
                  onSellerReject={handleSellerReject}
                />

                <div className="relative flex-1 overflow-hidden">
                  {/* Background Image with Opacity */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-10 bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: 'url("/user/avatar-user-profile-default.png")' }}
                  />

                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="absolute inset-0 px-3 md:px-5 py-2 overflow-y-auto flex flex-col-reverse"
                  >
                    {activeConversationId && (
                      <>
                        {/* Identify the LAST seen message from current user to show ONLY one avatar marker */}
                        {(() => {
                          const messagesFromMe = activeConversation.messages.filter(m => normalizeId(m.senderId) === normalizeId(currentUserId));
                          const lastSeenMessageId = messagesFromMe.findLast(m => m.status === 'seen')?.id;

                          return (
                            <>
                              {/* 1. Typing Indicator at the literal visual BOTTOM (First in DOM order for col-reverse) */}
                              {typingUsers[normalizeId(activeConversationId)] && (
                                <div className="flex items-center gap-2 text-gray-400 text-xs italic ml-12 mb-2 shrink-0">
                                  <div className="flex gap-1 p-2.5 bg-gray-100 rounded-2xl rounded-bl-sm">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.6s]" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                                  </div>
                                </div>
                              )}

                              {[...activeConversation.messages].reverse().map((message, index, reversedArr) => {
                                const nextMessage = reversedArr[index - 1]; // Message that came AFTER this one
                                const prevMessage = reversedArr[index + 1]; // Message that came BEFORE this one

                                const showDateSeparator = !prevMessage ||
                                  new Date(prevMessage.sentAt).toDateString() !== new Date(message.sentAt).toDateString();

                                const isLastInGroup = !nextMessage || normalizeId(nextMessage.senderId) !== normalizeId(message.senderId);
                                const isOwn = normalizeId(message.senderId) === normalizeId(currentUserId);
                                const isLastSeenMarker = isOwn && lastSeenMessageId && normalizeId(message.id) === normalizeId(lastSeenMessageId);

                                return (
                                  <div key={message.id} className="mb-3">
                                    {showDateSeparator && (
                                      <div className="flex justify-center my-4">
                                        <span className="px-3 py-1 rounded-full bg-gray-100/80 text-[10px] text-gray-500 font-medium whitespace-nowrap">
                                          {new Date(message.sentAt).toLocaleDateString('vi-VN', {
                                            weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
                                          })}
                                        </span>
                                      </div>
                                    )}
                                    {message.transactionEvent ? (
                                      <TransactionSystemMessage
                                        event={message.transactionEvent}
                                        actorName={isOwn ? undefined : activeConversation.participant.name}
                                        sentAt={message.sentAt}
                                      />
                                    ) : (
                                      <MessageBubble
                                        message={message}
                                        isOwnMessage={isOwn}
                                        displayTime={formatMessageTime(message.sentAt)}
                                        senderAvatar={!isOwn && isLastInGroup ? activeConversation.participant.avatar : undefined}
                                        recipientAvatar={isLastSeenMarker ? activeConversation.participant.avatar : undefined}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          );
                        })()}

                        {/* 4. Action Card for active transactions */}
                        {activeConversation.transaction &&
                          ['buyer_requested', 'seller_confirmed', 'meetup_confirmed', 'payment_pending', 'completed', 'cancelled'].includes(
                            activeConversation.transaction.status
                          ) && (
                            <div className="my-2 order-last"> {/* Pushes it further "up" in the history visual */}
                              <TransactionActionCard
                                key={activeConversation.transaction.updatedAt}
                                transaction={activeConversation.transaction}
                                relatedPost={activeConversation.relatedPost}
                                isSeller={isSeller}
                                sellerName={isSeller ? 'Bạn' : activeConversation.participant.name}
                                buyerName={!isSeller ? 'Bạn' : activeConversation.participant.name}
                                onSellerSetMeetup={handleSellerSetMeetup}
                                onBuyerConfirmMeetup={handleBuyerConfirmMeetup}
                                onBuyerConfirmPayment={handleBuyerConfirmPayment}
                                onSellerConfirmPayment={handleSellerConfirmPayment}
                                onCancel={() => handleCancelTransaction()}
                              />
                            </div>
                          )}

                        {/* 5. Loader for Infinite Scroll at the very end of DOM (visual top) */}
                        {isLoadingMore && (
                          <div className="flex justify-center py-4 shrink-0 order-last">
                            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        {/* Empty state if no messages */}
                        {activeConversation.messages.length === 0 && (
                          <div className="flex flex-col items-center justify-center text-gray-500 text-sm py-20 order-last">
                            <MessageCircleWarning size={20} className="mb-2" />
                            Chưa có tin nhắn nào.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <MessageComposer
                  value={draftMessage}
                  isSeller={isSeller}
                  onChange={setDraftMessage}
                  onSubmit={handleSendMessage}
                  onQuickAction={(text) => handleSendMessage(undefined, text)}
                  onImagesSelect={handleImagesSelect}
                  onTyping={handleTyping}
                />
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
