import { useState } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import { ChatMessage } from '@/types/messages';
import ImageModal from './ImageModal';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  displayTime: string;
  senderAvatar?: string;
}

const MessageBubble = ({ message, isOwnMessage, displayTime, senderAvatar }: MessageBubbleProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleImageClick = (idx: number) => {
    setInitialIndex(idx);
    setIsModalOpen(true);
  };

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
        <div className="shrink-0 mb-1 w-[28px] h-[28px]">
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
        className={`max-w-[70%] md:max-w-[60%] overflow-visible`}
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
          <div className={`px-3 py-2 shadow-sm rounded-2xl ${
            isOwnMessage
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-800 border border-gray-100'
          } ${
            isOwnMessage 
              ? senderAvatar ? 'rounded-br-md' : 'rounded-br-2xl' 
              : senderAvatar ? 'rounded-bl-md' : 'rounded-bl-2xl'
          }`}>
            <p className={`text-sm leading-relaxed whitespace-pre-wrap wrap-break-word`}>
              {message.content}
            </p>

            <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${isOwnMessage ? 'justify-end text-emerald-100' : 'text-gray-400'}`}>
              <span>{displayTime}</span>
              {isOwnMessage && statusIcon()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
