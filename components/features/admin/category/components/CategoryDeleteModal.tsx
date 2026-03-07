'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';

interface CategoryDeleteModalProps {
  name: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CategoryDeleteModal({
  name,
  loading,
  onCancel,
  onConfirm,
}: CategoryDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Xóa danh mục</h3>
            <p className="text-xs text-gray-500">Hành động này không thể hoàn tác.</p>
          </div>
        </div>

        <div className="px-6 py-4 text-sm text-gray-700">
          Bạn có chắc chắn muốn xóa danh mục <strong>{name}</strong>?
        </div>

        <div className="px-6 pb-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
