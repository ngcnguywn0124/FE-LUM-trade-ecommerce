import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Circle, ExternalLink } from 'lucide-react';
import { Conversation } from '@/types/messages';
import { formatMessageTime } from '@/lib/mockMessages';

interface ChatHeaderProps {
  conversation: Conversation;
  isMobile: boolean;
  onBack?: () => void;
}

const ChatHeader = ({ conversation, isMobile, onBack }: ChatHeaderProps) => {
  const participantStatus = conversation.participant.isOnline
    ? 'Đang hoạt động'
    : `Hoạt động ${conversation.participant.lastSeen ? formatMessageTime(conversation.participant.lastSeen) : 'gần đây'}`;

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-start gap-3">
        {isMobile && (
          <button
            onClick={onBack}
            className="shrink-0 mt-1 p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <Image
          src={conversation.participant.avatar}
          alt={conversation.participant.name}
          width={42}
          height={42}
          className="rounded-full border border-gray-200"
        />

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate">{conversation.participant.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <Circle
              size={9}
              className={conversation.participant.isOnline ? 'text-emerald-500 fill-emerald-500' : 'text-gray-300 fill-gray-300'}
            />
            {participantStatus}
          </p>

          <Link
            href={`/bai-dang/${conversation.relatedPost.id}`}
            className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
          >
            {conversation.relatedPost.title}
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
