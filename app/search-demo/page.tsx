import React from "react";
import Link from "next/link";
import { Search, Package, Filter, Grid, TrendingUp } from "lucide-react";

export default function SearchPageDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Trang Tìm kiếm & Danh mục
          </h1>
          <p className="text-xl text-gray-600">
            Demo các tính năng đã implement
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tìm kiếm thông minh</h3>
            <p className="text-gray-600 mb-4">
              Search với lịch sử tìm kiếm, gợi ý phổ biến, và autocomplete
            </p>
            <Link
              href="/search?q=laptop"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Thử tìm "laptop" →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Filter className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Bộ lọc mạnh mẽ</h3>
            <p className="text-gray-600 mb-4">
              Filter theo tình trạng, giá, trường, với UI responsive
            </p>
            <Link
              href="/search"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Grid className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Grid linh hoạt</h3>
            <p className="text-gray-600 mb-4">
              Chế độ xem 3 cột hoặc 4 cột, responsive cho mọi thiết bị
            </p>
            <Link
              href="/search?category=Laptop"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Xem theo danh mục →
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sắp xếp đa dạng</h3>
            <p className="text-gray-600 mb-4">
              Sort theo mới nhất, phổ biến, giá thấp/cao
            </p>
            <Link
              href="/search"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Khám phá →
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🚀 Quick Links
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/search"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Package className="text-gray-400 group-hover:text-emerald-600" size={20} />
                <span className="font-medium text-gray-900 group-hover:text-emerald-600">
                  Tất cả sản phẩm
                </span>
              </div>
            </Link>

            <Link
              href="/search?q=laptop"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Search className="text-gray-400 group-hover:text-emerald-600" size={20} />
                <span className="font-medium text-gray-900 group-hover:text-emerald-600">
                  Tìm kiếm "laptop"
                </span>
              </div>
            </Link>

            <Link
              href="/search?category=Sách"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Package className="text-gray-400 group-hover:text-emerald-600" size={20} />
                <span className="font-medium text-gray-900 group-hover:text-emerald-600">
                  Danh mục: Sách
                </span>
              </div>
            </Link>

            <Link
              href="/search?q=iphone"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Search className="text-gray-400 group-hover:text-emerald-600" size={20} />
                <span className="font-medium text-gray-900 group-hover:text-emerald-600">
                  Tìm kiếm "iphone"
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            📚 Xem thêm tài liệu:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/SEARCH_PAGE_SUMMARY.md"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              Tổng quan
            </a>
            <a
              href="/components/features/search/README.md"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              Component Docs
            </a>
            <a
              href="/docs/API_INTEGRATION.md"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              API Integration
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
