"use client";

import React from "react";
import { ArrowUpDown, Grid3x3, LayoutGrid } from "lucide-react";
import { SortOption } from "@/types";

interface SearchHeaderProps {
  resultCount: number;
  keyword?: string;
  category?: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid-3' | 'grid-4';
  onViewModeChange: (mode: 'grid-3' | 'grid-4') => void;
}

const SearchHeader = ({
  resultCount,
  keyword,
  category,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: SearchHeaderProps) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Phổ biến' },
    { value: 'price-asc', label: 'Giá thấp đến cao' },
    { value: 'price-desc', label: 'Giá cao đến thấp' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      {/* Title & Result Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {keyword ? (
              <>
                Kết quả cho "<span className="text-emerald-600">{keyword}</span>"
              </>
            ) : category ? (
              category
            ) : (
              'Tất cả sản phẩm'
            )}
          </h1>
          <p className="text-sm text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{resultCount}</span> sản phẩm
          </p>
        </div>

        {/* View Mode Toggle (Desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange('grid-3')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid-3'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="3 cột"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('grid-4')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid-4'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="4 cột"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowUpDown size={16} />
          <span className="font-medium">Sắp xếp:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
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
