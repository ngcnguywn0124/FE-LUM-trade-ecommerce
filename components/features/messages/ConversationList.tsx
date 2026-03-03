import { Search } from 'lucide-react';
import { Conversation } from '@/types/messages';
import ConversationListItem from './ConversationListItem';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: number | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onConversationSelect: (conversationId: number) => void;
}

const ConversationList = ({
  conversations,
  activeConversationId,
  searchValue,
  onSearchChange,
  onConversationSelect,
}: ConversationListProps) => {
  return (
    <aside className="w-full h-full bg-white flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Tin nhắn</h1>
        <p className="text-sm text-gray-500 mt-0.5">{conversations.length} cuộc trò chuyện</p>

        <div className="mt-3 h-10 px-3 rounded-xl border border-gray-200 flex items-center gap-2 focus-within:border-emerald-400 focus-within:shadow-sm transition-all">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo tên..."
            className="w-full text-sm bg-transparent outline-none placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-sm text-gray-500 px-6">
            Không tìm thấy cuộc trò chuyện phù hợp.
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={onConversationSelect}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ConversationList;
