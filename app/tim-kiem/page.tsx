"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import FilterSidebar from "@/components/features/search/FilterSidebar";
import SearchHeader from "@/components/features/search/SearchHeader";
import ActiveFilters from "@/components/features/search/ActiveFilters";
import SearchResultsGrid from "@/components/features/search/SearchResultsGrid";
import Pagination from "@/components/shared/Pagination";
import SuggestedCategories from "@/components/features/search/SuggestedCategories";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Product, SearchFilters, SortOption } from "@/types";
import { getProducts, mapSummaryToCardProduct, searchProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { CategoryResponse } from "@/types/admin";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    category: categoryParam || undefined,
    condition: "all",
    sortBy: "newest",
  });

  // Fetch categories to get display names
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCats();
  }, []);

  const displayCategoryName = useMemo(() => {
    if (!filters.category) return "";
    const cat = categories.find(c => c.slug === filters.category || c.categoryName === filters.category);
    return cat ? cat.categoryName : filters.category;
  }, [filters.category, categories]);

  const [viewMode, setViewMode] = useState<"grid-4" | "list">("grid-4");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 24;

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || undefined;

    setFilters((prev) => {
      if (prev.category === categoryFromUrl) return prev;
      return {
        ...prev,
        category: categoryFromUrl,
        subcategory: undefined,
      };
    });

    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const page = keyword
          ? await searchProducts(keyword, 0, 120)
          : await getProducts({ page: 0, size: 120, sort: "createdAt,desc" });

        setAllProducts(page.content.map(mapSummaryToCardProduct));
      } catch {
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [keyword]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (keyword && !product.name.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }

      if (filters.category && product.category !== filters.category && product.categorySlug !== filters.category) {
        return false;
      }

      if (
        filters.subcategory &&
        !product.name.toLowerCase().includes(filters.subcategory.toLowerCase())
      ) {
        return false;
      }

      if (filters.condition && filters.condition !== "all" && product.condition !== filters.condition) {
        return false;
      }

      if (filters.priceRange) {
        const price = parseInt(product.price.replace(/[^\d]/g, "") || "0", 10);
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      if (filters.school && product.school !== filters.school) {
        return false;
      }

      if (filters.campus && product.campus !== filters.campus) {
        return false;
      }

      return true;
    });
  }, [allProducts, filters, keyword]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    sorted.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^\d]/g, "") || "0", 10);
      const priceB = parseInt(b.price.replace(/[^\d]/g, "") || "0", 10);

      switch (filters.sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "popular":
          return (b.imageCount || 0) - (a.imageCount || 0);
        case "newest":
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredProducts, filters.sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.category) {
      params.set("category", newFilters.category);
    } else {
      params.delete("category");
    }

    router.push(`/tim-kiem?${params.toString()}`, { scroll: false });
  };

  const handleRemoveFilter = (filterKey: keyof SearchFilters) => {
    const newFilters = {
      ...filters,
      [filterKey]: filterKey === "condition" ? "all" : undefined,
    };

    setFilters(newFilters);
    setCurrentPage(1);

    if (filterKey === "category") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category");
      router.push(`/tim-kiem?${params.toString()}`, { scroll: false });
    }
  };

  const handleSortChange = (sortBy: SortOption) => {
    setFilters({ ...filters, sortBy });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      category: undefined,
      subcategory: undefined,
      condition: "all",
      priceRange: undefined,
      school: undefined,
      campus: undefined,
      sortBy: "newest",
    });

    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`/tim-kiem?${params.toString()}`);
  };

  const breadcrumbItems = [
    {
      label: keyword
        ? `Kết quả tìm kiếm "${keyword}"`
        : filters.subcategory
          ? `${displayCategoryName} > ${filters.subcategory}`
          : filters.category
            ? displayCategoryName
            : "Tất cả bài đăng",
    },
  ];

  const showSuggestedCategories = !keyword && !filters.category;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex gap-6">
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              hideCategories={showSuggestedCategories}
            />
          </div>

          <div className="flex-1 min-w-0">
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
                  onClick={() => setViewMode("grid-4")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "grid-4"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className="lg:hidden">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                hideCategories={showSuggestedCategories}
              />
            </div>

            <SearchHeader
              resultCount={sortedProducts.length}
              keyword={keyword}
              category={displayCategoryName}
              sortBy={filters.sortBy || "newest"}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <ActiveFilters 
              filters={{...filters, category: displayCategoryName}} 
              onRemoveFilter={handleRemoveFilter} 
            />

            {showSuggestedCategories && <SuggestedCategories />}

            <SearchResultsGrid
              products={paginatedProducts}
              viewMode={viewMode}
              isLoading={isLoading}
              onClearFilters={clearFilters}
              keyword={keyword}
            />

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

const SearchPage = () => {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>}
    >
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
