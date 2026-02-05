"use client";

import React, { useState } from "react";
import { ChevronDown, BookOpen, Laptop, Home } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 'giaotrinh', label: 'Giáo trình', icon: <BookOpen size={16} /> },
  { id: 'dientu', label: 'Đồ điện tử', icon: <Laptop size={16} /> },
  { id: 'phongtro', label: 'Phòng trọ', icon: <Home size={16} /> },
];

interface CategorySelectorProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategories, 
  setSelectedCategories 
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const selectCategory = (category: string) => {
    setSelectedCategories([category]);
  };

  return (
    <div className="relative sm:w-40 shrink-0">
      <button 
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        className="w-full h-10 sm:h-12 px-3 flex items-center justify-between hover:bg-gray-50 rounded-lg text-gray-700 font-bold text-sm transition-colors"
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
            <div className="text-[10px] font-black text-gray-400 mb-2 px-2 uppercase tracking-widest">Lọc theo danh mục</div>
            <div className="space-y-0.5">
              {categories.map((cat) => (
                <label 
                  key={cat.id}
                  className="flex items-center justify-between p-2 hover:bg-[#b8f3d7]/20 rounded-lg cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 text-gray-700 font-bold text-sm group-hover:text-emerald-700">
                    <span className="text-gray-400 group-hover:text-emerald-600 transition-colors">
                      {cat.icon}
                    </span>
                    <span>{cat.label}</span>
                  </div>
                  <div className="relative flex items-center h-5">
                    <input 
                      type="radio"
                      name="category"
                      checked={selectedCategories.includes(cat.label)}
                      onChange={() => selectCategory(cat.label)}
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
                  className="w-full py-1.5 text-xs text-gray-500 hover:text-emerald-600 font-bold transition-colors"
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
