"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/services/categoryService";
import { CategoryResponse } from "@/types/admin";
import { buildSearchHref } from "@/lib/searchUrl";
import { SearchFilters } from "@/types";

interface SuggestedCategoriesProps {
  filters?: SearchFilters;
}

const SuggestedCategories = ({ filters }: SuggestedCategoriesProps) => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Lấy các danh mục cha (parentCategoryId là null) và giới hạn 8 cái như UI cũ
        const parents = data.filter((cat) => !cat.parentCategoryId).slice(0, 8);
        setCategories(parents);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Danh mục phổ biến</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((category) => {
          return (
            <Link
              key={category.categoryId}
              href={buildSearchHref({ 
                itemSlug: category.slug || undefined,
                universitySlug: filters?.school,
                campusSlug: filters?.campus,
                minPrice: filters?.priceRange?.min,
                maxPrice: filters?.priceRange?.max === 999999999 ? undefined : filters?.priceRange?.max,
                condition: filters?.condition !== "all" ? filters?.condition : undefined,
               })}
              className="group flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-all hover:shadow-md"
            >
              <div className="relative w-12 h-12 group-hover:scale-110 transition-transform">
                <Image
                  src={category.imageUrl || "/cate/khac-v2.png"}
                  alt={category.categoryName}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {category.categoryName}
                </h3>
                <p className="text-xs text-gray-500">Xem tất cả</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedCategories;
