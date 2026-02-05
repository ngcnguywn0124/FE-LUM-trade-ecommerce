"use client";

import React, { useState } from "react";
import { ChevronDown, BookOpen, Laptop, Home, Shirt, Coffee, Bike, MoreHorizontal, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: string[];
}

const megaCategories: CategoryItem[] = [
  { 
    id: 'giaotrinh', 
    label: 'Giáo trình', 
    icon: <BookOpen size={18} />,
    children: ["Giáo trình Đại cương", "Giáo trình Chuyên ngành", "Từ điển & Sách ngoại ngữ", "Tài liệu ôn thi (Toeic, JLPT)"]
  },
  { 
    id: 'dientu', 
    label: 'Đồ điện tử', 
    icon: <Laptop size={18} />,
    children: ["Laptop & Máy tính bàn", "Điện thoại & Máy tính bảng", "Phụ kiện (Chuột, Phím, Tai nghe)", "Linh kiện PC"]
  },
  { 
    id: 'phongtro', 
    label: 'Đồ dùng phòng trọ', 
    icon: <Home size={18} />,
    children: ["Tủ lạnh & Máy giặt mini", "Nệm, Gối & Ga giường", "Bàn ghế làm việc", "Dụng cụ nhà bếp"]
  },
  { 
    id: 'thoitrang', 
    label: 'Thời trang nam nữ', 
    icon: <Shirt size={18} />,
    children: ["Quần áo", "Giày dép", "Balo & Túi xách", "Phụ kiện thời trang"]
  },
  { 
    id: 'giaitri', 
    label: 'Giải trí & Sở thích', 
    icon: <Bike size={18} />,
    children: ["Nhạc cụ", "Đồ thể thao", "Board games", "Đồ sưu tầm"]
  },
  { 
    id: 'khac', 
    label: 'Tiện ích khác', 
    icon: <MoreHorizontal size={18} />,
    children: ["Mỹ phẩm & Chăm sóc cá nhân", "Dịch vụ (In ấn, sửa chữa)", "Văn phòng phẩm", "Khác"]
  },
];

const CategoryMegaMenu = () => {
  const [activeParent, setActiveParent] = useState<CategoryItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setActiveParent(null);
      }}
    >
      {/* Trigger Button */}
      <div className="hidden lg:flex items-center gap-1 text-sm font-bold text-gray-800 cursor-pointer hover:bg-black/5 px-4 py-2 rounded-lg transition-colors">
        <span>Danh mục</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Mega Menu Content */}
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white shadow-2xl rounded-xl border border-gray-100 flex overflow-hidden min-w-125 h-87.5">
            
            {/* Sidebar: Parent Categories */}
            <div className="w-56 bg-gray-50/50 border-r border-gray-100 py-3 overflow-y-auto">
              {megaCategories.map((cat) => (
                <div
                  key={cat.id}
                  onMouseEnter={() => setActiveParent(cat)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${
                    activeParent?.id === cat.id 
                    ? "bg-white text-emerald-600 font-bold shadow-sm" 
                    : "text-gray-700 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${activeParent?.id === cat.id ? "text-emerald-500" : "text-gray-400"}`}>
                      {cat.icon}
                    </span>
                    <span className="text-[13px] whitespace-nowrap">{cat.label}</span>
                  </div>
                  {activeParent?.id === cat.id && <ChevronRight size={14} />}
                </div>
              ))}
            </div>

            {/* Content Body: Child Categories */}
            <div className="flex-1 bg-white p-6 overflow-y-auto">
              {activeParent ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                    <span className="text-emerald-600 font-black text-sm uppercase tracking-wider">
                      {activeParent.label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1">
                    {activeParent.children.map((child, index) => (
                      <Link 
                        key={index}
                        href="#"
                        className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50 px-3 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center justify-between group/item"
                      >
                        {child}
                        <ChevronRight size={12} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-emerald-400" />
                      </Link>
                    ))}
                  </div>

                  {/* Promotion area or Footer of Mega Menu */}
                  <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100/50 group/promo cursor-pointer">
                    <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-1">Tin nổi bật</p>
                    <p className="text-xs font-bold text-gray-800 group-hover:text-orange-700 transition-colors">
                      Săn deal giáo trình cực hời cho học kỳ mới! 🔥
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center animate-pulse">
                        <MoreHorizontal size={32} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-800">Chào mừng bạn!</p>
                        <p className="text-xs">Rê chuột vào các danh mục bên trái <br/> để xem sản phẩm chi tiết</p>
                    </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMegaMenu;
