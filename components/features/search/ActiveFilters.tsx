"use client";

import React from "react";
import { X } from "lucide-react";
import { SearchFilters } from "@/types";

interface ActiveFiltersProps {
  filters: SearchFilters;
  onRemoveFilter: (filterKey: keyof SearchFilters) => void;
}

const ActiveFilters = ({ filters, onRemoveFilter }: ActiveFiltersProps) => {
  const activeFilters: { key: keyof SearchFilters; label: string }[] = [];

  // Add category filter
  if (filters.category) {
    activeFilters.push({
      key: 'category',
      label: `Danh mục: ${filters.category}`,
    });
  }

  // Add subcategory filter
  if (filters.subcategory) {
    activeFilters.push({
      key: 'subcategory',
      label: `${filters.subcategory}`,
    });
  }

  // Add active filters to array
  if (filters.condition && filters.condition !== 'all') {
    const conditionLabels = {
      new: 'Mới 100%',
          'like_new': 'Như mới',
      used: 'Đã qua sử dụng',
          old: 'Cũ/Vẫn dùng tốt',
          broken: 'Hỏng/Lấy linh kiện',
    };
    activeFilters.push({
      key: 'condition',
      label: conditionLabels[filters.condition as keyof typeof conditionLabels] || filters.condition,
    });
  }

  if (filters.priceRange) {
    const formatPrice = (price: number) => {
      if (price >= 1000000) return `${price / 1000000}tr`;
      if (price >= 1000) return `${price / 1000}k`;
      return price.toString();
    };
    
    const label = filters.priceRange.max === 999999999
      ? `Trên ${formatPrice(filters.priceRange.min)}`
      : filters.priceRange.min === 0
      ? `Dưới ${formatPrice(filters.priceRange.max)}`
      : `${formatPrice(filters.priceRange.min)} - ${formatPrice(filters.priceRange.max)}`;
    
    activeFilters.push({
      key: 'priceRange',
      label: `Giá: ${label}`,
    });
  }

  if (filters.school) {
    activeFilters.push({
      key: 'school',
      label: filters.school,
    });
  }

  if (filters.campus) {
    activeFilters.push({
      key: 'campus',
      label: `Cơ sở: ${filters.campus}`,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-emerald-900">Đang lọc:</span>
        {activeFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onRemoveFilter(filter.key)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-full text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors group cursor-pointer"
          >
            <span>{filter.label}</span>
            <X size={14} className="group-hover:text-emerald-900" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;
