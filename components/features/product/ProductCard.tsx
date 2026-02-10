import React, { useState } from "react";
import Image from "next/image";
import { Heart, Image as ImageIcon, MapPin } from "lucide-react";

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: string;
    school: string;
    campus?: string;
    image: string;
    tag?: string;
    time?: string;
    imageCount?: number;
  };
}

const ProductCard = ({ product }: ProductProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-5/6 bg-gray-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-fill group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-black/10 transition-colors"
        >
          <Heart 
            size={20} 
            className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-white drop-shadow-md"}`} 
          />
        </button>

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
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
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
    </div>
  );
};

export default ProductCard;
