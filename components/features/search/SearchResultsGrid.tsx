"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../product/ProductCard";
import ProductCardList from "../product/ProductCardList";
import { Product } from "@/types";
import EmptyState from "./EmptyState";

interface SearchResultsGridProps {
  products: Product[];
  viewMode: 'grid-4' | 'list';
  isLoading?: boolean;
  onClearFilters?: () => void;
  keyword?: string;
}

const SearchResultsGrid = ({ products, viewMode, isLoading = false, onClearFilters, keyword }: SearchResultsGridProps) => {
  return (
    <div className="relative min-h-[400px]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`grid ${viewMode === 'list' ? 'flex flex-col' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-4 md:gap-5`}
          >
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[5/6] bg-gray-100 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState type="no-results" keyword={keyword} onClearFilters={onClearFilters} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
              >
                {viewMode === 'list' ? (
                  <ProductCardList product={product} />
                ) : (
                  <ProductCard product={product} />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResultsGrid;
