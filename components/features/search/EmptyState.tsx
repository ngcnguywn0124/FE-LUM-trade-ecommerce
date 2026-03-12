"use client";

import React from "react";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  type?: "no-results" | "no-filters";
  keyword?: string;
  onClearFilters?: () => void;
}

const EmptyState = ({ type = "no-results", keyword, onClearFilters }: EmptyStateProps) => {
  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-32 h-32 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
          <Search size={48} className="text-emerald-600" />
          <div className="absolute top-0 right-0 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">?</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {keyword ? (
            <>Không tìm thấy &quot;{keyword}&quot;</>
          ) : (
            <>Không tìm thấy sản phẩm</>
          )}
        </h3>
        
        <p className="text-gray-600 max-w-md mb-8">
          Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để tìm những gì bạn đang tìm kiếm.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
          <Link
            href="/tim-kiem"
            className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>

        {/* Suggested keywords */}
        <div className="mt-12 w-full max-w-2xl">
          <p className="text-sm text-gray-600 mb-4">Từ khóa gợi ý:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Laptop', 'iPhone', 'Sách', 'Áo HUTECH', 'Xe đạp', 'iPad'].map((keyword) => (
              <Link
                key={keyword}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="px-4 py-2 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full text-sm font-medium text-gray-700 transition-colors"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No filters applied - show explore state
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-linear-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mb-6">
        <Sparkles size={40} className="text-emerald-600" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Khám phá sản phẩm
      </h3>
      
      <p className="text-gray-600 max-w-md">
        Sử dụng bộ lọc hoặc tìm kiếm để tìm sản phẩm phù hợp với bạn.
      </p>
    </div>
  );
};

export default EmptyState;
