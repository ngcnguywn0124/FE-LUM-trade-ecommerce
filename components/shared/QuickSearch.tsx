"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickSearchProps {
  variant?: "default" | "sticky";
  placeholder?: string;
}

const QuickSearch = ({ variant = "default", placeholder = "Tìm kiếm sản phẩm..." }: QuickSearchProps) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Popular searches
  const popularSearches = [
    "Laptop",
    "iPhone",
    "Sách giáo trình",
    "Áo HUTECH",
    "Xe đạp",
    "iPad",
  ];

  const handleSearch = (searchKeyword: string) => {
    if (!searchKeyword.trim()) return;

    // Add to search history
    const newHistory = [searchKeyword, ...searchHistory.filter(h => h !== searchKeyword)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));

    // Navigate to search page
    router.push(`/search?q=${encodeURIComponent(searchKeyword)}`);
    setKeyword("");
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(keyword);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center ${
          variant === "sticky" 
            ? "h-10 bg-white rounded-lg" 
            : "h-12 bg-white rounded-xl"
        } border border-transparent focus-within:border-emerald-500 focus-within:shadow-lg transition-all`}>
          <Search size={variant === "sticky" ? 18 : 20} className="text-gray-400 ml-4" />
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              className="p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
          <button
            type="submit"
            className={`${
              variant === "sticky" ? "px-4 py-2" : "px-6 py-3"
            } bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-r-lg transition-colors`}
          >
            Tìm
          </button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Clock size={16} className="text-gray-400" />
                  Tìm kiếm gần đây
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="space-y-1">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
              <TrendingUp size={16} className="text-gray-400" />
              Tìm kiếm phổ biến
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item)}
                  className="px-4 py-2 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full text-sm font-medium text-gray-700 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickSearch;
