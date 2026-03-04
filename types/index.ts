// Product Types
export interface Product {
  id: number;
  name: string;
  price: string;
  school: string;
  campus?: string;
  image: string;
  tag?: string;
  time?: string;
  imageCount?: number;
  condition?: 'new' | 'like-new' | 'used' | 'for-parts';
  category?: string;
  seller?: {
    id: number;
    name: string;
    avatar?: string;
    rating?: number;
  };
}

// Filter Types
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';
export type ConditionFilter = 'all' | 'new' | 'like-new' | 'used';
export type PriceRange = {
  min: number;
  max: number;
};

export interface SearchFilters {
  category?: string;
  subcategory?: string; // Thêm subcategory
  condition?: ConditionFilter;
  priceRange?: PriceRange;
  school?: string;
  campus?: string;
  sortBy?: SortOption;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  icon?: string;
  count?: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  count?: number;
  parentCategory: string;
}

// School & Campus Types
export interface School {
  id: string;
  name: string;
  campuses: Campus[];
}

export interface Campus {
  id: string;
  name: string;
  schoolId: string;
}

export * from './notifications';
