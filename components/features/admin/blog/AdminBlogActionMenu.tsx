'use client';

import React, { useRef, useEffect } from 'react';
import { 
  Eye, Trash2, ExternalLink, MoreVertical, 
  CheckCircle, XCircle 
} from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface AdminBlogActionMenuProps {
  blog: BlogPost;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onApprove: (id: string, title: string) => void;
  onReject: (id: string, title: string) => void;
  onDelete: (id: string, title: string) => void;
  onViewDetail: () => void;
}

const AdminBlogActionMenu: React.FC<AdminBlogActionMenuProps> = ({
  blog,
  isOpen,
  onToggle,
  onClose,
  onApprove,
  onReject,
  onDelete,
  onViewDetail,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const blogId = blog.blogId || blog.id || '';

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        title="Thao tác admin"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onViewDetail(); onClose(); }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Eye size={15} className="text-emerald-500" />
              Xem chi tiết
            </button>

            <a 
              href={`/blog/${blog.slug}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onClose()}
            >
              <ExternalLink size={15} className="text-gray-400" />
              Xem trên web
            </a>

            {blog.status === 'pending' && (
              <>
                <button 
                  onClick={(e) => { 
                      e.stopPropagation(); 
                      onApprove(blogId, blog.title); 
                      onClose(); 
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <CheckCircle size={15} />
                  Duyệt bài
                </button>
                <button 
                   onClick={(e) => { 
                       e.stopPropagation(); 
                       onReject(blogId, blog.title); 
                       onClose(); 
                   }}
                   className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <XCircle size={15} />
                  Từ chối bài
                </button>
              </>
            )}

            <div className="h-px bg-gray-100 my-1" />

            <button 
              onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(blogId, blog.title); 
                  onClose(); 
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
            >
              <Trash2 size={15} />
              Xóa bài viết
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogActionMenu;
