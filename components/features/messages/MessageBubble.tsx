import { Check, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import { ChatMessage } from '@/types/messages';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  displayTime: string;
  senderAvatar?: string;
}

const MessageBubble = ({ message, isOwnMessage, displayTime, senderAvatar }: MessageBubbleProps) => {
  const statusIcon = () => {
    if (message.status === 'seen') {
      return <CheckCheck size={12} className="text-emerald-300" />;
    }

    if (message.status === 'delivered') {
      return <CheckCheck size={12} className="text-gray-300" />;
    }

    return <Check size={12} className="text-gray-300" />;
  };

  return (
    <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <div className="shrink-0 mb-1 w-[28px]">
          {senderAvatar && (
            <Image
              src={senderAvatar}
              alt="Avatar"
              width={28}
              height={28}
              className="rounded-full border border-gray-100 object-cover"
            />
          )}
        </div>
      )}
      <div
        className={`max-w-[82%] md:max-w-[70%] px-3 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-gray-800 border border-gray-100'
        } ${
          isOwnMessage 
            ? senderAvatar ? 'rounded-br-md' : 'rounded-br-2xl' 
            : senderAvatar ? 'rounded-bl-md' : 'rounded-bl-2xl'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>

        <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${isOwnMessage ? 'justify-end text-emerald-100' : 'text-gray-400'}`}>
          <span>{displayTime}</span>
          {isOwnMessage && statusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
