"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock3,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  PhoneCall,
  Share2,
  Star,
} from "lucide-react";

import { toast } from "sonner";
import { favoriteService } from "@/services/favoriteService";
import { chatService } from "@/services/chatService";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

interface ProductSummaryProps {
  id: string;
  name: string;
  price: string;
  school: string;
  campus?: string;
  postedTime: string;
  infoTags: string[];
  isFavorited?: boolean;
  isNegotiable?: boolean;
  contactPhone?: string | null;
  seller: {
    id?: string | number;
    name: string;
    avatar?: string;
    rating?: number;
    activityStatus?: string;
    totalSales?: number;
    isOnline?: boolean;
    lastSeenAt?: string | null;
  };
}

const ProductSummary = ({
  id,
  name,
  price,
  school,
  campus,
  postedTime,
  infoTags,
  isFavorited = false,
  isNegotiable = true,
  contactPhone,
  seller,
}: ProductSummaryProps) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const parsedPrice = useMemo(() => Number(price.replace(/[^\d]/g, "")) || 0, [price]);
  const sellerRating = (seller.rating ?? 4.5).toFixed(1);
  
  const formatLastSeen = (iso?: string | null) => {
    if (!iso) return "Ngoại tuyến";
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 1) return "Vừa mới truy cập";
    if (minutes < 60) return `Hoạt động ${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hoạt động ${hours} giờ trước`;
    return "Ngoại tuyến";
  };

  const sellerActivityStatus = seller.isOnline ? "Đang hoạt động" : formatLastSeen(seller.lastSeenAt);
  const sellerSoldCount = seller.totalSales ?? 0;
  const sellerProfileHref = seller.id ? `/tai-khoan/${seller.id}` : undefined;
  const [offerPrice, setOfferPrice] = useState(
    parsedPrice ? Math.round(parsedPrice * 0.9) : 100000
  );
  const [shownPhone, setShownPhone] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(isFavorited);
  const [isToggling, setIsToggling] = useState(false);
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu tin");
      return;
    }

    if (isToggling) return;

    try {
      setIsToggling(true);
      if (isLiked) {
        const response = await favoriteService.unsave(id);
        if (response.code === 200 || response.code === 1000) {
          setIsLiked(false);
          toast.success("Đã bỏ lưu tin");
          // Đồng bộ số lượng ở Header ngay lập tức
          window.dispatchEvent(new Event("favorite-count-sync"));
        }
      } else {
        const response = await favoriteService.save(id);
        if (response.code === 200 || response.code === 1000 || response.code === 201) {
          setIsLiked(true);
          toast.success("Đã lưu tin");
          // Đồng bộ số lượng ở Header ngay lập tức
          window.dispatchEvent(new Event("favorite-count-sync"));
        }
      }
    } catch (error: any) {
      console.error("Failed to toggle favorite", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setIsToggling(false);
    }
  };

  const formattedOfferPrice = useMemo(
    () => `${Math.max(offerPrice, 0).toLocaleString("vi-VN")}đ`,
    [offerPrice]
  );

  const quickOfferRates = [0.95, 0.9, 0.85];

  const handleShowPhone = () => {
    setShownPhone(contactPhone || "Chưa cập nhật");
  };

  const handleChatNow = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập để nhắn tin");
      return;
    }

    if (String(user.userId) === String(seller.id)) {
      toast.error("Bạn không thể nhắn tin cho chính mình");
      return;
    }

    const sellerId = typeof seller.id === "string" ? seller.id : String(seller.id ?? "");
    if (!uuidRegex.test(sellerId)) {
      toast.error("Không thể khởi tạo cuộc trò chuyện: thiếu thông tin người bán");
      return;
    }

    try {
      setIsOpeningChat(true);
      const conversation = await chatService.createOrGetConversation(user.userId, {
        targetUserId: sellerId,
        productId: id,
      });
      if (conversation && conversation.conversationId) {
        router.push(`/tin-nhan?id=${conversation.conversationId}`);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Không thể khởi tạo cuộc trò chuyện");
    } finally {
      setIsOpeningChat(false);
    }
  };

  const handleSendOffer = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập để gửi đề xuất");
      return;
    }

    if (String(user.userId) === String(seller.id)) {
      toast.error("Bạn không thể deal giá với chính mình");
      return;
    }

    if (offerPrice <= 0) {
      toast.error("Vui lòng nhập giá đề xuất hợp lệ");
      return;
    }

    const sellerId = typeof seller.id === "string" ? seller.id : String(seller.id ?? "");
    if (!uuidRegex.test(sellerId)) {
      toast.error("Không thể gửi đề xuất: thiếu thông tin người bán");
      return;
    }

    try {
      setIsSendingOffer(true);
      const conversation = await chatService.createOrGetConversation(user.userId, {
        targetUserId: sellerId,
        productId: id,
      });

      const message = `Món này mình rất thích nhưng ngân sách có hạn, mình muốn giá ${offerPrice.toLocaleString('vi-VN')}đ. Được thì báo mình qua lấy sớm nha.`;

      await chatService.sendMessage(user.userId, conversation.conversationId, {
        messageType: 'offer',
        content: message,
        offerAmount: offerPrice,
      });

      toast.success("Đã gửi đề xuất giá thành công!");
      router.push(`/tin-nhan?id=${conversation.conversationId}`);
    } catch (error) {
      console.error("Failed to send offer:", error);
      toast.error("Có lỗi xảy ra khi gửi đề xuất, vui lòng thử lại");
    } finally {
      setIsSendingOffer(false);
    }
  };

  return (
    <section className="h-full rounded-2xl p-1">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl leading-snug font-extrabold text-gray-900">{name}</h1>
        <button 
          onClick={handleToggleFavorite}
          disabled={isToggling}
          className={`shrink-0 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
            isLiked 
              ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" 
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Heart size={16} className={isLiked ? "fill-red-600 text-red-600" : ""} />
          {isLiked ? "Đã lưu" : "Lưu tin"}
        </button>
      </div>

      <p className="mt-3 text-3xl font-extrabold text-emerald-600">{price}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {infoTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
        <div className="inline-flex items-center gap-1.5">
          <MapPin size={15} className="text-emerald-600" />
          <span>
            {school}
            {campus ? ` | ${campus}` : ""}
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <Clock3 size={15} className="text-gray-500" />
          <span>Đăng {postedTime}</span>
        </div>
      </div>

      <div className="mt-5 hidden md:grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button 
          onClick={handleChatNow}
          disabled={isOpeningChat}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
        >
          <MessageCircle size={18} />
          {isOpeningChat ? "Đang kết nối..." : "Nhắn tin người bán"}
        </button>
        {shownPhone ? (
          <a
            href={`tel:${shownPhone}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-900 bg-white px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <PhoneCall size={18} />
            {shownPhone}
          </a>
        ) : (
          <button
            onClick={handleShowPhone}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <PhoneCall size={18} />
            Yêu cầu số điện thoại
          </button>
        )}
      </div>

      {isNegotiable && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 sm:p-4">
          <p className="text-sm font-semibold text-gray-900">Deal giá với người bán</p>
          <p className="mt-1 text-xs text-gray-600">Đề xuất mức giá hợp lý để bắt đầu thương lượng nhanh hơn</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {quickOfferRates.map((rate) => (
              <button
                key={rate}
                onClick={() => setOfferPrice(Math.round(parsedPrice * rate))}
                className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                {Math.round(rate * 100)}% giá niêm yết
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="number"
              min={0}
              value={offerPrice}
              onChange={(event) => setOfferPrice(Number(event.target.value) || 0)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-emerald-500"
              aria-label="Giá đề xuất"
            />
            <button 
              onClick={handleSendOffer}
              disabled={isSendingOffer}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSendingOffer ? 'Đang gửi...' : `Gửi đề xuất ${formattedOfferPrice}`}
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 border-t border-gray-200 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Người đăng tin</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 shadow-xs">
              <Image 
                src={seller.avatar || "/user/avatar-user-profile-default.png"} 
                alt={seller.name} 
                fill 
                className="object-cover" 
              />
            </div>

            <div className="min-w-0 pb-0.5">
              <p className="truncate text-sm font-bold text-gray-900 leading-tight">{seller.name}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className={`h-1.5 w-1.5 rounded-full ${sellerActivityStatus === "Đang hoạt động" ? "bg-emerald-500 animate-pulse outline-2 outline-emerald-100" : "bg-gray-400"}`}></span>
                <span className={`font-medium ${sellerActivityStatus === "Đang hoạt động" ? "text-emerald-600" : "text-gray-500"}`}>
                  {sellerActivityStatus}
                </span>
              </div>
            </div>
          </div>

          {sellerProfileHref ? (
            <Link
              href={sellerProfileHref}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Xem trang
            </Link>
          ) : (
            <button className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              Xem trang
            </button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-gray-200 px-3 py-2">
            <p className="text-gray-500">Đánh giá</p>
            <div className="mt-0.5 flex items-center gap-1 text-amber-500">
              <Star size={13} className="fill-amber-500" />
              <span className="font-bold">{sellerRating}</span>
              <span className="text-gray-400 font-medium">/ 5.0</span>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 px-3 py-2">
            <p className="text-gray-500">Đã bán</p>
            <p className="mt-0.5 font-bold text-gray-800">{sellerSoldCount} sản phẩm</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          <Share2 size={16} />
          Chia sẻ
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          <Flag size={16} />
          Báo xấu
        </button>
        <button 
          onClick={() => {
            const element = document.getElementById("seller-other-posts");
            if (element) {
              const yOffset = -100; // Khoảng cách offset để không bị header che mất
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }}
          className="inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors sm:col-span-1 col-span-2 cursor-pointer"
        >
          Xem thêm tin người bán
        </button>
      </div>
    </section>
  );
};

export default ProductSummary;
