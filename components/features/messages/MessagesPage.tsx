'use client';

import { useMemo, useState } from 'react';
import { MessageCircleWarning } from 'lucide-react';
import Breadcrumb from '@/components/shared/Breadcrumb';
import {
  CURRENT_USER_ID,
  formatMessageTime,
  getConversationLastMessage,
  mockConversations,
} from '@/lib/mockMessages';
import { ChatMessage, Conversation } from '@/types/messages';
import ChatHeader from './ChatHeader';
import ConversationList from './ConversationList';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import EmptyConversationState from './EmptyConversationState';

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [activeConversationId, setActiveConversationId] = useState<number | null>(
    mockConversations[0]?.id ?? null
  );
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');

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

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  );

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

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = draftMessage.trim();
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

    setDraftMessage('');
  };

  return (
    <div className="fixed inset-0 pt-[72px] bg-gray-50 flex flex-col overflow-hidden">
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

                <div className="relative flex-1 overflow-hidden">
                  {/* Background Image with Opacity */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-10 bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: 'url("/user/avatar-user-profile-default.png")' }}
                  />
                  
                  <div className="absolute inset-0 px-3 md:px-5 py-4 overflow-y-auto space-y-3">
                    {activeConversation.messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                        <MessageCircleWarning size={20} className="mb-2" />
                        Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.
                      </div>
                    ) : (
                      activeConversation.messages.map((message, index) => {
                        const nextMessage = activeConversation.messages[index + 1];
                        const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
                        const isOwn = message.senderId === CURRENT_USER_ID;

                        return (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isOwnMessage={isOwn}
                            displayTime={formatMessageTime(message.sentAt)}
                            senderAvatar={
                              !isOwn && isLastInGroup
                                ? activeConversation.participant.avatar
                                : undefined
                            }
                          />
                        );
                      })
                    )}
                  </div>
                </div>

                <MessageComposer
                  value={draftMessage}
                  onChange={setDraftMessage}
                  onSubmit={handleSendMessage}
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
