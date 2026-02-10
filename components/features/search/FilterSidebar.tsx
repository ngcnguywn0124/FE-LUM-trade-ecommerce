"use client";

import React, { useState, useEffect } from "react";
import { 
  SlidersHorizontal, X, ChevronDown, ChevronRight,
  Laptop, BookOpen, Shirt, Bike, Smartphone, Headphones, PenTool, Layers,
  MapPin
} from "lucide-react";
import { SearchFilters, ConditionFilter } from "@/types";
import { mockCategories, mockSchools, getCampusesBySchool, getSubcategoriesByCategory } from "@/lib/categoriesData";

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onClose: () => void;
  hideCategories?: boolean;
}

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose, hideCategories = false }: FilterSidebarProps) => {
  // State cho expanded sections
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  
  // Get available campuses based on selected school
  const availableCampuses = filters.school 
    ? getCampusesBySchool(mockSchools.find(s => s.name === filters.school)?.id || '')
    : [];
  
  // Get available subcategories based on selected category
  const availableSubcategories = filters.category
    ? getSubcategoriesByCategory(mockCategories.find(c => c.name === filters.category)?.id || '')
    : [];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'laptop': return <Laptop size={18} />;
      case 'sach': return <BookOpen size={18} />;
      case 'thoi-trang': return <Shirt size={18} />;
      case 'xe-co': return <Bike size={18} />;
      case 'dien-thoai': return <Smartphone size={18} />;
      case 'phu-kien': return <Headphones size={18} />;
      case 'do-dung-hoc-tap': return <PenTool size={18} />;
      default: return <Layers size={18} />;
    }
  };

  const conditions: { value: ConditionFilter; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'new', label: 'Mới 100%' },
    { value: 'like-new', label: 'Như mới' },
    { value: 'used', label: 'Đã qua sử dụng' },
  ];

  const priceRanges = [
    { min: 0, max: 100000, label: 'Dưới 100k' },
    { min: 100000, max: 500000, label: '100k - 500k' },
    { min: 500000, max: 1000000, label: '500k - 1tr' },
    { min: 1000000, max: 5000000, label: '1tr - 5tr' },
    { min: 5000000, max: 999999999, label: 'Trên 5tr' },
  ];

  // Handlers
  const handleCategoryChange = (categoryName: string) => {
    const isSameCategory = categoryName === filters.category;
    
    onFiltersChange({ 
      ...filters, 
      category: isSameCategory ? undefined : categoryName,
      subcategory: undefined, // Reset subcategory khi đổi category
    });
    
    // Auto-expand khi select category mới, collapse khi deselect
    if (isSameCategory) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  const handleSubcategoryChange = (subcategoryName: string) => {
    onFiltersChange({ 
      ...filters, 
      subcategory: subcategoryName === filters.subcategory ? undefined : subcategoryName,
    });
  };

  const handleConditionChange = (condition: ConditionFilter) => {
    onFiltersChange({ ...filters, condition });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: { min, max } });
  };

  const handleSchoolChange = (schoolName: string) => {
    const isSameSchool = schoolName === filters.school;
    
    onFiltersChange({ 
      ...filters, 
      school: isSameSchool ? undefined : schoolName,
      campus: undefined, // Reset campus khi đổi school
    });
    
    // Auto-expand khi select school mới, collapse khi deselect
    if (isSameSchool) {
      setExpandedSchool(null);
    } else {
      setExpandedSchool(schoolName);
    }
  };

  const handleCampusChange = (campusName: string) => {
    onFiltersChange({ 
      ...filters, 
      campus: campusName === filters.campus ? undefined : campusName,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: undefined,
      subcategory: undefined,
      condition: 'all',
      priceRange: undefined,
      school: undefined,
      campus: undefined,
      sortBy: filters.sortBy,
    });
    setExpandedCategory(null);
    setExpandedSchool(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-80 lg:w-full bg-white 
          border-r lg:border-r-0 lg:border border-gray-200 
          rounded-none lg:rounded-xl
          p-6 overflow-y-auto z-50 lg:z-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full mb-6 text-sm text-emerald-600 hover:text-emerald-700 font-medium text-left"
        >
          Xóa tất cả bộ lọc
        </button>

        {/* Category Filter với Subcategories */}
        {!hideCategories && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Danh mục</h3>
          <div className="space-y-1">
            {mockCategories.map((category) => {
              const hasSubcategories = category.subcategories && category.subcategories.length > 0;
              const isSelected = filters.category === category.name;
              const isExpanded = expandedCategory === category.name;
              
              return (
                <div key={category.id}>
                  {/* Main Category */}
                  <div
                    className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group ${isSelected ? 'bg-emerald-50/50' : ''}`}
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="category"
                        checked={isSelected}
                        onChange={() => handleCategoryChange(category.name)}
                        className="hidden" // Hidden radio
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={`${isSelected ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        {getCategoryIcon(category.id)}
                      </span>
                      <span className={`text-sm group-hover:text-gray-900 ${isSelected ? 'text-emerald-600 font-medium' : 'text-gray-700'}`}>
                        {category.name}
                      </span>
                    </label>
                    {hasSubcategories && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            setExpandedCategory(isExpanded ? null : category.name);
                          }
                        }}
                        className={`p-1 rounded transition-colors ${
                          isSelected 
                            ? 'hover:bg-gray-200' 
                            : 'opacity-50'
                        }`}
                        disabled={!isSelected}
                        title={!isSelected ? 'Chọn danh mục để xem danh mục con' : 'Xem danh mục con'}
                      >
                        {isExpanded && isSelected ? (
                          <ChevronDown size={16} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {isSelected && isExpanded && availableSubcategories.length > 0 && (
                    <div className="ml-7 mt-1 space-y-1 pb-2">
                      {availableSubcategories.map((subcategory) => {
                        const isSubSelected = filters.subcategory === subcategory.name;
                        return (
                          <label
                            key={subcategory.id}
                            className="flex items-center gap-3 py-1.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                          >
                            <div className="relative flex items-center justify-center">
                              <input
                                type="radio"
                                name="subcategory"
                                checked={isSubSelected}
                                onChange={() => handleSubcategoryChange(subcategory.name)}
                                className="sr-only"
                              />
                              <div className={`w-3.5 h-3.5 rounded-full border transition-all ${
                                isSubSelected 
                                  ? 'border-emerald-600 border-[4.5px]' 
                                  : 'border-gray-300 group-hover:border-emerald-500'
                              }`} />
                            </div>
                            <span className={`text-sm transition-colors ${
                              isSubSelected ? 'text-emerald-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'
                            }`}>
                              {subcategory.name}
                              {subcategory.count && (
                                <span className="text-xs text-gray-400 ml-1">({subcategory.count})</span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Condition Filter */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Tình trạng</h3>
          <div className="space-y-2">
            {conditions.map((condition) => {
              const checked = filters.condition === condition.value;
              return (
                <label
                  key={condition.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="condition"
                      checked={checked}
                      onChange={() => handleConditionChange(condition.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border transition-all ${
                      checked 
                        ? 'border-emerald-600 border-[5px]' 
                        : 'border-gray-300 group-hover:border-emerald-500'
                    }`} />
                  </div>
                  <span className={`text-sm transition-colors ${
                    checked ? 'text-emerald-700 font-medium' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {condition.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Khoảng giá</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => {
              const checked = 
                filters.priceRange?.min === range.min &&
                filters.priceRange?.max === range.max;
              return (
                <label
                  key={range.label}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={checked}
                      onChange={() => handlePriceRangeChange(range.min, range.max)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border transition-all ${
                      checked 
                        ? 'border-emerald-600 border-[5px]' 
                        : 'border-gray-300 group-hover:border-emerald-500'
                    }`} />
                  </div>
                  <span className={`text-sm transition-colors ${
                    checked ? 'text-emerald-700 font-medium' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {range.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Custom Price Range */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Từ"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={filters.priceRange?.min || ''}
                onChange={(e) =>
                  handlePriceRangeChange(
                    Number(e.target.value),
                    filters.priceRange?.max || 999999999
                  )
                }
              />
              <input
                type="number"
                placeholder="Đến"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={filters.priceRange?.max === 999999999 ? '' : filters.priceRange?.max || ''}
                onChange={(e) =>
                  handlePriceRangeChange(
                    filters.priceRange?.min || 0,
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* School Filter với Campuses */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Trường học</h3>
          <div className="space-y-1">
            {mockSchools.map((school) => {
              const hasCampuses = school.campuses && school.campuses.length > 0;
              const isSelected = filters.school === school.name;
              const isExpanded = expandedSchool === school.name;
              
              return (
                <div key={school.id}>
                  {/* Main School */}
                  <div
                    className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group ${isSelected ? 'bg-emerald-50/50' : ''}`}
                    onClick={() => handleSchoolChange(school.name)}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="school"
                        checked={isSelected}
                        onChange={() => handleSchoolChange(school.name)}
                        className="hidden" // Hidden radio
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={`${isSelected ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        <MapPin size={18} />
                      </span>
                      <span className={`text-sm group-hover:text-gray-900 ${isSelected ? 'text-emerald-600 font-medium' : 'text-gray-700'}`}>
                        {school.name}
                      </span>
                    </label>
                    {hasCampuses && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            setExpandedSchool(isExpanded ? null : school.name);
                          }
                        }}
                        className={`p-1 rounded transition-colors ${
                          isSelected 
                            ? 'hover:bg-gray-200' 
                            : 'opacity-50'
                        }`}
                        disabled={!isSelected}
                        title={!isSelected ? 'Chọn trường để xem cơ sở' : 'Xem cơ sở'}
                      >
                        {isExpanded && isSelected ? (
                          <ChevronDown size={16} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Campuses */}
                  {isSelected && isExpanded && availableCampuses.length > 0 && (
                    <div className="ml-7 mt-1 space-y-1 pb-2">
                      {availableCampuses.map((campus) => {
                        const isCampusSelected = filters.campus === campus.name;
                        return (
                          <label
                            key={campus.id}
                            className="flex items-center gap-3 py-1.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                          >
                            <div className="relative flex items-center justify-center">
                              <input
                                type="radio"
                                name="campus"
                                checked={isCampusSelected}
                                onChange={() => handleCampusChange(campus.name)}
                                className="sr-only"
                              />
                              <div className={`w-3.5 h-3.5 rounded-full border transition-all ${
                                isCampusSelected 
                                  ? 'border-emerald-600 border-[4.5px]' 
                                  : 'border-gray-300 group-hover:border-emerald-500'
                              }`} />
                            </div>
                            <span className={`text-sm transition-colors ${
                              isCampusSelected ? 'text-emerald-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'
                            }`}>
                              {campus.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Apply Filters Button (Mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
        >
          Áp dụng bộ lọc
        </button>
      </aside>
    </>
  );
};

export default FilterSidebar;
