'use client';

import React, { useRef, useEffect } from 'react';
import { ManagedPost } from '@/types/manage-posts';
import {
  Eye, EyeOff, Edit2, RefreshCw, Trash2, ExternalLink, MoreVertical,
} from 'lucide-react';

interface PostActionMenuProps {
  post: ManagedPost;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit: (id: number) => void;
  onToggleVisibility: (id: number) => void; // hide/show
  onRenew: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const PostActionMenu: React.FC<PostActionMenuProps> = ({
  post,
  isOpen,
  onToggle,
  onClose,
  onEdit,
  onToggleVisibility,
  onRenew,
  onDelete,
  onView,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const canRenew = post.status === 'expired' || post.status === 'active';
  const canToggle = post.status === 'active' || post.status === 'hidden';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        title="Thêm hành động"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1">
            <button
              onClick={(e) => { e.stopPropagation(); onView(post.id); onClose(); }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ExternalLink size={15} className="text-gray-400" />
              Xem tin đăng
            </button>

            {post.status !== 'sold' && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(post.id); onClose(); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Edit2 size={15} className="text-gray-400" />
                Chỉnh sửa tin
              </button>
            )}

            {canToggle && (
              <button
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(post.id); onClose(); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {post.status === 'active' ? (
                  <><EyeOff size={15} className="text-gray-400" /> Ẩn tin</>
                ) : (
                  <><Eye size={15} className="text-gray-400" /> Hiện tin</>
                )}
              </button>
            )}

            {canRenew && (
              <button
                onClick={(e) => { e.stopPropagation(); onRenew(post.id); onClose(); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <RefreshCw size={15} className="text-emerald-500" />
                Gia hạn tin
              </button>
            )}

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={(e) => { e.stopPropagation(); onDelete(post.id); onClose(); }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={15} className="text-red-400" />
              Xóa tin đăng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostActionMenu;
