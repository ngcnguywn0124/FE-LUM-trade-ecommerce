'use client';

import React from 'react';
import Image from 'next/image';
import { ManagedPost, PostStatus } from '@/types/manage-posts';
import {
  Eye, Heart, MessageCircle, RefreshCw,
  Edit2, Clock, Images, CheckCircle2,AlertCircle
} from 'lucide-react';
import PostActionMenu from './PostActionMenu';

// ─── Status badge config ─────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  active: {
    label: 'Đang hiển thị',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Đang duyệt',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  expired: {
    label: 'Hết hạn',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: 'bg-orange-400',
  },
  hidden: {
    label: 'Đã ẩn',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
  sold: {
    label: 'Đã bán',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-400',
  },
  admin_hidden: {
    label: 'Vi phạm',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
};

const CONDITION_LABELS: Record<ManagedPost['condition'], string> = {
  new: 'Mới 100%',
  'like_new': 'Như mới',
  used: 'Đã dùng',
  old: 'Cũ',
  broken: 'Hỏng',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getDaysLeft(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatPill = ({
  icon: Icon,
  value,
  title,
}: {
  icon: React.ElementType;
  value: number;
  title: string;
}) => (
  <span className="flex items-center gap-1 text-xs text-gray-500" title={title}>
    <Icon size={13} className="shrink-0" />
    {value.toLocaleString('vi-VN')}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
interface PostManageCardProps {
  post: ManagedPost;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  openMenuId: string | null;
  onToggleMenu: (id: string) => void;
  onCloseMenu: () => void;
  onEdit: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRenew: (id: string) => void;
  onMarkAsSold: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onView: (slug?: string, id?: string) => void;
}

const PostManageCard: React.FC<PostManageCardProps> = ({
  post,
  isSelected,
  onSelect,
  openMenuId,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onToggleVisibility,
  onRenew,
  onMarkAsSold,
  onDeleteRequest,
  onView,
}) => {
  const status = STATUS_CONFIG[post.status];
  const daysLeft = getDaysLeft(post.expiresAt);
  const isExpired = post.status === 'expired';
  const isUrgent = post.status === 'active' && daysLeft <= 3;

  return (
    <div
      className={`
        group relative bg-white rounded-2xl border transition-all duration-200
        ${isSelected
          ? 'border-emerald-400 shadow-md shadow-emerald-100 ring-1 ring-emerald-400/30'
          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
        }
        ${isExpired ? 'opacity-70' : ''}
      `}
    >
      {/* ── Selection Checkbox (always visible, but visible top-left) ── */}
      <div className="absolute top-3 left-3 z-10">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(post.id, e.target.checked)}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150
              ${isSelected
                ? 'bg-emerald-500 border-emerald-500'
                : 'bg-white/90 border-gray-300 opacity-0 group-hover:opacity-100'
              }
            `}
          >
            {isSelected && <CheckCircle2 size={13} className="text-white" strokeWidth={2.5} />}
          </div>
        </label>
      </div>

      {/* ── Urgent / Expiry warning ribbon ── */}
      {isUrgent && (
        <div className="absolute top-0 right-12 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-b-md z-10">
          Hết hạn sau {daysLeft} ngày!
        </div>
      )}

      <div className="flex gap-3 p-3.5">
        {/* ── Thumbnail ── */}
        <button
          onClick={() => onView(post.slug, post.id)}
          className="relative shrink-0 w-24 h-24 sm:w-25 sm:h-25 rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100px"
          />
          {post.imageCount > 1 && (
            <div className="absolute bottom-1 right-1 flex items-center gap-0.5 bg-black/60 text-white rounded-md px-1 py-0.5">
              <Images size={10} />
              <span className="text-[10px] font-medium">{post.imageCount}</span>
            </div>
          )}
          {/* Overlay for expired/hidden/admin_hidden */}
          {(post.status === 'expired' || post.status === 'hidden' || post.status === 'admin_hidden') && (
            <div className={`absolute inset-0 flex items-center justify-center ${
              post.status === 'admin_hidden' 
                ? (post.previousStatus === 'pending' ? 'bg-amber-900/40' : 'bg-rose-900/40') 
                : 'bg-black/30'
            }`}>
              <span className="text-white text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded backdrop-blur-[2px]">
                {post.status === 'expired' 
                  ? 'Hết hạn' 
                  : post.status === 'admin_hidden' 
                    ? (post.previousStatus === 'pending' ? 'Cảnh báo' : 'Vi phạm') 
                    : 'Đã ẩn'}
              </span>
            </div>
          )}
        </button>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top row: title + menu */}
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={() => onView(post.slug, post.id)}
              className="flex-1 min-w-0 text-left"
            >
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-emerald-700 transition-colors cursor-pointer">
                {post.title}
              </h3>
            </button>
            <div className="shrink-0 mt-0.5 mr-0.5">
              <PostActionMenu
                post={post}
                isOpen={openMenuId === post.id}
                onToggle={() => onToggleMenu(post.id)}
                onClose={onCloseMenu}
                onEdit={onEdit}
                onToggleVisibility={onToggleVisibility}
                onRenew={onRenew}
                onMarkAsSold={onMarkAsSold}
                onDelete={onDeleteRequest}
                onView={onView}
              />
            </div>
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {/* Status badge */}
            {post.status === 'admin_hidden' && post.previousStatus === 'pending' ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Cảnh báo vi phạm
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            )}
            {/* Condition */}
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {CONDITION_LABELS[post.condition]}
            </span>
          </div>

          {/* Price */}
          <div className="mt-1.5">
            {post.isFree ? (
              <span className="text-sm font-bold text-emerald-600">Miễn phí</span>
            ) : (
              <span className="text-sm font-bold text-rose-600">
                {post.price}
              </span>
            )}
          </div>

          {/* Stats + Expiry row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            {/* Stats pills */}
            <div className="flex items-center gap-3">
              <StatPill icon={Eye} value={post.stats.views} title="Lượt xem" />
              <StatPill icon={Heart} value={post.stats.favorites} title="Yêu thích" />
              <StatPill icon={MessageCircle} value={post.stats.messages} title="Tin nhắn" />
            </div>

            {/* Expiry */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              <span>
                {isExpired
                  ? `Hết hạn ${formatDate(post.expiresAt)}`
                  : `Đến ${formatDate(post.expiresAt)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Action Footer ── */}
      <div className="border-t border-gray-100 px-3.5 py-2 flex items-center gap-2">
        {((post.status !== 'sold' && post.status !== 'expired' && post.status !== 'hidden' && post.status !== 'admin_hidden') || 
         (post.status === 'admin_hidden' && post.previousStatus === 'pending')) && (
          <button
            onClick={() => onEdit(post.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 size={13} />
            Chỉnh sửa
          </button>
        )}
        {post.status === 'admin_hidden' ? (
           <div className="flex items-center gap-1.5 flex-1 group/tooltip relative">
              {post.previousStatus === 'pending' ? (
                 <>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 cursor-help transition-colors hover:bg-amber-100">
                       <AlertCircle size={14} className="shrink-0" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-20 shadow-xl border border-gray-800">
                       <div className="font-bold mb-1 flex items-center gap-1 text-amber-400">
                          <AlertCircle size={10} />
                          THÔNG BÁO ADMIN
                       </div>
                       Tin đăng của bạn có nội dung chưa phù hợp. Vui lòng chỉnh sửa lại để hệ thống có thể duyệt bài.
                       <div className="absolute top-full left-6 -mt-1 border-8 border-transparent border-t-gray-900" />
                    </div>
                 </>
              ) : (
                 <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-50 text-rose-600 px-2 py-1 rounded border border-rose-100">Tin vi phạm</span>
              )}
           </div>
        ) : post.status === 'hidden' && (
           <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100 italic">Tin đang ẩn</span>
           </div>
        )}
        {post.status === 'expired' && (
          <button
            onClick={() => onRenew(post.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            Gia hạn {post.renewedCount > 0 && `(${post.renewedCount}/3)`}
          </button>
        )}
        <div className="flex-1" />
        <span className="text-xs text-gray-400">
          Đăng {formatDate(post.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default PostManageCard;
