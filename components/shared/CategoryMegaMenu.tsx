"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, MoreHorizontal, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { getCategoryTree } from "@/services/categoryService";
import type { CategoryResponse } from "@/types/admin";
import { buildSearchHref } from "@/lib/searchUrl";

const CategoryIcon = ({ iconName }: { iconName: string | null }) => {
  if (!iconName) return <MoreHorizontal size={18} />;
  
  // Lấy component icon từ thư viện Lucide dựa trên tên từ database
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (!IconComponent) {
    return <MoreHorizontal size={18} />;
  }
  
  return <IconComponent size={18} />;
};

const CategoryMegaMenu = () => {
  const [activeParent, setActiveParent] = useState<CategoryResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoryTree();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
          <div className={`bg-white shadow-2xl rounded-xl border border-gray-100 flex overflow-hidden ${
            activeParent && (!activeParent.children || activeParent.children.length === 0) 
            ? "min-w-56 w-56 h-auto" 
            : "min-w-125 h-94 max-h-96"
          }`}>
            
            {/* Sidebar: Parent Categories */}
            <div className={`bg-gray-50/50 py-3 overflow-y-auto ${
              activeParent && (!activeParent.children || activeParent.children.length === 0) 
              ? "w-full" 
              : "w-56 border-r border-gray-100"
            }`}>
              {categories.map((cat) => (
                <div
                  key={cat.categoryId}
                  onMouseEnter={() => setActiveParent(cat)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${
                    activeParent?.categoryId === cat.categoryId 
                    ? "bg-white text-emerald-600 font-bold shadow-sm" 
                    : "text-gray-700 hover:bg-white/80"
                  }`}
                >
                  <Link 
                    href={buildSearchHref({ itemSlug: cat.slug || undefined })}
                    className="flex items-center gap-3 flex-1"
                  >
                    <span className={`${activeParent?.categoryId === cat.categoryId ? "text-emerald-500" : "text-gray-400"}`}>
                      <CategoryIcon iconName={cat.iconName} />
                    </span>
                    <span className="text-[13px] whitespace-nowrap">{cat.categoryName}</span>
                  </Link>
                  {activeParent?.categoryId === cat.categoryId && (!cat.children || cat.children.length > 0) && <ChevronRight size={14} />}
                </div>
              ))}
            </div>

            {/* Content Body: Child Categories */}
            {activeParent && activeParent.children && activeParent.children.length > 0 && (
              <div className="flex-1 bg-white p-6 overflow-y-auto">
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                    <span className="text-emerald-600 font-black text-sm uppercase tracking-wider">
                      {activeParent.categoryName}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1">
                    {activeParent.children?.map((child) => (
                      <Link 
                        key={child.categoryId}
                        href={buildSearchHref({ itemSlug: child.slug || undefined })}
                        className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50 px-3 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center justify-between group/item"
                      >
                        {child.categoryName}
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
              </div>
            )}

            {/* Initial Welcome message (Only show when no parent is active and we have width for it) */}
            {!activeParent && (
              <div className="flex-1 bg-white p-6 flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
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
      )}
    </div>
  );
};

export default CategoryMegaMenu;
