"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const ProductImageGallery = ({ images, name }: ProductImageGalleryProps) => {
  const normalizedImages = useMemo(() => {
    // Lọc bỏ các giá trị không hợp lệ (null, undefined, chuỗi rỗng)
    const validImages = images?.filter(img => typeof img === 'string' && img.trim() !== '') || [];
    
    if (validImages.length === 0) {
      return ["/cate/khac-v2.png"];
    }

    return validImages;
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  return (
    <div className="space-y-3">
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <motion.div
          key={activeIndex}
          className="relative h-full w-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            const swipe = offset.x;
            if (swipe < -50) handleNext();
            else if (swipe > 50) handlePrev();
          }}
        >
          <Image
            src={normalizedImages[activeIndex]}
            alt={name}
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {normalizedImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-900 shadow-md backdrop-blur-sm transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-40 cursor-pointer"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-900 shadow-md backdrop-blur-sm transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-40 cursor-pointer"
              aria-label="Ảnh sau"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {activeIndex + 1} / {normalizedImages.length}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {normalizedImages.slice(0, 5).map((image, index) => (
          <button
            key={`${image}-${index}`}
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square overflow-hidden rounded-xl border transition-all cursor-pointer ${
              activeIndex === index
                ? "border-emerald-500 ring-2 ring-emerald-100"
                : "border-gray-200 hover:border-emerald-300"
            }`}
            aria-label={`Xem ảnh ${index + 1}`}
          >
            <Image src={image} alt={`${name} - ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
