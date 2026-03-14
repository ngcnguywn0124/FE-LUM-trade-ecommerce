"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUpDown, LayoutGrid, List, ChevronDown, Check } from "lucide-react";
import { SortOption } from "@/types";

interface SearchHeaderProps {
  resultCount: number;
  keyword?: string;
  category?: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid-4' | 'list';
  onViewModeChange: (mode: 'grid-4' | 'list') => void;
  minimal?: boolean;
}

const SearchHeader = ({
  resultCount,
  keyword,
  category,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  minimal = false,
}: SearchHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến' },
    { value: 'price-asc', label: 'Giá thấp đến cao' },
    { value: 'price-desc', label: 'Giá cao đến thấp' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Mới nhất';

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (minimal) {
    return (
      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="text-emerald-600 truncate mr-1">{currentSortLabel}</span>
          <ChevronDown 
            size={16} 
            className={`shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 min-w-[160px]">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  sortBy === option.value
                    ? 'bg-emerald-50 text-emerald-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
                {sortBy === option.value && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      {/* Title & Result Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {keyword ? (
              <>
                Kết quả cho &quot;<span className="text-emerald-600">{keyword}</span>&quot;
              </>
            ) : category ? (
              category
            ) : (
              'Tất cả bài đăng'
            )}
          </h1>
          <p className="text-sm text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{resultCount}</span> sản phẩm
          </p>
        </div>

        {/* View Mode Toggle (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange('grid-4')}
            className={`p-2 rounded transition-colors cursor-pointer ${
              viewMode === 'grid-4'
                ? 'bg-white text-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="4 cột"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Danh sách"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowUpDown size={16} />
          <span className="font-medium whitespace-nowrap">Sắp xếp:</span>
        </div>

        {/* Mobile Dropdown */}
        <div className="relative flex-1 sm:hidden" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-emerald-600">{currentSortLabel}</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    sortBy === option.value
                      ? 'bg-emerald-50 text-emerald-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                  {sortBy === option.value && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Buttons (Hidden on Mobile) */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                sortBy === option.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
