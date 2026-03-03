"use client";

import { useState } from "react";
import ProductCard from "@/components/features/product/ProductCard";
import { Product } from "@/types";
import { ChevronDown } from "lucide-react";

interface UserListingsSectionProps {
  listings: Product[];
}

const UserListingsSection = ({ listings }: UserListingsSectionProps) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tin đang rao ({listings.length})</h2>
          <p className="mt-1 text-sm text-gray-500">Các món đồ sinh viên này đang còn giao dịch.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {visibleListings.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            className="px-10 py-3 rounded-full border-2 border-slate-100 font-bold text-gray-700 hover:bg-slate-50 transition-all hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
          >
            Xem Thêm
          </button>
        </div>
      )}

      {!listings.length && (
        <div className="py-12 text-center">
          <p className="text-gray-500 font-medium">Hiện chưa có tin đăng nào.</p>
        </div>
      )}
    </section>
  );
};

export default UserListingsSection;
