'use client';

import React from 'react';
import { Eye, EyeOff, CheckCircle2, Trash2, X, CheckSquare } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkHide: () => void;
  onBulkSold: () => void;
  onBulkDelete: () => void;
  isAllSelected: boolean;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkHide,
  onBulkSold,
  onBulkDelete,
  isAllSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-4 py-3 flex flex-wrap items-center gap-3 animate-in slide-in-from-bottom-4 duration-200">
        {/* Left: count + select all */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onDeselectAll}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Bỏ chọn tất cả"
          >
            <X size={16} />
          </button>
          <span className="text-sm font-semibold">
            Đã chọn <span className="text-[#98FF98]">{selectedCount}</span> tin
          </span>
          {!isAllSelected && (
            <button
              onClick={onSelectAll}
              className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer ml-1 whitespace-nowrap"
            >
              <CheckSquare size={13} />
              Chọn tất cả ({totalCount})
            </button>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onBulkHide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <EyeOff size={14} />
            Ẩn/Hiện
          </button>
          <button
            onClick={onBulkSold}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/80 hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap"
          >
            <CheckCircle2 size={14} />
            Đã bán
          </button>
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Trash2 size={14} />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;
