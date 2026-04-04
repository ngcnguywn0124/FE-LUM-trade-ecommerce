"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/features/product/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedProductsProps {
  products: Product[];
  sellerName?: string;
  sellerId?: string;
}

const RelatedProducts = ({ products, sellerName, sellerId }: RelatedProductsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  // Giới hạn tối đa 20 sản phẩm
  const displayProducts = products.slice(0, 20);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Sử dụng ngưỡng > 5 để tránh sai số sub-pixel rendering
      setShowPrev(scrollLeft > 5);
      setShowNext(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    // Gọi checkScroll sau khi DOM đã render hoàn tất
    const timer = setTimeout(checkScroll, 300);
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timer);
    };
  }, [displayProducts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!products.length) {
    return null;
  }

  return (
    <section id="seller-other-posts" className="mt-10 relative group/section">
      <div className="mb-5">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-tight">
          Tin rao khác của <span className="text-emerald-600">{sellerName || "NGƯỜI BÁN"}</span>
        </h2>
      </div>

      <div className="relative overflow-visible">
        {/* Nút điều hướng - Chỉ hiện trên desktop nếu > 5 sp */}
        {displayProducts.length > 5 && (
          <>
            {showPrev && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-[35%] -translate-y-1/2 -ml-5 z-20 bg-white/40 border border-gray-100 shadow-xl rounded-full p-2.5 text-gray-700 hover:text-emerald-600 hover:scale-110 active:scale-95 transition-all cursor-pointer hidden md:flex items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
            )}
            {showNext && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-[35%] -translate-y-1/2 -mr-5 z-20 bg-white/40 border border-gray-100 shadow-xl rounded-full p-2.5 text-gray-700 hover:text-emerald-600 hover:scale-110 active:scale-95 transition-all cursor-pointer hidden md:flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            )}
          </>
        )}

        {/* Danh sách sản phẩm có thể vuốt */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayProducts.map((product) => (
            <div 
              key={product.id} 
              className="w-[165px] xs:w-[180px] sm:w-[200px] md:w-[220px] lg:w-[calc(20%-16px)] snap-start shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Nút Xem thêm ở dưới - Chỉ hiện nếu có nhiều hơn 5 sản phẩm */}
      {displayProducts.length > 5 && (
        <div className="mt-2 text-center">
          {sellerId ? (
            <Link
              href={`/tai-khoan/${sellerId}`}
              className="inline-flex px-10 py-3 rounded-full border-2 border-slate-100 font-bold text-gray-700 hover:bg-slate-50 transition-all hover:border-emerald-500 hover:text-emerald-600"
            >
              Xem Thêm
            </Link>
          ) : (
            <button
              type="button"
              className="px-10 py-3 rounded-full border-2 border-slate-100 font-bold text-gray-400 cursor-not-allowed"
              disabled
            >
              Xem Thêm
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default RelatedProducts;
