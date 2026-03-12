'use client';

import React, { useRef, useEffect } from 'react';
import { 
  Eye, EyeOff, Trash2, ExternalLink, MoreVertical, 
  CheckCircle, Star, XCircle 
} from 'lucide-react';
import { ProductSummaryDto } from '@/types/product-api';
import { useAuthStore } from '@/stores/authStore';

interface AdminPostActionMenuProps {
  product: ProductSummaryDto;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onApprove: (id: string, title: string) => void;
  onHide: (id: string, title: string) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  onDelete: (id: string, title: string, isHard?: boolean) => void;
}

const AdminPostActionMenu: React.FC<AdminPostActionMenuProps> = ({
  product,
  isOpen,
  onToggle,
  onClose,
  onApprove,
  onHide,
  onToggleFeatured,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const isSuperAdmin = user?.roles.includes('ROLE_SUPER_ADMIN');

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
            {/* View Detail - Always visible */}
            <a 
              href={`/bai-dang/${product.slug || product.productId}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onClose()}
            >
              <ExternalLink size={15} className="text-gray-400" />
              Xem chi tiết
            </a>

            {/* Approve / Unhide */}
            {(product.status === 'pending' || product.status === 'admin_hidden') && (
              <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    onApprove(product.productId, product.title); 
                    onClose(); 
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <CheckCircle size={15} />
                {product.status === 'admin_hidden' ? "Hiện lại tin" : "Duyệt tin"}
              </button>
            )}

            {/* Admin Hide */}
            {(product.status === 'available' || product.status === 'pending') && (
              <button 
                 onClick={(e) => { 
                     e.stopPropagation(); 
                     onHide(product.productId, product.title); 
                     onClose(); 
                 }}
                 className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <XCircle size={15} />
                Ẩn tin (Admin)
              </button>
            )}

            {/* Toggle Featured */}
            <button 
              onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleFeatured(product.productId, product.isFeatured); 
                  onClose(); 
              }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm transition-colors cursor-pointer ${product.isFeatured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Star size={15} fill={product.isFeatured ? 'currentColor' : 'none'} />
              {product.isFeatured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
            </button>

            <div className="h-px bg-gray-100 my-1" />

            {/* Delete */}
            <button 
              onClick={(e) => { 
                  e.stopPropagation(); 
                  onDelete(product.productId, product.title, false); 
                  onClose(); 
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
            >
              <Trash2 size={15} />
              Xóa tin đăng
            </button>

            {/* Hard Delete - Thường dành cho Super Admin quản lý */}
            {isSuperAdmin && (
              <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(product.productId, product.title, true); 
                    onClose(); 
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer font-bold border-t border-gray-100"
              >
                <Trash2 size={15} />
                Xóa vĩnh viễn 
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostActionMenu;
