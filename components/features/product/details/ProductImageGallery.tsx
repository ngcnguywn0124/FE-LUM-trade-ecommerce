"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const ProductImageGallery = ({ images, name }: ProductImageGalleryProps) => {
  const normalizedImages = useMemo(() => {
    if (!images.length) {
      return ["/cate/khac-v2.png"];
    }

    return images;
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <Image
          src={normalizedImages[activeIndex]}
          alt={name}
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {normalizedImages.slice(0, 8).map((image, index) => (
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
