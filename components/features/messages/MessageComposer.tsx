import { SendHorizonal } from 'lucide-react';

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const MessageComposer = ({ value, onChange, onSubmit }: MessageComposerProps) => {
  return (
    <form onSubmit={onSubmit} className="p-3 md:p-4 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={1}
          placeholder="Nhập tin nhắn..."
          className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:shadow-sm max-h-28"
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
          className="h-11 px-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Gửi</span>
          <SendHorizonal size={17} className="sm:hidden" />
        </button>
      </div>
      <p className="mt-1 text-[11px] text-gray-400">Nhấn Enter để gửi, Shift + Enter để xuống dòng</p>
    </form>
  );
};

export default MessageComposer;
