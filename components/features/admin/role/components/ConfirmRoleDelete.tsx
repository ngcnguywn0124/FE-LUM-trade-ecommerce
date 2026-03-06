'use client';

import { Trash2, Loader2 } from 'lucide-react';

interface ConfirmRoleDeleteProps {
  name: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmRoleDelete({
  name,
  loading,
  onConfirm,
  onCancel,
}: ConfirmRoleDeleteProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <div>
          <p className="font-bold text-gray-800">Xác nhận xóa role</p>
          <p className="text-sm text-gray-500 mt-1">
            Xóa role <strong>{name}</strong>? Tất cả người dùng có role này sẽ bị ảnh hưởng.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
