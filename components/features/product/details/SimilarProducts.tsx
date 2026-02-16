"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/features/product/ProductCard";

interface SimilarProductsProps {
  products: Product[];
  currentProductId: number;
  category?: string;
}

const SimilarProducts = ({ products, currentProductId, category }: SimilarProductsProps) => {
  const [visibleCount, setVisibleCount] = useState(20);

  // Lọc sản phẩm tương tự (cùng category và loại bỏ sản phẩm hiện tại)
  const allSimilar = useMemo(() => {
    return products.filter((p) => p.id !== currentProductId && p.category === category);
  }, [products, currentProductId, category]);

  const displayProducts = allSimilar.slice(0, visibleCount);

  if (!allSimilar.length) return null;

  return (
    <section className="mt-6 pb-6 border-t border-gray-100 pt-10">
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-tight">
          Tin đăng tương tự
        </h2>
      </div>

      {/* Grid giống ở Home */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Nút Xem thêm */}
      {visibleCount < allSimilar.length && (
        <div className="mt-12 text-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="px-10 py-3 rounded-full border-2 border-slate-100 font-bold text-gray-700 hover:bg-slate-50 transition-all hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
          >
            Xem Thêm
          </button>
        </div>
      )}
    </section>
  );
};

export default SimilarProducts;
