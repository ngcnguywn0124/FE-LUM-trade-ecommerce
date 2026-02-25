'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  count: number; // Number of posts to delete (1 = single, >1 = bulk)
  postTitle?: string; // If single post, show title
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  count,
  postTitle,
  onConfirm,
  onCancel,
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Dismiss on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isBulk = count > 1;
  const label = isBulk ? `${count} tin đăng` : `tin đăng này`;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 text-center mb-2">
            Xác nhận xóa {isBulk ? '' : 'tin đăng'}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 text-center mb-1">
            Bạn có chắc chắn muốn xóa {label}?
          </p>
          {!isBulk && postTitle && (
            <p className="text-sm font-semibold text-gray-800 text-center line-clamp-2 mb-1">
              &ldquo;{postTitle}&rdquo;
            </p>
          )}
          <p className="text-xs text-red-500 text-center mt-2">
            Hành động này không thể hoàn tác.
          </p>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
            >
              Xóa {isBulk ? `(${count})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
