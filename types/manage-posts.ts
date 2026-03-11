// Types for Manage Posts feature

export type PostStatus = 'active' | 'expired' | 'pending' | 'hidden' | 'sold' | 'admin_hidden';

export interface ManagedPost {
  id: string;
  title: string;
  price: string;
  isFree: boolean;
  image: string;
  imageCount: number;
  category: string;
  subcategory: string;
  condition: 'new' | 'like_new' | 'used' | 'old' | 'broken';
  school: string;
  campus?: string;
  status: PostStatus;
  createdAt: string;       // ISO date string
  expiresAt: string;       // ISO date string
  renewedCount: number;    // Số lần gia hạn
  stats: {
    views: number;
    favorites: number;
    messages: number;
  };
}

export type PostSortOption = 'newest' | 'oldest' | 'most-views' | 'most-favorites';

export interface ManagePostsFilters {
  status: PostStatus | 'all';
  sortBy: PostSortOption;
  search: string;
}

export interface PostsAggregate {
  total: number;
  active: number;
  expired: number;
  pending: number;
  hidden: number;
  sold: number;
  totalViews: number;
  totalFavorites: number;
  totalMessages: number;
  rating: number;
  ratingCount: number;
}
