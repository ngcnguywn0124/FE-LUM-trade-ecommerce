'use client';

import { useEffect, useState } from 'react';
import { Loader2, Tag } from 'lucide-react';
import type { TagResponse } from '@/types/admin';

interface TagFormModalProps {
  initial: TagResponse | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { tagName: string }) => Promise<void>;
}

export default function TagFormModal({
  initial,
  loading = false,
  onClose,
  onSubmit,
}: TagFormModalProps) {
  const [tagName, setTagName] = useState('');

  useEffect(() => {
    setTagName(initial?.tagName ?? '');
  }, [initial]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tagName.trim()) return;
    await onSubmit({ tagName: tagName.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
            <Tag size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {initial ? 'Cập nhật tag' : 'Tạo tag mới'}
            </h3>
            <p className="text-sm text-gray-500">Tag sẽ tự sinh slug theo tên.</p>
          </div>
        </div>

        <div className="px-5 py-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tên tag <span className="text-red-500">*</span>
          </label>
          <input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            maxLength={100}
            placeholder="Ví dụ: laptop-gaming, sách giáo trình..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !tagName.trim()}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {initial ? 'Lưu thay đổi' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
}
