"use client";

import React from "react";
import ProductCard from "../product/ProductCard";
import { Product } from "@/types";
import EmptyState from "./EmptyState";

interface SearchResultsGridProps {
  products: Product[];
  viewMode: 'grid-3' | 'grid-4';
  isLoading?: boolean;
  onClearFilters?: () => void;
  keyword?: string;
}

const SearchResultsGrid = ({ products, viewMode, isLoading = false, onClearFilters, keyword }: SearchResultsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-5/6 bg-gray-200 rounded-xl mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState type="no-results" keyword={keyword} onClearFilters={onClearFilters} />;
  }

  const gridClass =
    viewMode === 'grid-3'
      ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid ${gridClass} gap-4 md:gap-5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default SearchResultsGrid;
