'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { MessageCircleWarning } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { chatService, ChatConversationResponse, ChatMessageResponse } from '@/services/chatService';
import { ChatMessage, Conversation, ConversationTransaction, TransactionPaymentMethod } from '@/types/messages';
import ChatHeader from './ChatHeader';
import ConversationList from './ConversationList';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import EmptyConversationState from './EmptyConversationState';
import ProductSnippet from './ProductSnippet';
import TransactionSystemMessage from './transaction/TransactionSystemMessage';
import TransactionActionCard from './transaction/TransactionActionCard';

const CHAT_WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8686/ws';

const normalizeId = (value: string | number | null | undefined): string => (value == null ? '' : String(value));

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

const getConversationLastMessage = (conversation: Conversation): ChatMessage => {
  return conversation.messages[conversation.messages.length - 1];
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
      isOnline: false,
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
  };
};

const MessagesPage = () => {
  const { user } = useAuthStore();
  const { setTotalUnreadCount } = useChatStore();
  const currentUserId = user?.userId || '';
  const wsClientRef = useRef<Client | null>(null);
  const loadedConversationIdsRef = useRef<Set<string>>(new Set());

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
          const existing = c.transaction ?? {
            id: Date.now(),
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

  const handleBuyerRequest = useCallback(() => {
    if (!activeConversationId) return;
    updateTransaction(activeConversationId, {
      status: 'buyer_requested',
      agreedPrice: activeConversation?.relatedPost.price,
    });
    addTransactionSystemMessage(activeConversationId, 'buyer_requested', 'Bạn đã gửi yêu cầu mua');
  }, [activeConversationId, activeConversation, updateTransaction, addTransactionSystemMessage]);

  const handleBuyerCancelRequest = useCallback(() => {
    if (!activeConversationId) return;
    updateTransaction(activeConversationId, { status: 'cancelled' });
    addTransactionSystemMessage(activeConversationId, 'cancelled', 'Bạn đã huỷ yêu cầu mua');
  }, [activeConversationId, updateTransaction, addTransactionSystemMessage]);

  const handleSellerConfirm = useCallback(() => {
    if (!activeConversationId) return;
    updateTransaction(activeConversationId, { status: 'seller_confirmed' });
    addTransactionSystemMessage(activeConversationId, 'seller_confirmed', 'Giao dịch đã được xác nhận!');
  }, [activeConversationId, updateTransaction, addTransactionSystemMessage]);

  const handleSellerReject = useCallback(() => {
    if (!activeConversationId) return;
    updateTransaction(activeConversationId, { status: 'cancelled' });
    addTransactionSystemMessage(activeConversationId, 'cancelled', 'Người bán đã từ chối yêu cầu');
  }, [activeConversationId, updateTransaction, addTransactionSystemMessage]);

  const handleSellerSetMeetup = useCallback(
    (location: string, time: string) => {
      if (!activeConversationId) return;
      updateTransaction(activeConversationId, { meetupLocation: location, meetupTime: time });
    },
    [activeConversationId, updateTransaction]
  );

  const handleBuyerConfirmMeetup = useCallback(
    (paymentMethod: TransactionPaymentMethod) => {
      if (!activeConversationId) return;
      updateTransaction(activeConversationId, {
        status: 'meetup_confirmed',
        buyerConfirmedMeetup: true,
        paymentMethod,
      });
      addTransactionSystemMessage(activeConversationId, 'meetup_confirmed', 'Hai bên đã xác nhận thông tin gặp mặt');
    },
    [activeConversationId, updateTransaction, addTransactionSystemMessage]
  );

  const handleBuyerConfirmPayment = useCallback(() => {
    if (!activeConversationId) return;
    const tx = activeConversation?.transaction;
    const sellerAlsoConfirmed = tx?.sellerConfirmedPayment;
    updateTransaction(activeConversationId, {
      buyerConfirmedPayment: true,
      status: sellerAlsoConfirmed ? 'completed' : 'payment_pending',
    });
    if (sellerAlsoConfirmed) {
      addTransactionSystemMessage(activeConversationId, 'completed', 'Giao dịch hoàn tất!');
    }
  }, [activeConversationId, activeConversation, updateTransaction, addTransactionSystemMessage]);

  const handleSellerConfirmPayment = useCallback(() => {
    if (!activeConversationId) return;
    const tx = activeConversation?.transaction;
    const buyerAlsoConfirmed = tx?.buyerConfirmedPayment;
    updateTransaction(activeConversationId, {
      sellerConfirmedPayment: true,
      status: buyerAlsoConfirmed ? 'completed' : 'payment_pending',
    });
    if (buyerAlsoConfirmed) {
      addTransactionSystemMessage(activeConversationId, 'completed', 'Giao dịch hoàn tất!');
    }
  }, [activeConversationId, activeConversation, updateTransaction, addTransactionSystemMessage]);

  const handleCancelTransaction = useCallback(() => {
    if (!activeConversationId) return;
    updateTransaction(activeConversationId, { status: 'cancelled' });
    addTransactionSystemMessage(activeConversationId, 'cancelled', 'Giao dịch đã bị huỷ');
  }, [activeConversationId, updateTransaction, addTransactionSystemMessage]);

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

            const updatedMessages = (alreadyExists
              ? conversation.messages
              : [...conversation.messages.filter(m => !String(m.id).startsWith('preview-')), incomingMessage]
            ).sort(
              (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );

            return {
              ...conversation,
              messages: updatedMessages,
              unreadCount: isActive ? 0 : (conversation.unreadCount || 0) + (isFromMe ? 0 : 1),
            };
          });

          return conversationFound ? next : prev;
        });

        if (isActive && !isFromMe && scrollContainerRef.current) {
          // Immediately scroll to bottom when receiving a message in active chat
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }

        if (!conversationFound) {
          await loadConversations();
        }
      } catch {
        // ignore malformed messages
      }
    },
    [activeConversationId, currentUserId, loadConversations, loadMessagesForConversation]
  );

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
    });

    client.onConnect = () => {
      client.subscribe('/user/queue/messages', (message) => {
        void handleIncomingSocketMessage(message.body);
      });

      // Lắng nghe sự kiện cập nhật trạng thái tin nhắn (đã nhận/đã xem)
      client.subscribe('/user/queue/status', (message) => {
        try {
          const statusUpdate = JSON.parse(message.body);
          // statusUpdate có thể là một object {messageId, status...} hoặc list
          const updates = Array.isArray(statusUpdate) ? statusUpdate : [statusUpdate];
          
          setConversations((prev) =>
            prev.map((conv) => {
              const convUpdates = updates.filter(u => normalizeId(u.conversationId) === normalizeId(conv.id));
              if (convUpdates.length === 0) return conv;

              const updateMap = new Map(convUpdates.map(u => [normalizeId(u.messageId), mapDeliveryStatus(u.status)]));

              return {
                ...conv,
                messages: conv.messages.map((m) => {
                  const newStatus = updateMap.get(normalizeId(m.id));
                  return newStatus ? { ...m, status: newStatus } : m;
                }),
              };
            })
          );
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
  }, [currentUserId, handleIncomingSocketMessage]);

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
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

    return matched.sort((first, second) => {
      const firstLastMessage = getConversationLastMessage(first);
      const secondLastMessage = getConversationLastMessage(second);

      return new Date(secondLastMessage.sentAt).getTime() - new Date(firstLastMessage.sentAt).getTime();
    });
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
      status: 'sent',
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

    try {
      const sent = await chatService.sendMessage(currentUserId, conversationId, {
        messageType: 'text',
        content,
      });
      const sentMessage = mapApiMessage(sent);

      setConversations((prev) =>
        prev.map((conversation) => {
          if (normalizeId(conversation.id) !== conversationId) return conversation;

          const withoutTemp = conversation.messages.filter((message) => normalizeId(message.id) !== tempId);
          const alreadyExists = withoutTemp.some(
            (message) => normalizeId(message.id) === normalizeId(sentMessage.id)
          );

          return {
            ...conversation,
            messages: alreadyExists ? withoutTemp : [...withoutTemp, sentMessage],
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
                ? { ...message, status: 'delivered' }
                : message
            ),
          };
        })
      );
    } finally {
      // Small delay before deciding if we need a reload
      // void loadMessagesForConversation(conversationId, { force: true }).catch(() => undefined);
    }

    if (!contentOverride) {
      setDraftMessage('');
      handleTyping(false);
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
      content: dataUrls.join('|'), // Joined by pipe for the frontend to split back into .images
      images: dataUrls,
      sentAt: new Date().toISOString(),
      status: 'sent',
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
      // Use '|' separator for multiple URLs in one string field
      const sent = await chatService.sendMessage(currentUserId, conversationId, {
        messageType: 'images',
        content: '',
        attachmentUrl: dataUrls.join('|'),
      });

      const sentMessage = mapApiMessage(sent);

      setConversations((prev) =>
        prev.map((conversation) => {
          if (normalizeId(conversation.id) !== conversationId) return conversation;

          const withoutTemp = conversation.messages.filter(
            (message) => normalizeId(message.id) !== tempId
          );
          const alreadyExists = withoutTemp.some(
            (message) => normalizeId(message.id) === normalizeId(sentMessage.id)
          );

          return {
            ...conversation,
            messages: alreadyExists ? withoutTemp : [...withoutTemp, sentMessage],
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
                ? { ...message, status: 'delivered' }
                : message
            ),
          };
        })
      );
    } finally {
      // void loadMessagesForConversation(conversationId, { force: true }).catch(() => undefined);
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

                        {/* 2. Last message seen indicator handled in MessageBubble - no need for extra div here unless specific spacing needed */}

                        {/* 3. Messages List (Rendered newest-first) */}
                        {[...activeConversation.messages].reverse().map((message, index, reversedArr) => {
                          const nextMessage = reversedArr[index - 1]; // Message that came AFTER this one
                          const prevMessage = reversedArr[index + 1]; // Message that came BEFORE this one
                          
                          const showDateSeparator = !prevMessage || 
                            new Date(prevMessage.sentAt).toDateString() !== new Date(message.sentAt).toDateString();
                          
                          const isLastInGroup = !nextMessage || normalizeId(nextMessage.senderId) !== normalizeId(message.senderId);
                          const isOwn = normalizeId(message.senderId) === normalizeId(currentUserId);

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
                                  recipientAvatar={activeConversation.participant.avatar}
                                />
                              )}
                            </div>
                          );
                        })}

                        {/* 4. Action Card for active transactions */}
                        {activeConversation.transaction &&
                          ['seller_confirmed', 'meetup_confirmed', 'payment_pending', 'completed', 'cancelled'].includes(
                            activeConversation.transaction.status
                          ) && (
                            <div className="my-2 order-last"> {/* Pushes it further "up" in the history visual */}
                              <TransactionActionCard
                                transaction={activeConversation.transaction}
                                relatedPost={activeConversation.relatedPost}
                                isSeller={isSeller}
                                sellerName={isSeller ? 'Bạn' : activeConversation.participant.name}
                                buyerName={!isSeller ? 'Bạn' : activeConversation.participant.name}
                                onSellerSetMeetup={handleSellerSetMeetup}
                                onBuyerConfirmMeetup={handleBuyerConfirmMeetup}
                                onBuyerConfirmPayment={handleBuyerConfirmPayment}
                                onSellerConfirmPayment={handleSellerConfirmPayment}
                                onCancel={handleCancelTransaction}
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
