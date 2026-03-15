"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { getCategories } from "@/services/categoryService";
import type { CategoryResponse } from "@/types/admin";

const CategoryIcon = ({ iconName }: { iconName: string | null }) => {
  if (!iconName) return <MoreHorizontal size={16} />;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent ? <IconComponent size={16} /> : <MoreHorizontal size={16} />;
};

interface CategorySelectorProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategories, 
  setSelectedCategories 
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const data = await getCategories();
        // Lọc lấy các danh mục cha (không có parentCategoryId)
        const parentCategories = data.filter(cat => !cat.parentCategoryId);
        setCategories(parentCategories);
      } catch (error) {
        console.error("Failed to fetch parent categories:", error);
      }
    };
    fetchParentCategories();
  }, []);

  const selectCategory = (categoryName: string) => {
    setSelectedCategories([categoryName]);
  };

  return (
    <div className="relative sm:w-40 shrink-0">
      <button 
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        className="w-full h-12 px-3 flex items-center justify-between hover:bg-gray-50 rounded-lg text-gray-700 font-heading font-bold text-sm transition-colors cursor-pointer"
      >
        <span className="truncate">
          {selectedCategories.length > 0 
            ? selectedCategories[0]
            : "Danh mục"}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
      </button>

      {isCategoryOpen && (
        <>
          {/* Overlay đóng dropdown khi click ra ngoài */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsCategoryOpen(false)}
          ></div>
          
          <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl mt-2 p-3 border border-gray-100 z-40 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-[10px] font-black text-gray-400 mb-2 px-2 uppercase tracking-widest font-heading">Lọc theo danh mục</div>
            <div className="space-y-0.5 max-h-90 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <label 
                  key={cat.categoryId}
                  className="flex items-center justify-between p-2 hover:bg-[#b8f3d7]/20 rounded-lg cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 text-gray-700 font-heading font-bold text-sm group-hover:text-emerald-700">
                    <span className="text-gray-400 group-hover:text-emerald-600 transition-colors">
                      <CategoryIcon iconName={cat.iconName} />
                    </span>
                    <span>{cat.categoryName}</span>
                  </div>
                  <div className="relative flex items-center h-5">
                    <input 
                      type="radio"
                      name="category"
                      checked={selectedCategories.includes(cat.categoryName)}
                      onChange={() => selectCategory(cat.categoryName)}
                      className="w-4 h-4 rounded-full border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                    />
                  </div>
                </label>
              ))}
            </div>
            
            {selectedCategories.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-50">
                <button 
                  onClick={() => setSelectedCategories([])}
                  className="w-full py-1.5 text-xs text-gray-500 hover:text-emerald-600 font-bold transition-colors cursor-pointer"
                >
                  Làm mới lựa chọn
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CategorySelector;
