import Image from 'next/image';
import { Conversation } from '@/types/messages';
import { formatMessageTime, getConversationLastMessage } from '@/lib/mockMessages';

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: (conversationId: number) => void;
}

const ConversationListItem = ({
  conversation,
  isActive,
  onClick,
}: ConversationListItemProps) => {
  const lastMessage = getConversationLastMessage(conversation);
  const isOwnMessage = lastMessage.senderId === 1;

  return (
    <button
      onClick={() => onClick(conversation.id)}
      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
        isActive
          ? 'bg-emerald-50 border-emerald-200 shadow-sm'
          : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Image
            src={conversation.participant.avatar}
            alt={conversation.participant.name}
            width={44}
            height={44}
            className="rounded-full object-cover border border-gray-200"
          />
          {conversation.participant.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{conversation.participant.name}</p>
            <span className="ml-auto text-xs text-gray-400 shrink-0">
              {formatMessageTime(lastMessage.sentAt)}
            </span>
          </div>

          <p className="text-xs text-gray-500 truncate mt-0.5">{conversation.relatedPost.title}</p>

          <div className="mt-1.5 flex items-center gap-2">
            <p className="text-sm text-gray-600 truncate flex-1">
              {isOwnMessage ? 'Bạn: ' : ''}
              {lastMessage.content}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="shrink-0 min-w-5 h-5 px-1 rounded-full bg-emerald-600 text-white text-[11px] font-semibold flex items-center justify-center">
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationListItem;
