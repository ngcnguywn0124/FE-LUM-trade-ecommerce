"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { getCategoryTree } from "@/services/categoryService";
import { getUniversities } from "@/services/universityService";
import { CategoryResponse, UniversityResponse } from "@/types/admin";
import { buildSearchHref, parseCombinedSearchSlug } from "@/lib/searchUrl";

interface SearchPageClientProps {
  combinedSlug?: string;
}

const flattenCategories = (nodes: CategoryResponse[]): CategoryResponse[] => {
  const result: CategoryResponse[] = [];
  const walk = (items: CategoryResponse[]) => {
    for (const item of items) {
      result.push(item);
      if (item.children?.length) walk(item.children);
    }
  };
  walk(nodes);
  return result;
};

const SearchPageClient = ({ combinedSlug }: SearchPageClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const keyword = searchParams.get("q") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryResponse[]>([]);
  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    condition: "all",
    sortBy: "newest",
  });

  const [viewMode, setViewMode] = useState<"grid-4" | "list">("grid-4");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 24;

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [categoriesData, universitiesData] = await Promise.all([
          getCategoryTree(),
          getUniversities(),
        ]);
        setCategoryTree(categoriesData);
        setUniversities(universitiesData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeta();
  }, []);

  const categoryFlat = useMemo(() => flattenCategories(categoryTree), [categoryTree]);

  const categoryBySlug = useMemo(() => {
    return new Map(categoryFlat.map((cat) => [cat.slug || "", cat]));
  }, [categoryFlat]);

  const categoryByName = useMemo(() => {
    return new Map(categoryFlat.map((cat) => [cat.categoryName, cat]));
  }, [categoryFlat]);

  const parentByChildSlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const parent of categoryTree) {
      if (!parent.slug || !parent.children?.length) continue;
      for (const child of parent.children) {
        if (child.slug) {
          map.set(child.slug, parent.slug);
        }
      }
    }
    return map;
  }, [categoryTree]);

  const categoryDescendantSlugs = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const parent of categoryTree) {
      if (!parent.slug) continue;
      const allowed = new Set<string>([parent.slug]);
      if (parent.children?.length) {
        for (const child of parent.children) {
          if (child.slug) allowed.add(child.slug);
        }
      }
      map.set(parent.slug, allowed);
    }
    return map;
  }, [categoryTree]);

  const universityBySlug = useMemo(() => {
    return new Map(universities.map((uni) => [uni.slug || "", uni]));
  }, [universities]);

  const universityByNameOrShort = useMemo(() => {
    const map = new Map<string, UniversityResponse>();
    for (const uni of universities) {
      map.set(uni.universityName, uni);
      if (uni.shortName) map.set(uni.shortName, uni);
    }
    return map;
  }, [universities]);

  const campusBySlug = useMemo(() => {
    const map = new Map<string, { campusName: string; universitySlug?: string }>();
    for (const uni of universities) {
      for (const campus of uni.campuses || []) {
        if (!campus.slug) continue;
        map.set(campus.slug, {
          campusName: campus.campusName,
          universitySlug: uni.slug || undefined,
        });
      }
    }
    return map;
  }, [universities]);

  const campusByName = useMemo(() => {
    const map = new Map<string, { slug?: string; universitySlug?: string }>();
    for (const uni of universities) {
      for (const campus of uni.campuses || []) {
        map.set(campus.campusName, {
          slug: campus.slug || undefined,
          universitySlug: uni.slug || undefined,
        });
      }
    }
    return map;
  }, [universities]);

  useEffect(() => {
    let category = searchParams.get("category") || undefined;
    let subcategory = searchParams.get("subcategory") || undefined;
    let school = searchParams.get("school") || undefined;
    let campus = searchParams.get("campus") || undefined;

    const hasLegacyQuery = Boolean(category || subcategory || school || campus);
    
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    let condition: string | undefined;

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const conditionParam = searchParams.get("condition");
    
    if (minPriceParam) minPrice = Number(minPriceParam);
    if (maxPriceParam) maxPrice = Number(maxPriceParam);
    if (conditionParam) condition = conditionParam;

    if (!hasLegacyQuery && combinedSlug) {
      const parsed = parseCombinedSearchSlug(combinedSlug, {
        itemSlugs: categoryFlat.map((cat) => cat.slug || "").filter(Boolean),
        universitySlugs: universities.map((uni) => uni.slug || "").filter(Boolean),
        campusSlugs: Array.from(campusBySlug.keys()),
        campusUniversityMap: new Map(
          Array.from(campusBySlug.entries())
            .filter(([, value]) => Boolean(value.universitySlug))
            .map(([slug, value]) => [slug, value.universitySlug as string]),
        ),
      });

      if (parsed.itemSlug) {
        const parentSlug = parentByChildSlug.get(parsed.itemSlug);
        if (parentSlug) {
          category = parentSlug;
          subcategory = parsed.itemSlug;
        } else {
          category = parsed.itemSlug;
          subcategory = undefined;
        }
      }

      school = parsed.universitySlug;
      campus = parsed.campusSlug;
    }

    if (category && !categoryBySlug.has(category)) {
      category = categoryByName.get(category)?.slug || undefined;
    }

    if (subcategory && !categoryBySlug.has(subcategory)) {
      subcategory = categoryByName.get(subcategory)?.slug || undefined;
    }

    if (subcategory) {
      const parentSlug = parentByChildSlug.get(subcategory);
      if (parentSlug) {
        category = parentSlug;
      } else {
        subcategory = undefined;
      }
    }

    if (school && !universityBySlug.has(school)) {
      school = universityByNameOrShort.get(school)?.slug || undefined;
    }

    if (campus && !campusBySlug.has(campus)) {
      campus = campusByName.get(campus)?.slug;
    }

    if (campus) {
      const campusUniversitySlug = campusBySlug.get(campus)?.universitySlug;
      if (campusUniversitySlug && school && school !== campusUniversitySlug) {
        campus = undefined;
      }
      if (!school && campusUniversitySlug) {
        school = campusUniversitySlug;
      }
    }

    setFilters((prev) => {
      // Ưu tiên giá trị từ URL, nếu không có thì giữ giá trị hiện tại (để không bị reset khi chuyển Category/School qua URL/SuggestedCategories)
      const currentMin = minPrice !== undefined ? minPrice : prev.priceRange?.min;
      const currentMax = maxPrice !== undefined ? maxPrice : prev.priceRange?.max;
      
      const priceRange = (currentMin !== undefined || currentMax !== undefined) 
        ? { min: currentMin || 0, max: currentMax || 999999999 } 
        : undefined;

      const finalCondition = (condition as any) || prev.condition || "all";

      if (
        prev.category === category &&
        prev.subcategory === subcategory &&
        prev.school === school &&
        prev.campus === campus &&
        prev.condition === finalCondition &&
        prev.priceRange?.min === priceRange?.min &&
        prev.priceRange?.max === priceRange?.max
      ) {
        return prev;
      }

      return {
        ...prev,
        category,
        subcategory,
        school,
        campus,
        condition: finalCondition,
        priceRange,
      };
    });

    setCurrentPage(1);
  }, [
    searchParams,
    combinedSlug,
    categoryFlat,
    categoryBySlug,
    categoryByName,
    parentByChildSlug,
    universities,
    universityBySlug,
    universityByNameOrShort,
    campusBySlug,
    campusByName,
  ]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const catId = filters.subcategory
          ? categoryBySlug.get(filters.subcategory)?.categoryId
          : filters.category
            ? categoryBySlug.get(filters.category)?.categoryId
            : undefined;

        // Thêm độ trễ 0.5s để giảm nhấp nháy UI và cho cảm giác mượt mà
        await new Promise((resolve) => setTimeout(resolve, 500));

        const page = keyword
          ? await searchProducts(keyword, 0, 120)
          : await getProducts({
              categoryId: catId,
              page: 0,
              size: 120,
              sort: "createdAt,desc",
            });

        setAllProducts(page.content.map(mapSummaryToCardProduct));
      } catch {
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [keyword, filters.category, filters.subcategory, filters.school, filters.campus, categoryBySlug]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (keyword && !product.name.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }

      if (filters.subcategory) {
        const matchesSubcategorySlug = product.categorySlug === filters.subcategory;
        if (!matchesSubcategorySlug) {
          const subcategoryName = categoryBySlug.get(filters.subcategory)?.categoryName;
          if (!subcategoryName || product.category !== subcategoryName) {
            return false;
          }
        }
      } else if (filters.category) {
        const allowedSlugs = categoryDescendantSlugs.get(filters.category) || new Set([filters.category]);
        const productCategorySlug = product.categorySlug || "";
        if (productCategorySlug) {
          if (!allowedSlugs.has(productCategorySlug)) {
            return false;
          }
        } else {
          const allowedCategoryNames = Array.from(allowedSlugs)
            .map((slug) => categoryBySlug.get(slug)?.categoryName)
            .filter(Boolean);
          if (!allowedCategoryNames.includes(product.category)) {
            return false;
          }
        }
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

      if (filters.school) {
        const uni = universityBySlug.get(filters.school);
        const accepted = [uni?.shortName, uni?.universityName].filter(Boolean) as string[];
        if (!accepted.includes(product.school)) {
          return false;
        }
      }

      if (filters.campus) {
        const selectedCampusName = campusBySlug.get(filters.campus)?.campusName;
        if (!selectedCampusName || product.campus !== selectedCampusName) {
          return false;
        }
      }

      return true;
    });
  }, [
    allProducts,
    filters,
    keyword,
    categoryDescendantSlugs,
    categoryBySlug,
    universityBySlug,
    campusBySlug,
  ]);

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
          const scoreA = (a.viewCount || 0) + (a.favoriteCount || 0) * 2;
          const scoreB = (b.viewCount || 0) + (b.favoriteCount || 0) * 2;
          return scoreB - scoreA;
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

  const displayCategoryName = useMemo(() => {
    if (!filters.category) return "";
    return categoryBySlug.get(filters.category)?.categoryName || filters.category;
  }, [filters.category, categoryBySlug]);

  const displaySubcategoryName = useMemo(() => {
    if (!filters.subcategory) return "";
    return categoryBySlug.get(filters.subcategory)?.categoryName || filters.subcategory;
  }, [filters.subcategory, categoryBySlug]);

  const displaySchoolName = useMemo(() => {
    if (!filters.school) return "";
    const uni = universityBySlug.get(filters.school);
    return uni?.shortName || uni?.universityName || filters.school;
  }, [filters.school, universityBySlug]);

  const displayCampusName = useMemo(() => {
    if (!filters.campus) return "";
    return campusBySlug.get(filters.campus)?.campusName || filters.campus;
  }, [filters.campus, campusBySlug]);

  const handleFiltersChange = useCallback(
    (newFilters: SearchFilters) => {
      setFilters(newFilters);
      setCurrentPage(1);

      const href = buildSearchHref({
        itemSlug: newFilters.subcategory || newFilters.category,
        universitySlug: newFilters.school,
        campusSlug: newFilters.campus,
        keyword,
        minPrice: newFilters.priceRange?.min,
        maxPrice: newFilters.priceRange?.max === 999999999 ? undefined : newFilters.priceRange?.max,
        condition: newFilters.condition !== "all" ? newFilters.condition : undefined,
      });
      router.push(href, { scroll: false });
    },
    [keyword, router]
  );

  const handleRemoveFilter = useCallback(
    (filterKey: keyof SearchFilters) => {
      const newFilters = {
        ...filters,
        [filterKey]: filterKey === "condition" ? "all" : undefined,
      };

      if (filterKey === "category") {
        newFilters.subcategory = undefined;
      }

      if (filterKey === "school") {
        newFilters.campus = undefined;
      }

      handleFiltersChange(newFilters);
    },
    [filters, handleFiltersChange]
  );

  const handleSortChange = (sortBy: SortOption) => {
    setFilters({ ...filters, sortBy });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    const resetFilters: SearchFilters = {
      category: undefined,
      subcategory: undefined,
      condition: "all",
      priceRange: undefined,
      school: undefined,
      campus: undefined,
      sortBy: "newest",
    };

    setFilters(resetFilters);
    handleFiltersChange(resetFilters);
  };

  const breadcrumbItems = [
    {
      label: keyword
        ? `Kết quả tìm kiếm "${keyword}"`
        : filters.subcategory
          ? `${displayCategoryName} > ${displaySubcategoryName}`
          : filters.category
            ? displayCategoryName
            : "Tất cả bài đăng",
    },
  ];

  const showSuggestedCategories = !keyword && !filters.category;

  const displayFilters: SearchFilters = {
    ...filters,
    category: displayCategoryName || undefined,
    subcategory: displaySubcategoryName || undefined,
    school: displaySchoolName || undefined,
    campus: displayCampusName || undefined,
  };

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
                className="flex shrink-0 items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal size={18} className="text-gray-600" />
                <span className="font-medium text-sm text-gray-700">Bộ lọc</span>
              </button>

              <div className="flex-1 min-w-0">
                <SearchHeader
                  resultCount={sortedProducts.length}
                  keyword={keyword}
                  category={displayCategoryName}
                  sortBy={filters.sortBy || "newest"}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  minimal={true}
                />
              </div>

              <div className="flex items-center shrink-0 bg-gray-100 p-1 rounded-lg border border-gray-200">
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

            <div className="hidden lg:block">
              <SearchHeader
                resultCount={sortedProducts.length}
                keyword={keyword}
                category={displayCategoryName}
                sortBy={filters.sortBy || "newest"}
                onSortChange={handleSortChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            <ActiveFilters
              filters={displayFilters}
              onRemoveFilter={handleRemoveFilter}
            />

            {showSuggestedCategories && (
              <div className="hidden lg:block">
                <SuggestedCategories filters={filters} />
              </div>
            )}

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

export default SearchPageClient;
