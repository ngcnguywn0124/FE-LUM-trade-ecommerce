"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Laptop, Home, ShoppingBag, Utensils, Zap, ChevronRight } from "lucide-react";

const heroCategories = [
  { id: 'giaotrinh', label: 'Giáo trình', icon: <BookOpen className="w-7 h-7" />, color: 'bg-blue-50 text-blue-600', hover: 'hover:bg-blue-600', hoverIcon: 'group-hover:text-white', description: 'Sách, tài liệu' },
  { id: 'dientu', label: 'Điện tử', icon: <Laptop className="w-7 h-7" />, color: 'bg-purple-50 text-purple-600', hover: 'hover:bg-purple-600', hoverIcon: 'group-hover:text-white', description: 'Laptop, phụ kiện' },
  { id: 'phongtro', label: 'Phòng trọ', icon: <Home className="w-7 h-7" />, color: 'bg-orange-50 text-orange-600', hover: 'hover:bg-orange-600', hoverIcon: 'group-hover:text-white', description: 'Tìm ở ghép' },
  { id: 'dodung', label: 'Đồ dùng', icon: <ShoppingBag className="w-7 h-7" />, color: 'bg-emerald-50 text-emerald-600', hover: 'hover:bg-emerald-600', hoverIcon: 'group-hover:text-white', description: 'Đồ gia dụng' },
  { id: 'anuong', label: 'Ăn uống', icon: <Utensils className="w-7 h-7" />, color: 'bg-red-50 text-red-600', hover: 'hover:bg-red-600', hoverIcon: 'group-hover:text-white', description: 'Deal ăn uống' },
  { id: 'khac', label: 'Gom nhanh', icon: <Zap className="w-7 h-7" />, color: 'bg-yellow-50 text-yellow-600', hover: 'hover:bg-yellow-600', hoverIcon: 'group-hover:text-white', description: 'Mua chung' },
];

const CategoryGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-4xl font-black text-brand-dark flex items-center gap-3">
              <span className="w-2 h-10 bg-brand-mint rounded-full"></span>
              Khám phá danh mục
            </h3>
            <p className="text-gray-500 font-medium text-lg">Hàng ngàn món đồ "cũ người mới ta" đang chờ bạn</p>
          </div>
          <Link href="/explore" className="group flex items-center gap-2 text-emerald-600 font-bold text-lg hover:text-emerald-700 transition-all">
            Xem tất cả <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {heroCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-4xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 overflow-hidden">
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${cat.color}`}></div>
                
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-sm ${cat.color} group-hover:scale-110`}>
                  {cat.icon}
                </div>
                
                {/* Hover Indicator Line */}
                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-emerald-500 group-hover:w-full transition-all duration-500"></div>
              </div>
              
              <div className="text-center group-hover:transform group-hover:scale-105 transition-all duration-300">
                <h4 className="font-bold text-brand-dark text-lg group-hover:text-emerald-600 transition-colors">
                  {cat.label}
                </h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
