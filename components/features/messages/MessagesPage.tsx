'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircleWarning } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import {
  CURRENT_USER_ID,
  formatMessageTime,
  getConversationLastMessage,
  mockConversations,
} from '@/lib/mockMessages';
import { ChatMessage, Conversation, ConversationTransaction, TransactionPaymentMethod } from '@/types/messages';
import ChatHeader from './ChatHeader';
import ConversationList from './ConversationList';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import EmptyConversationState from './EmptyConversationState';
import ProductSnippet from './ProductSnippet';
import TransactionSystemMessage from './transaction/TransactionSystemMessage';
import TransactionActionCard from './transaction/TransactionActionCard';

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [activeConversationId, setActiveConversationId] = useState<number | null>(
    mockConversations[0]?.id ?? null
  );
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  );

  // ─── Role determination (mock: even id = current user is seller) ───────────
  const isSeller = useMemo(
    () => (activeConversation ? activeConversation.id % 2 === 0 : false),
    [activeConversation]
  );

  // ─── Transaction state helpers ────────────────────────────────────────────

  /** Tạo system message sự kiện giao dịch vào cuối danh sách tin nhắn */
  const addTransactionSystemMessage = useCallback(
    (convId: number, eventType: ChatMessage['transactionEvent'], content: string) => {
      const systemMsg: ChatMessage = {
        id: Date.now(),
        conversationId: convId,
        senderId: CURRENT_USER_ID,
        content,
        sentAt: new Date().toISOString(),
        status: 'seen',
        transactionEvent: eventType,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, systemMsg] } : c
        )
      );
    },
    []
  );

  /** Cập nhật dữ liệu giao dịch cho cuộc hội thoại */
  const updateTransaction = useCallback(
    (convId: number, patch: Partial<ConversationTransaction>) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
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

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    // Khi đổi cuộc hội thoại, cuộn TỨC THÌ (auto) xuống cuối để thấy tin nhắn mới nhất ngay lập tức
    scrollToBottom('auto');
  }, [activeConversationId]);

  useEffect(() => {
    // Khi có tin nhắn mới hoặc gửi ảnh, cuộn mượt (smooth) xuống cuối
    const timer = setTimeout(() => {
      scrollToBottom('smooth');
    }, 100);
    return () => clearTimeout(timer);
  }, [activeConversation?.messages?.length]);

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

  const handleSelectConversation = (conversationId: number) => {
    setActiveConversationId(conversationId);
    setIsMobileChatOpen(true);

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unreadCount: 0,
            }
          : conversation
      )
    );
  };

  const handleSendMessage = (event?: React.FormEvent<HTMLFormElement>, contentOverride?: string) => {
    event?.preventDefault();

    const content = contentOverride ?? draftMessage.trim();
    if (!content || !activeConversationId) {
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now(),
      conversationId: activeConversationId,
      senderId: CURRENT_USER_ID,
      content,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );

    if (!contentOverride) {
      setDraftMessage('');
    }
  };

  const handleImagesSelect = (files: File[]) => {
    if (!activeConversationId) return;

    // Giả lập tạo URL cho nhiều ảnh
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    const newMessage: ChatMessage = {
      id: Date.now(),
      conversationId: activeConversationId,
      senderId: CURRENT_USER_ID,
      content: files.length === 1 ? 'Đã gửi một ảnh' : `Đã gửi ${files.length} ảnh`,
      images: imageUrls,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );
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
                    className="absolute inset-0 px-3 md:px-5 py-4 overflow-y-auto space-y-3"
                  >
                    {activeConversation.messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                        <MessageCircleWarning size={20} className="mb-2" />
                        Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.
                      </div>
                    ) : (
                      activeConversation.messages.map((message, index) => {
                        const prevMessage = activeConversation.messages[index - 1];
                        const nextMessage = activeConversation.messages[index + 1];
                        
                        // Check if we should show a date separator
                        const showDateSeparator = !prevMessage || 
                          new Date(prevMessage.sentAt).toDateString() !== new Date(message.sentAt).toDateString();
                        
                        const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
                        const isOwn = message.senderId === CURRENT_USER_ID;

                        return (
                          <div key={message.id} className="space-y-3">
                            {showDateSeparator && (
                              <div className="flex justify-center my-4">
                                <span className="px-3 py-1 rounded-full bg-gray-100/80 text-[10px] text-gray-500 font-medium backdrop-blur-sm">
                                  {new Date(message.sentAt).toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}

                            {/* Transaction system event → render pill instead of bubble */}
                            {message.transactionEvent ? (
                              <TransactionSystemMessage
                                event={message.transactionEvent}
                                actorName={
                                  isOwn
                                    ? undefined   // resolve from context inside component
                                    : activeConversation.participant.name
                                }
                                sentAt={message.sentAt}
                              />
                            ) : (
                              <MessageBubble
                                message={message}
                                isOwnMessage={isOwn}
                                displayTime={formatMessageTime(message.sentAt)}
                                senderAvatar={
                                  !isOwn && isLastInGroup
                                    ? activeConversation.participant.avatar
                                    : undefined
                                }
                              />
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* ── Transaction Action Card (live, pinned to bottom of chat) ── */}
                    {activeConversation.transaction &&
                      ['seller_confirmed', 'meetup_confirmed', 'payment_pending', 'completed', 'cancelled'].includes(
                        activeConversation.transaction.status
                      ) && (
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
                      )}
                  </div>
                </div>

                <MessageComposer
                  value={draftMessage}
                  onChange={setDraftMessage}
                  onSubmit={handleSendMessage}
                  onQuickAction={(text) => handleSendMessage(undefined, text)}
                  onImagesSelect={handleImagesSelect}
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
