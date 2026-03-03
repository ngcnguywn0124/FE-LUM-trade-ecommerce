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
  const [activeConversationId, setActiveConversationId] = useState<number | null>(
    mockConversations[0]?.id ?? null
  );
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    const matched = conversations.filter((conversation) => {
      if (!normalizedSearch) return true;

      return (
        conversation.participant.name.toLowerCase().includes(normalizedSearch) ||
        conversation.relatedPost.title.toLowerCase().includes(normalizedSearch)
      );
    });

    return matched.sort((first, second) => {
      const firstLastMessage = getConversationLastMessage(first);
      const secondLastMessage = getConversationLastMessage(second);

      if (Boolean(first.isPinned) !== Boolean(second.isPinned)) {
        return first.isPinned ? -1 : 1;
      }

      return new Date(secondLastMessage.sentAt).getTime() - new Date(firstLastMessage.sentAt).getTime();
    });
  }, [conversations, search]);

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
    <div className="fixed inset-0 pt-[72px] bg-white flex flex-col overflow-hidden">
      <div className="flex-1 w-full max-w-full mx-auto flex overflow-hidden">
        <div className="flex w-full overflow-hidden">
          <div className={`${isMobileChatOpen ? 'hidden lg:block' : 'block'} border-r border-gray-100 w-full lg:w-80 xl:w-96 shrink-0`}>
            <ConversationList
              conversations={filteredConversations}
              activeConversationId={activeConversationId}
              searchValue={search}
              onSearchChange={setSearch}
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

                <div className="px-3 md:px-5 py-4 overflow-y-auto flex-1 space-y-3 bg-linear-to-b from-gray-50/50 to-white">
                  {activeConversation.messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                      <MessageCircleWarning size={20} className="mb-2" />
                      Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.
                    </div>
                  ) : (
                    activeConversation.messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.senderId === CURRENT_USER_ID}
                        displayTime={formatMessageTime(message.sentAt)}
                      />
                    ))
                  )}
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
