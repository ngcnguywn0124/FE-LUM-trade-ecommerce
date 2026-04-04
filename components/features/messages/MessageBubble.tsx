import { useState, useEffect } from 'react';
import { Check, CheckCheck, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { ChatMessage } from '@/types/messages';
import ImageModal from './ImageModal';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  displayTime: string;
  senderAvatar?: string;
  recipientAvatar?: string;
  onRetry?: (message: ChatMessage) => void;
}

const MessageBubble = ({ message, isOwnMessage, displayTime, senderAvatar, recipientAvatar, onRetry }: MessageBubbleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageClick = (idx: number) => {
    setInitialIndex(idx);
    setIsModalOpen(true);
  };

  const statusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Loader2 size={12} className="text-gray-300 animate-spin" />;
      case 'sent':
        return <Check size={12} className="text-gray-300" />;
      case 'delivered':
        return <CheckCheck size={12} className="text-gray-300" />;
      case 'seen':
        return <CheckCheck size={12} className="text-emerald-300" />;
      case 'error':
        return <AlertCircle size={12} className="text-red-400" />;
      default:
        return <Check size={12} className="text-gray-300" />;
    }
  };

  return (
    <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && (
        <div className="shrink-0 mb-1 w-7 h-7">
          {senderAvatar && (
            <Image
              src={senderAvatar}
              alt="Avatar"
              width={28}
              height={28}
              className="rounded-full border border-gray-100 object-cover w-full h-full"
            />
          )}
        </div>
      )}
      <div
        className={`max-w-[70%] md:max-w-[60%] overflow-visible ${message.status === 'sending' ? 'opacity-70' : ''}`}
      >
        {message.images && message.images.length > 0 ? (
          <div className="flex flex-col gap-1">
            <div className={`relative flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-center pt-2 px-1 mb-2 h-36 md:h-40`}>
              {message.images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  className={`
                    absolute overflow-hidden rounded-xl border-2 border-white shadow-md 
                    w-32 h-32 md:w-36 md:h-36 transition-all hover:scale-105 hover:z-50 cursor-pointer
                    ${message.status === 'error' ? 'grayscale opacity-50' : ''}
                  `}
                  style={{
                    zIndex: 40 - idx,
                    transform: `rotate(${idx % 2 === 0 ? '-2deg' : '2deg'})`,
                    [isOwnMessage ? 'right' : 'left']: `${idx * 16}px`
                  }}
                  onClick={() => handleImageClick(idx)}
                >
                  <img
                    src={img}
                    alt={`Sent image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 3 && message.images!.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                      +{message.images!.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={`flex items-center gap-1.5 px-1 text-[11px] text-gray-400 font-medium ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              {message.status === 'error' && (
                <button
                  onClick={() => onRetry?.(message)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 cursor-pointer"
                >
                  <RotateCcw size={10} />
                  <span>Gửi lại</span>
                </button>
              )}
              <span className="text-emerald-600 font-bold">{message.images.length} ảnh</span>
              <span className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
              <span>{displayTime}</span>
              {isOwnMessage && statusIcon()}
            </div>

            <ImageModal
              images={message.images}
              initialIndex={initialIndex}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        ) : (
          <div className="relative group">
            <div className={`px-3 py-2 shadow-sm rounded-2xl ${isOwnMessage
                ? message.status === 'error' ? 'bg-red-50 text-red-900 border border-red-100' : 'bg-emerald-600 text-white'
                : 'bg-white text-gray-800 border border-gray-100'
              } ${isOwnMessage
                ? senderAvatar ? 'rounded-br-md' : 'rounded-br-2xl'
                : senderAvatar ? 'rounded-bl-md' : 'rounded-bl-2xl'
              } transition-opacity`}>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap wrap-break-word`}>
                {message.content}
              </p>

              <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${isOwnMessage ? 'justify-end text-emerald-100' : 'text-gray-400'}`}>
                {message.status === 'error' && <span className="text-red-500 font-bold">Lỗi</span>}
                <span>{displayTime}</span>
                {isOwnMessage && statusIcon()}
              </div>
            </div>

            {isOwnMessage && message.status === 'error' && (
              <button
                onClick={() => onRetry?.(message)}
                className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                title="Thử gửi lại"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        )}

        {/* Read Receipt Avatar (Small avatar of recipient when message is seen) */}
        {isOwnMessage && message.status === 'seen' && recipientAvatar && (
          <div className="flex justify-end mt-1 px-1">
            <div className="w-4 h-4 rounded-full overflow-hidden border border-white shadow-sm">
              <img
                src={recipientAvatar}
                alt="seen by"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
