"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Laptop, Home, ShoppingBag, Utensils, Zap } from "lucide-react";

const heroCategories = [
  { id: 'giaotrinh', label: 'Giáo trình', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
  { id: 'dientu', label: 'Điện tử', icon: <Laptop className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
  { id: 'phongtro', label: 'Phòng trọ', icon: <Home className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' },
  { id: 'dodung', label: 'Đồ dùng', icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'anuong', label: 'Ăn uống', icon: <Utensils className="w-6 h-6" />, color: 'bg-red-100 text-red-600' },
  { id: 'khac', label: 'Gom nhanh', icon: <Zap className="w-6 h-6" />, color: 'bg-yellow-100 text-yellow-600' },
];

const CategoryGrid = () => {
  return (
    <div className="relative z-10 w-full mt-12">
      <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
        Khám phá theo danh mục
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {heroCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/explore?category=${cat.id}`}
            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 border border-transparent hover:border-emerald-200"
          >
            <div className={`p-3 rounded-xl transition-colors ${cat.color} group-hover:bg-opacity-80`}>
              {cat.icon}
            </div>
            <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-emerald-700 truncate w-full text-center">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
