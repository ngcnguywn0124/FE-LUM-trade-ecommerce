'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Clock, X, Handshake, CheckCircle2, XCircle } from 'lucide-react';
import { ConversationTransaction, MessageRelatedPost } from '@/types/messages';

interface ProductSnippetProps {
  product: MessageRelatedPost;
  isSeller: boolean;
  transaction?: ConversationTransaction;
  onBuyerRequest?: () => void;
  onBuyerCancelRequest?: () => void;
  onSellerConfirm?: () => void;
  onSellerReject?: () => void;
}

const ProductSnippet = ({
  product, isSeller, transaction,
  onBuyerRequest, onBuyerCancelRequest, onSellerConfirm, onSellerReject,
}: ProductSnippetProps) => {
  const status = transaction?.status ?? 'idle';

  const renderAction = () => {
    /* ─── IDLE ─── */
    if (status === 'idle') {
      if (isSeller) return null;
      return (
        <button
          onClick={onBuyerRequest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <ShoppingBag size={14} />
          <span className="text-[11px] font-bold">Chốt lụm</span>
        </button>
      );
    }

    /* ─── BUYER REQUESTED ─── */
    if (status === 'buyer_requested') {
      if (isSeller) {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={onSellerReject}
              title="Từ chối"
              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-400 transition-all cursor-pointer"
            >
              <XCircle size={14} />
            </button>
            <button
              onClick={onSellerConfirm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-sm shadow-emerald-200 active:scale-95"
            >
              <CheckCircle2 size={14} />
              <span className="text-[11px] font-bold">Xác nhận bán</span>
            </button>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600">
            <Clock size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-[10px] font-bold">Chờ xác nhận...</span>
          </div>
          <button
            onClick={onBuyerCancelRequest}
            title="Huỷ yêu cầu"
            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-400 transition-all cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      );
    }

    /* ─── IN PROGRESS ─── */
    if (['seller_confirmed', 'meetup_confirmed', 'payment_pending'].includes(status)) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[10px] font-bold text-emerald-700">Đang giao dịch</span>
        </div>
      );
    }

    /* ─── COMPLETED ─── */
    if (status === 'completed') {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-100 border border-emerald-300">
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-700">Đã hoàn tất</span>
        </div>
      );
    }

    /* ─── CANCELLED ─── */
    if (status === 'cancelled') {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200">
            <XCircle size={13} className="text-red-400" />
            <span className="text-[10px] font-bold text-red-500">Đã huỷ</span>
          </div>
          {!isSeller && (
            <button
              onClick={onBuyerRequest}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all cursor-pointer shadow-sm text-[10px] font-bold active:scale-95"
            >
              <ShoppingBag size={12} />
              Thử lại
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  const actionElement = renderAction();

  return (
    <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between gap-3 shadow-xs sticky top-0 z-10 transition-colors">
      {/* Product info */}
      <Link
        href={product.slug ? `/bai-dang/${product.slug}` : `/bai-dang/${product.id}`}
        className="flex items-center gap-3 overflow-hidden group flex-1 cursor-pointer"
        title="Xem chi tiết sản phẩm"
      >
        <div className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-gray-100 group-hover:ring-2 ring-emerald-500/30 transition-all">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h4>
          <p className="text-xs font-bold text-emerald-600">{product.price}</p>
        </div>
      </Link>

      {/* Action area */}
      <div className="shrink-0 flex items-center gap-2">
        {/* Seller idle: mark manually as sold (separate from transaction flow) */}
        {isSeller && status === 'idle' && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer">
            <Handshake size={14} />
            <span className="text-[11px] font-semibold">Đánh dấu đã bán</span>
          </button>
        )}
        {actionElement}
      </div>
    </div>
  );
};

export default ProductSnippet;
