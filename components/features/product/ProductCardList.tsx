import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Image as ImageIcon, MapPin, Clock, Star } from "lucide-react";
import { favoriteService } from "@/services/favoriteService";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Product } from "@/types";

interface ProductProps {
  product: Product;
  onFavoriteToggle?: (isFavorited: boolean) => void;
}

const ProductCardList = ({ product, onFavoriteToggle }: ProductProps) => {
  const [isLiked, setIsLiked] = useState(product.isFavorited || false);
  const [isToggling, setIsToggling] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const conditionLabels = {
    'new': 'Mới 100%',
    'like_new': 'Như mới 99%',
    'used': 'Đã qua sử dụng',
    'old': 'Cũ/Vẫn dùng tốt',
    'broken': 'Hỏng/Lấy linh kiện',
    'for-parts': 'Phụ tùng'
  };

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

  return (
    <Link href={`/bai-dang/${product.slug || product.id}`} className="block group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="flex gap-4 p-4">
        {/* Image Container */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Image Count Badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white px-2 py-0.5 rounded-md z-10">
            <ImageIcon size={12} />
            <span className="text-[10px] font-bold">{product.imageCount || 1}</span>
          </div>

          {/* Tag */}
          {product.tag && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
              {product.tag}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top Section */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors flex-1">
                {product.name}
              </h3>
              
              {/* Favorite Button */}
              <button 
                onClick={handleToggleFavorite}
                disabled={isToggling}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Heart 
                  size={20} 
                  className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} 
                />
              </button>
            </div>

            {/* Condition Badge */}
            {product.condition && product.condition !== 'for-parts' && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded mb-2">
                {conditionLabels[product.condition as keyof typeof conditionLabels]}
              </span>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-lg sm:text-xl text-emerald-600 font-bold">{product.price}</p>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="flex items-center gap-2 mb-3 py-2 border-t border-gray-100">
                <div className="relative w-6 h-6 rounded-full bg-gray-50 overflow-hidden shrink-0 border border-gray-100 shadow-xs">
                  <Image
                    src={product.seller.avatar || "/user/avatar-user-profile-default.png"}
                    alt={product.seller.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-gray-900 truncate tracking-tight">
                    {product.seller.name}
                  </span>
                  {product.seller.rating && (
                    <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold shrink-0">
                      <Star size={10} className="fill-amber-500" />
                      <span>{product.seller.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section - Location & Time */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex items-center gap-1 text-emerald-600/70 font-bold shrink-0">
                <MapPin size={12} />
                <span>{product.school}</span>
              </div>
              {product.campus && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500 truncate font-medium">{product.campus}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-gray-400 shrink-0">
              <Clock size={12} />
              <span>{product.time || "Vừa xong"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardList;
