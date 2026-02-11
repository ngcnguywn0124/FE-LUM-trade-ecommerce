"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Laptop", image: "/cate/giao-trinh-v1.png", count: 234 },
  { name: "Sách", image: "/cate/quan-ao-v1.jpg", count: 567 },
  { name: "Thời trang", image: "/cate/dien-tu-v1.jpg", count: 892 },
  { name: "Xe cộ", image: "/cate/phong-tro-v2-1.jpg", count: 145 },
  { name: "Điện thoại", image: "/cate/do-dung-v1.jpg", count: 321 },
  { name: "Phụ kiện", image: "/cate/an-uong-v2-1.jpg", count: 456 },
  { name: "Đồ dùng học tập", image: "/cate/mien-phi-v1.jpg", count: 678 },
  { name: "Khác", image: "/cate/khac-v2.png", count: 189 },
];

const SuggestedCategories = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Danh mục phổ biến</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((category) => {
          return (
            <Link
              key={category.name}
              href={`/search?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-all hover:shadow-md"
            >
              <div className="relative w-12 h-12 group-hover:scale-110 transition-transform">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500">{category.count} sản phẩm</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedCategories;
