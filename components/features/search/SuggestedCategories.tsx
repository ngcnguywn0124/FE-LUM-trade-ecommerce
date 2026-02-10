"use client";

import React from "react";
import Link from "next/link";
import { Laptop, BookOpen, Shirt, Bike, Smartphone, Headphones, ShoppingBag, Sparkles } from "lucide-react";

const categories = [
  { name: "Laptop", icon: Laptop, count: 234, color: "bg-blue-500" },
  { name: "Sách", icon: BookOpen, count: 567, color: "bg-orange-500" },
  { name: "Thời trang", icon: Shirt, count: 892, color: "bg-pink-500" },
  { name: "Xe cộ", icon: Bike, count: 145, color: "bg-green-500" },
  { name: "Điện thoại", icon: Smartphone, count: 321, color: "bg-purple-500" },
  { name: "Phụ kiện", icon: Headphones, count: 456, color: "bg-red-500" },
  { name: "Đồ dùng học tập", icon: ShoppingBag, count: 678, color: "bg-yellow-500" },
  { name: "Khác", icon: Sparkles, count: 189, color: "bg-gray-500" },
];

const SuggestedCategories = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Danh mục phổ biến</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              href={`/search?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-all hover:shadow-md"
            >
              <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={24} className="text-white" />
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
