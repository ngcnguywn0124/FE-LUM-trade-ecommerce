"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  SlidersHorizontal, X, ChevronDown, ChevronRight,
  MapPin, Search
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { SearchFilters, ConditionFilter } from "@/types";
import { mockSchools, getCampusesBySchool } from "@/lib/categoriesData";
import { getCategoryTree } from "@/services/categoryService";
import { CategoryResponse } from "@/types/admin";

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onClose: () => void;
  hideCategories?: boolean;
}

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose, hideCategories = false }: FilterSidebarProps) => {
  // State cho categories từ API
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  
  // State cho expanded sections
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);

  // State cho tìm kiếm trường học
  const [schoolSearchQuery, setSchoolSearchQuery] = useState("");

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoryTree();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch category tree:", error);
      }
    };
    fetchCategories();
  }, []);

  // Local state cho custom price inputs để tránh lọc ngay lập tức
  const [localMinPrice, setLocalMinPrice] = useState<string>(filters.priceRange?.min?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    filters.priceRange?.max === 999999999 ? '' : filters.priceRange?.max?.toString() || ''
  );

  // Cập nhật lại local state khi filters.priceRange thay đổi từ bên ngoài (ví dụ: chọn khoảng giá nhanh hoặc xóa bộ lọc)
  useEffect(() => {
    setLocalMinPrice(filters.priceRange?.min?.toString() || '');
    setLocalMaxPrice(
      filters.priceRange?.max === 999999999 ? '' : filters.priceRange?.max?.toString() || ''
    );
  }, [filters.priceRange]);
  
  // Get available campuses based on selected school
  const availableCampuses = filters.school 
    ? getCampusesBySchool(mockSchools.find(s => s.name === filters.school)?.id || '')
    : [];
  
  // Get available subcategories based on selected category (slug)
  const availableSubcategories = useMemo(() => {
    if (!filters.category) return [];
    const parent = categories.find(c => c.slug === filters.category);
    return parent?.children || [];
  }, [filters.category, categories]);

  const CategoryIcon = ({ iconName }: { iconName: string | null }) => {
    if (!iconName) return <LucideIcons.Layers size={18} />;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={18} /> : <LucideIcons.Layers size={18} />;
  };

  const conditions: { value: ConditionFilter; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'new', label: 'Mới 100%' },
    { value: 'like_new', label: 'Như mới' },
    { value: 'used', label: 'Đã qua sử dụng' },
    { value: 'old', label: 'Cũ/Vẫn dùng tốt' },
    { value: 'broken', label: 'Hỏng/Lấy linh kiện' },
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
    const isSubcategorySelected = !!filters.subcategory;
    
    // TRƯỜNG HỢP: Click vào danh mục cha đang ĐƯỢC CHỌN
    if (isSameCategory) {
      // Nếu đang có lọc danh mục con -> Bỏ lọc con, giữ lại lọc cha
      if (isSubcategorySelected) {
        onFiltersChange({ 
          ...filters, 
          subcategory: undefined,
        });
        setExpandedCategory(categoryName); // Vẫn mở rộng
      } 
      // Nếu KHÔNG có lọc danh mục con -> Không làm gì (giữ nguyên lọc cha)
      // Để giống bộ lọc Trường/Cơ sở (click lại vào trường đang chọn thì không mất lọc)
      return;
    }

    // TRƯỜNG HỢP: Chọn một danh mục cha MỚI
    onFiltersChange({ 
      ...filters, 
      category: categoryName,
      subcategory: undefined,
    });
    setExpandedCategory(categoryName);
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

  const handleApplyCustomPrice = () => {
    const min = localMinPrice === '' ? 0 : Number(localMinPrice);
    const max = localMaxPrice === '' ? 999999999 : Number(localMaxPrice);
    
    // Nếu cả 2 đều trống thì coi như xóa bộ lọc giá
    if (localMinPrice === '' && localMaxPrice === '') {
      onFiltersChange({ ...filters, priceRange: undefined });
      return;
    }

    if (!isNaN(min) && !isNaN(max)) {
      handlePriceRangeChange(min, max);
    }
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

  // Filter trường học dựa trên search query
  const filteredSchools = mockSchools.filter(school => 
    school.name.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  // Chỉ hiển thị tối đa 6 trường để giao diện gọn gàng
  const displayedSchools = filteredSchools.slice(0, 6);

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
          
          <div className="flex items-center gap-3">
            <button
              onClick={clearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
            >
              Xóa lọc
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Categories, etc. */}

        {/* Category Filter với Subcategories */}
        {!hideCategories && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Danh mục</h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const hasSubcategories = category.children && category.children.length > 0;
              const isSelected = filters.category === category.slug;
              const isExpanded = expandedCategory === category.slug;
              
              return (
                <div key={category.categoryId}>
                  {/* Main Category */}
                  <div
                    className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group ${isSelected ? 'bg-emerald-50/50' : ''}`}
                    onClick={() => handleCategoryChange(category.slug || "")}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="category"
                        checked={isSelected}
                        onChange={() => handleCategoryChange(category.slug || "")}
                        className="hidden" // Hidden radio
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className={`${isSelected ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        <CategoryIcon iconName={category.iconName} />
                      </span>
                      <span className={`text-sm group-hover:text-gray-900 ${isSelected ? 'text-emerald-600 font-medium' : 'text-gray-700'}`}>
                        {category.categoryName}
                      </span>
                    </label>
                    {hasSubcategories && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            setExpandedCategory(isExpanded ? null : (category.slug || ""));
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
                        const isSubSelected = filters.subcategory === subcategory.slug;
                        return (
                          <label
                            key={subcategory.categoryId}
                            className="flex items-center gap-3 py-1.5 px-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                          >
                            <div className="relative flex items-center justify-center">
                              <input
                                type="radio"
                                name="subcategory"
                                checked={isSubSelected}
                                onChange={() => handleSubcategoryChange(subcategory.slug || "")}
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
                              {subcategory.categoryName}
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
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                placeholder="Từ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomPrice()}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Đến"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomPrice()}
              />
            </div>
            <button
              onClick={handleApplyCustomPrice}
              className="w-full py-2 bg-gray-100 hover:bg-emerald-600 hover:text-white text-gray-700 text-sm font-medium rounded-lg transition-all cursor-pointer"
            >
              Áp dụng
            </button>
          </div>
        </div>

        {/* School Filter với Campuses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Trường học</h3>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              {mockSchools.length} trường
            </span>
          </div>

          {/* Search bar for schools - Show if more than 6 schools */}
          {mockSchools.length > 6 && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Tìm trường học..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                value={schoolSearchQuery}
                onChange={(e) => setSchoolSearchQuery(e.target.value)}
              />
              {schoolSearchQuery && (
                <button 
                  onClick={() => setSchoolSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          <div className="space-y-1 max-h-75 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
            {displayedSchools.length > 0 ? (
              displayedSchools.map((school) => {
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
              })
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs text-gray-500">Không tìm thấy trường nào</p>
              </div>
            )}
          </div>
        </div>        {/* Apply Filters Button (Mobile) */}
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
