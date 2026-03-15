"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./product/ProductCard";
import { Sparkles } from "lucide-react";
import { Product } from "@/types";
import {
  getProducts,
  getTrendingProducts,
  mapSummaryToCardProduct,
} from "@/services/productService";

const tabs = [
  { id: "foryou", label: "Dành cho bạn", extra: null },
  { id: "newest", label: "Mới nhất", extra: null },
  {
    id: "trending",
    label: "Trending",
    extra: <Sparkles size={14} className="text-blue-400 fill-blue-400" />,
  },
] as const;

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("foryou");
  const [products, setProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(25);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [latest, trending] = await Promise.all([
          getProducts({ page: 0, size: 60, sort: "createdAt,desc" }),
          getTrendingProducts(0, 60),
        ]);

        setProducts(latest.content.map(mapSummaryToCardProduct));
        setTrendingProducts(trending.content.map(mapSummaryToCardProduct));
      } catch {
        setProducts([]);
        setTrendingProducts([]);
      }
    };

    loadData();
  }, []);

  const displayedProducts = useMemo(() => {
    if (activeTab === "trending") {
      return trendingProducts;
    }

    return products;
  }, [activeTab, products, trendingProducts]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <section id="product-section" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 border-b border-gray-100 mb-8 pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 text-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {tab.extra}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {displayedProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {visibleCount < displayedProducts.length && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="px-10 py-3 rounded-full border-2 border-slate-100 font-bold text-gray-700 hover:bg-slate-50 transition-all hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
            >
              Xem Thêm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
