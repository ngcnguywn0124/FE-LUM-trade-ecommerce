"use client";

import React, { useState, useEffect, useCallback } from "react";
import Hero from "@/components/features/Hero";
import ProductSection from "@/components/features/ProductSection";
import { Laptop, Search } from "lucide-react";
import CategorySelector from "@/components/shared/CategorySelector";
import LocationSelector from "@/components/shared/LocationSelector";
import CategoryGrid from "@/components/features/CategoryGrid";
import PromoBanner from "@/components/features/PromoBanner";
import PopularKeywords from "@/components/features/PopularKeywords"; 
import { useLocation } from "@/providers/LocationProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "@/services/categoryService";
import { getUniversities } from "@/services/universityService";
import { CategoryResponse, UniversityResponse } from "@/types/admin";
import { buildSearchHref } from "@/lib/searchUrl";
import { useSearchHistory } from "@/hooks/useSearchHistory";

export default function Home() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const { history, addToHistory, clearHistory } = useSearchHistory();
   const { selectedSchool, setSelectedSchool, selectedCampus, setSelectedCampus } = useLocation();
   const [keyword, setKeyword] = useState("");

   // Cập nhật keyword từ URL khi ở trang chủ (vd: quay lại từ trang search)
   useEffect(() => {
      const q = searchParams.get("q");
      if (q !== null) {
         setKeyword(q);
      } else {
         setKeyword("");
      }
   }, [searchParams]);

   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [categories, setCategories] = useState<CategoryResponse[]>([]);
   const [universities, setUniversities] = useState<UniversityResponse[]>([]);

   useEffect(() => {
      const loadSearchMeta = async () => {
         try {
            const [categoriesData, universitiesData] = await Promise.all([
               getCategories(),
               getUniversities(),
            ]);
            setCategories(categoriesData);
            setUniversities(universitiesData);
         } catch (error) {
            console.error("Failed to load search metadata:", error);
         }
      };

      loadSearchMeta();
   }, []);

   const handleSearchSubmit = useCallback(() => {
      const normalizedKeyword = keyword.trim();
      const selectedCategoryName = selectedCategories[0]?.trim();
      const normalizedSchool = selectedSchool.trim();
      const normalizedCampus = selectedCampus.trim();

      const selectedCategory = categories.find(
         (category) =>
            category.slug === selectedCategoryName ||
            category.categoryName === selectedCategoryName
      );

      const selectedUniversity = universities.find(
         (university) =>
            university.slug === normalizedSchool ||
            university.shortName === normalizedSchool ||
            university.universityName === normalizedSchool
      );

      const selectedCampusItem = universities
         .flatMap((university) =>
            (university.campuses || []).map((campus) => campus)
         )
         .find((campus) => campus.slug === normalizedCampus || campus.campusName === normalizedCampus);

      const href = buildSearchHref({
         itemSlug: selectedCategory?.slug || undefined,
         universitySlug: selectedUniversity?.slug || undefined,
         campusSlug: selectedCampusItem?.slug || undefined,
         keyword: normalizedKeyword || undefined,
      });

      if (normalizedKeyword) {
         addToHistory(normalizedKeyword);
      }
      router.push(href);
   }, [keyword, selectedCategories, selectedSchool, selectedCampus, categories, universities, router, addToHistory]);

   return (
      <main className="min-h-screen font-sans">
         <div className="pt-24 pb-12 bg-linear-to-b from-[#8cceae] to-[#b8f3d7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

               <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

                  {/* Slogan & Intro Text */}
                  <div className="text-center lg:text-left space-y-2 max-w-lg">
                     <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                        Cũ người mới ta, <br />
                        <span className="text-orange-700">Sinh viên</span> chốt giá!
                     </h1>
                     <p className="text-gray-800 font-medium">Sàn thương mại điện tử dành riêng cho <strong className="text-emerald-600">Sinh Viên</strong>.</p>
                  </div>

                  <div className="hidden lg:block absolute right-10 top-24 opacity-20 pointer-events-none">
                     <Laptop size={120} strokeWidth={1} />
                  </div>

                  {/* --- SEARCH BAR "SUPER APP" STYLE --- */}
                  <div className="w-full lg:max-w-3xl">
                     {/* The White Box Container */}
                     <div className="bg-white p-1.5 rounded-xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

                        {/* 1. Category Dropdown */}
                        <CategorySelector
                           selectedCategories={selectedCategories}
                           setSelectedCategories={setSelectedCategories}
                        />

                        {/* 2. Input Field */}
                        <div className="flex-1 flex items-center px-3 h-12 sm:h-12 bg-gray-50 sm:bg-white rounded-lg sm:rounded-none">
                           <Search size={20} className="text-gray-400 mr-2 shrink-0" />
                           <input
                              type="text"
                              value={keyword}
                              onChange={(event) => setKeyword(event.target.value)}
                              onKeyDown={(event) => {
                                 if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleSearchSubmit();
                                 }
                              }}
                              placeholder="Tìm MacBook, sách Triết, tủ lạnh..."
                              className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500 text-base sm:text-sm font-medium"
                           />
                        </div>

                        {/* 3. Location Selector */}
                        <LocationSelector
                           variant="hero"
                           selectedSchool={selectedSchool}
                           setSelectedSchool={setSelectedSchool}
                           selectedCampus={selectedCampus}
                           setSelectedCampus={setSelectedCampus}
                        />

                        {/* 4. Search Button (Yellow) */}
                        <button
                           onClick={handleSearchSubmit}
                           className="bg-[#FFBA00] hover:bg-[#ffc82a] text-black font-bold h-12 sm:h-full px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                           Tìm kiếm
                        </button>
                     </div>

                     {/* lịch sử từ khoá vừa tìm kiếm (Dưới thanh search) */}
                     {history.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                           <div className="flex flex-wrap gap-2 items-center">
                              {history.map((tag) => (
                                 <span
                                    key={tag}
                                    onClick={() => {
                                       setKeyword(tag);
                                       router.push(
                                          buildSearchHref({
                                             itemSlug: undefined,
                                             universitySlug: undefined,
                                             campusSlug: undefined,
                                             keyword: tag,
                                          })
                                       );
                                    }}
                                    className="px-3 py-1 bg-white/60 hover:bg-white text-xs font-semibold text-gray-800 rounded-full cursor-pointer transition-colors backdrop-blur-sm"
                                 >
                                    ⏱ {tag}
                                 </span>
                              ))}
                           </div>
                           <button 
                              onClick={clearHistory}
                              className="text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors cursor-pointer uppercase tracking-wider px-2"
                           >
                              Xóa tất cả
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
         <Hero />
         {/* Categories Grid */}
         <CategoryGrid />
         <ProductSection />
         <PromoBanner />
         <PopularKeywords />
         {/* <Features /> */}
      </main>
   );
}