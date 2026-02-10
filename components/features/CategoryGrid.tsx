"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

const heroCategories = [
  { id: 'giaotrinh', label: 'Giáo trình', image: '/cate/giao-trinh-v1.png', color: 'bg-blue-50', description: 'Sách, tài liệu' },
  { id: 'quanao', label: 'Quần áo', image: '/cate/quan-ao-v1.jpg', color: 'bg-yellow-50', description: 'Đồng phục, đồ thể thao' },
  { id: 'dientu', label: 'Điện tử', image: '/cate/dien-tu-v1.jpg', color: 'bg-purple-50', description: 'Laptop, phụ kiện' },
  { id: 'phongtro', label: 'Phòng trọ', image: '/cate/phong-tro-v2-1.jpg', color: 'bg-orange-50', description: 'Tìm ở ghép' },
  { id: 'dodung', label: 'Đồ dùng', image: '/cate/do-dung-v1.jpg', color: 'bg-emerald-50', description: 'Đồ gia dụng' },
  { id: 'anuong', label: 'Ăn uống', image: '/cate/an-uong-v2-1.jpg', color: 'bg-red-50', description: 'Deal ăn uống' },
  { id: 'chotangmienphi', label: 'Cho tặng miễn phí', image: '/cate/mien-phi-v1.jpg', color: 'bg-teal-50', description: 'Lấy ngay' },
];

const CategoryGrid = () => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;
  
  const handleNext = () => {
    if (startIndex + itemsPerPage < heroCategories.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  return (
    <section className="pt-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-4xl font-black text-brand-dark flex items-center gap-3">
              <span className="w-2 h-10 bg-brand-mint rounded-full"></span>
              Khám phá danh mục
            </h3>
            <p className="text-gray-500 font-medium text-lg">Hàng ngàn món đồ "cũ người mới ta" đang chờ bạn</p>
          </div>
          
          <div className="flex items-center gap-5">
            {heroCategories.length > itemsPerPage && (
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Previous categories"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={startIndex + itemsPerPage >= heroCategories.length}
                  className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Next categories"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
            <Link href="/search" className="group flex items-center gap-2 text-emerald-600 font-bold text-lg hover:text-emerald-700 transition-all">
              Xem tất cả <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 min-h-40">
          {heroCategories.slice(startIndex, startIndex + itemsPerPage).map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.id}`}
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-square bg-white flex items-center justify-center mb-0 transition-all duration-500 group-hover:-translate-y-2 overflow-hidden">
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${cat.color}`}></div>

                  <Image 
                    src={cat.image} 
                    alt={cat.label} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                
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
