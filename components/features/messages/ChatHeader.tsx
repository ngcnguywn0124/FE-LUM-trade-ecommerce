import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Circle, Info, Phone } from 'lucide-react';
import { Conversation } from '@/types/messages';
import { formatMessageTime } from '@/lib/mockMessages';

interface ChatHeaderProps {
  conversation: Conversation;
  isMobile: boolean;
  onBack?: () => void;
}

const ChatHeader = ({ conversation, isMobile, onBack }: ChatHeaderProps) => {
  const [showPhone, setShowPhone] = useState(false);
  const participantStatus = conversation.participant.isOnline
    ? 'Đang hoạt động'
    : `Hoạt động ${conversation.participant.lastSeen ? formatMessageTime(conversation.participant.lastSeen) : 'gần đây'}`;

  return (
    <div className="p-3 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2.5">
        {isMobile && (
          <button
            onClick={onBack}
            className="lg:hidden shrink-0 p-1 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
        )}

        <Link
          href={`/tai-khoan/${conversation.participant.id}`}
          className="flex items-center gap-2.5 group"
        >
          <Image
            src={conversation.participant.avatar}
            alt={conversation.participant.name}
            width={36}
            height={36}
            className="rounded-full border border-gray-100"
          />

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-gray-900 truncate leading-tight group-hover:text-emerald-600 transition-colors">
              {conversation.participant.name}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
              <Circle
                size={7}
                className={conversation.participant.isOnline ? 'text-emerald-500 fill-emerald-500' : 'text-gray-300 fill-gray-300'}
              />
              {participantStatus}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {conversation.participant.phone && (
            <button
              onClick={() => setShowPhone(!showPhone)}
              title={showPhone ? 'Ẩn số điện thoại' : 'Hiện số điện thoại'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100 transition-all cursor-pointer"
            >
              <Phone size={14} className={showPhone ? 'fill-emerald-600' : ''} />
              <span className="text-[11px] font-bold tracking-wide">
                {showPhone ? conversation.participant.phone : 'Gọi điện'}
              </span>
            </button>
          )}

          <button
            title="Thông tin thêm & Báo cáo"
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <Info size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
