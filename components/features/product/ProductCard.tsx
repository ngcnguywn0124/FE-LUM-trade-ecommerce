import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Image as ImageIcon, MapPin, CheckCircle2 } from "lucide-react";
import { favoriteService } from "@/services/favoriteService";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Product } from "@/types";

interface ProductProps {
  product: Product;
  isWishlist?: boolean;
  onFavoriteToggle?: (isFavorited: boolean) => void;
}

const ProductCard = ({ product, isWishlist = false, onFavoriteToggle }: ProductProps) => {
  const [isLiked, setIsLiked] = useState(product.isFavorited || isWishlist);
  const [isToggling, setIsToggling] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const isSold = product.status === "sold";

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu tin");
      return;
    }

    if (isToggling) return;

    try {
      setIsToggling(true);
      const productId = product.id.toString();
      
      if (isLiked) {
        const response = await favoriteService.unsave(productId);
        if (response.code === 200 || response.code === 1000) {
          setIsLiked(false);
          toast.success("Đã bỏ lưu tin");
          onFavoriteToggle?.(false);
          // Đồng bộ số lượng ở Header ngay lập tức
          window.dispatchEvent(new Event("favorite-count-sync"));
        }
      } else {
        const response = await favoriteService.save(productId);
        if (response.code === 200 || response.code === 1000 || response.code === 201) {
          setIsLiked(true);
          toast.success("Đã lưu tin");
          onFavoriteToggle?.(true);
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

  const handleClick = (e: React.MouseEvent) => {
    if (isSold) {
      e.preventDefault();
      // Không thông báo lỗi ở đây để không làm phiền người dùng khi họ chỉ muốn bấm nút Heart
      return;
    }
  };

  return (
    <div className="relative group">
      <Link 
        href={isSold ? "#" : `/bai-dang/${product.slug || product.id}`} 
        onClick={handleClick}
        className={`block relative ${isSold ? "cursor-default" : "cursor-pointer transition-all duration-300"}`}
      >
        {/* Image Container */}
        <div className={`relative aspect-5/6 bg-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${isSold ? "opacity-60 grayscale-[0.8]" : ""}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-fill transition-transform duration-500 ${isSold ? "" : "group-hover:scale-105"}`}
          />

          {/* Sold Overlay */}
          {isSold && (
            <div className="absolute inset-0 z-20 bg-black/20 flex flex-col items-center justify-center backdrop-blur-[1px]">
               <div className="bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-gray-100 scale-90 sm:scale-100">
                 <CheckCircle2 size={16} className="text-gray-500" />
                 <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Đã bán</span>
               </div>
            </div>
          )}

          {/* Bottom Overlay Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent z-0"></div>

          {/* Overlay Info (Bottom) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
            <span className="text-xs font-medium opacity-90">{product.time || "Vừa xong"}</span>
            <div className="flex items-center gap-1 opacity-90">
               <ImageIcon size={12} />
               <span className="text-[10px] font-bold">{product.imageCount || 1}</span>
            </div>
          </div>
        </div>

        {/* Info (Below Image - for Marketplace style) */}
        <div className="mt-2.5 px-0.5">
          <h3 className={`text-sm font-semibold text-gray-800 line-clamp-1 transition-colors ${isSold ? "" : "group-hover:text-emerald-600"}`}>
            {product.name}
          </h3>
          <p className="text-emerald-600 font-bold mt-0.5">{product.price}</p>
          <div className="mt-2 flex items-center gap-2 overflow-hidden text-[11px]">
            <div className="flex items-center gap-1 text-emerald-600/70 font-bold shrink-0">
              <MapPin size={10} />
              {product.school}
            </div>
            {product.campus && (
              <>
                <span className="text-gray-200">|</span>
                <span className="text-gray-400 truncate font-medium">{product.campus}</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button - Chuyển ra ngoài Link để click được ngay cả khi bài đã bán */}
      <button 
        onClick={handleToggleFavorite}
        disabled={isToggling}
        className="absolute top-3 right-3 z-30 p-1.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer disabled:opacity-50"
      >
        <Heart 
          size={20} 
          className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-white drop-shadow-md"}`} 
        />
      </button>
    </div>
  );
};

export default ProductCard;
