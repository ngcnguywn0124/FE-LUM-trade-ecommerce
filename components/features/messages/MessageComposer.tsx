import { SendHorizonal } from 'lucide-react';

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const MessageComposer = ({ value, onChange, onSubmit }: MessageComposerProps) => {
  return (
    <form onSubmit={onSubmit} className="p-2.5 border-t border-gray-100 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={1}
          placeholder="Nhập tin nhắn..."
          className="flex-1 resize-none rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white transition-all max-h-24"
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
          className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span>Gửi</span>
        </button>
      </div>
      <p className="mt-1 text-[10px] text-gray-400 text-center sm:text-left px-1">Nhấn Enter để gửi</p>
    </form>
  );
};

export default MessageComposer;
