import { useRef, useEffect } from 'react';
import { ImagePlus, SendHorizonal } from 'lucide-react';

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onQuickAction?: (text: string) => void;
  onImagesSelect?: (files: File[]) => void;
}

const QUICK_REPLIES = [
  'Món này còn không bạn?',
  'Có bớt giá không ạ?',
  'Mình hẹn gặp ở cổng trường nhé!',
  'Bạn có ship không?',
];

const MessageComposer = ({ value, onChange, onSubmit, onQuickAction, onImagesSelect }: MessageComposerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Tự động điều chỉnh chiều cao của textarea dựa trên nội dung
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset để tính toán scrollHeight chính xác
      textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 44), 120)}px`;
    }
  }, [value]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onImagesSelect) {
      onImagesSelect(Array.from(files));
    }
    // Reset input to allow selecting same files again if needed
    event.target.value = '';
  };

  return (
    <div className="border-t border-gray-100 bg-white">
      {/* Quick Replies */}
      <div className="flex items-center gap-2 p-2 overflow-x-auto no-scrollbar border-b border-gray-50 bg-gray-50/30">
        {QUICK_REPLIES.map((text) => (
          <button
            key={text}
            onClick={() => onQuickAction?.(text)}
            className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-medium text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-all cursor-pointer shadow-xs"
          >
            {text}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="p-2.5">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleImageClick}
            className="p-2 shrink-0 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-emerald-600 transition-colors cursor-pointer"
            title="Gửi ảnh"
          >
            <ImagePlus size={22} />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={1}
            placeholder="Nhập tin nhắn..."
            className="flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-500 transition-all max-h-30 overflow-y-auto no-scrollbar"
            style={{ 
              msOverflowStyle: 'none', 
              scrollbarWidth: 'none',
              minHeight: '44px',
              lineHeight: '24px'
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const form = event.currentTarget.form;
                if (form) {
                  form.requestSubmit();
                }
              }
            }}
          />

          <button
            type="submit"
            disabled={!value.trim()}
            className="h-11 px-5 shrink-0 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">Gửi</span>
            <SendHorizonal size={18} className="sm:hidden" />
          </button>
        </div>
        <p className="mt-1 ml-12 text-[10px] text-gray-400 font-medium">Nhấn Enter để gửi</p>
      </form>
    </div>
  );
};

export default MessageComposer;
