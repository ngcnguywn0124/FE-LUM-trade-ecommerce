"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import FilterSidebar from "@/components/features/search/FilterSidebar";
import SearchHeader from "@/components/features/search/SearchHeader";
import ActiveFilters from "@/components/features/search/ActiveFilters";
import SearchResultsGrid from "@/components/features/search/SearchResultsGrid";
import Pagination from "@/components/features/search/Pagination";
import SuggestedCategories from "@/components/features/search/SuggestedCategories";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Product, SearchFilters, SortOption } from "@/types";
import { generateMockProducts } from "@/lib/mockData";

// Generate mock data - thay thế bằng API call thực tế
const mockProducts: Product[] = generateMockProducts(100);

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // States
  const [filters, setFilters] = useState<SearchFilters>({
    category: categoryParam || undefined,
    condition: 'all',
    sortBy: 'newest',
  });
  const [viewMode, setViewMode] = useState<'grid-4' | 'list'>('grid-4');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 24;

  // Sync URL params with local state
  useEffect(() => {
    const categoryParam = searchParams.get("category") || undefined;
    
    setFilters(prev => {
      // Chỉ update nếu thực sự có sự thay đổi để tránh vòng lặp vô tận
      if (prev.category === categoryParam) return prev;
      
      return {
        ...prev,
        category: categoryParam,
        subcategory: undefined, // Reset subcategory khi đổi category
      };
    });
    setCurrentPage(1);
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = mockProducts.filter((product) => {
    // Keyword search
    if (keyword && !product.name.toLowerCase().includes(keyword.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Subcategory filter (kiểm tra trong tên sản phẩm)
    if (filters.subcategory && !product.name.toLowerCase().includes(filters.subcategory.toLowerCase())) {
      return false;
    }

    // Condition filter
    if (filters.condition && filters.condition !== 'all' && product.condition !== filters.condition) {
      return false;
    }

    // Price range filter
    if (filters.priceRange) {
      const price = parseInt(product.price.replace(/[^\d]/g, ''));
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }
    }

    // School filter
    if (filters.school && product.school !== filters.school) {
      return false;
    }

    // Campus filter
    if (filters.campus && product.campus !== filters.campus) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));

    switch (filters.sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'popular':
        return (b.imageCount || 0) - (a.imageCount || 0);
      case 'newest':
      default:
        return 0; // Mock - in reality would sort by date
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change

    // Sync specific filters to URL for better UX
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.category) {
      params.set("category", newFilters.category);
    } else {
      params.delete("category");
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const handleRemoveFilter = (filterKey: keyof SearchFilters) => {
    const newFilters = {
      ...filters,
      [filterKey]: filterKey === 'condition' ? 'all' : undefined,
    };
    setFilters(newFilters);
    setCurrentPage(1);

    if (filterKey === 'category') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category");
      router.push(`/search?${params.toString()}`, { scroll: false });
    }
  };

  const handleSortChange = (sortBy: SortOption) => {
    setFilters({ ...filters, sortBy });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [filters, currentPage]);

  const clearFilters = () => {
    setFilters({
      category: undefined,
      subcategory: undefined,
      condition: 'all',
      priceRange: undefined,
      school: undefined,
      campus: undefined,
      sortBy: 'newest',
    });
    setCurrentPage(1);

    // Update URL - remove category but keep keyword (q)
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`/search?${params.toString()}`);
  };

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: keyword 
        ? `Kết quả tìm kiếm "${keyword}"` 
        : filters.subcategory 
        ? `${filters.category} > ${filters.subcategory}`
        : filters.category 
        ? filters.category
        : "Tất cả sản phẩm",
    },
  ];

  // Determine if popular categories are shown
  const showSuggestedCategories = !keyword && !filters.category;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              hideCategories={showSuggestedCategories}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter & View Toggle */}
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <SlidersHorizontal size={18} className="text-gray-600" />
                <span className="font-medium text-sm text-gray-700">Bộ lọc & Sắp xếp</span>
              </button>
              
              <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-sm">
                <button
                  onClick={() => setViewMode('grid-4')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid-4'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Mobile Filter Sidebar */}
            <div className="lg:hidden">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                hideCategories={showSuggestedCategories}
              />
            </div>

            {/* Search Header */}
            <SearchHeader
              resultCount={sortedProducts.length}
              keyword={keyword}
              category={filters.category}
              sortBy={filters.sortBy || 'newest'}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Active Filters */}
            <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />

            {/* Suggested Categories - show when no filters applied */}
            {showSuggestedCategories && (
              <SuggestedCategories />
            )}

            {/* Results Grid */}
            <SearchResultsGrid
              products={paginatedProducts}
              viewMode={viewMode}
              isLoading={isLoading}
              onClearFilters={clearFilters}
              keyword={keyword}
            />

            {/* Pagination */}
            {!isLoading && sortedProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
