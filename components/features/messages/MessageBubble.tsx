import { Check, CheckCheck } from 'lucide-react';
import { ChatMessage } from '@/types/messages';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  displayTime: string;
}

const MessageBubble = ({ message, isOwnMessage, displayTime }: MessageBubbleProps) => {
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
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] md:max-w-[70%] px-3 py-2 rounded-2xl shadow-sm ${
          isOwnMessage
            ? 'bg-emerald-600 text-white rounded-br-md'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
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
