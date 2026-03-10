import type { ApiResponse } from './auth';

export interface SpringPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ProductSummaryDto {
  productId: string;
  title: string;
  slug: string;
  condition: 'new' | 'like_new' | 'used' | 'old' | 'broken';
  price: number | null;
  isFree: boolean;
  isNegotiable: boolean;
  listingType: 'sell' | 'exchange' | 'both';
  status: 'available' | 'pending' | 'hidden' | 'expired' | 'sold' | 'deleted';
  viewCount: number;
  favoriteCount: number;
  imageCount: number;
  renewalCount: number;
  isFeatured: boolean;
  createdAt: string;
  expiresAt: string | null;
  thumbnailUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  universityShortName: string | null;
  campusName: string | null;
  sellerId: string | null;
  sellerName: string | null;
  sellerAvatar: string | null;
}

export interface ProductImageDto {
  imageId: string;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductDetailDto {
  productId: string;
  title: string;
  description: string;
  slug: string;
  condition: 'new' | 'like_new' | 'used' | 'old' | 'broken';
  price: number | null;
  isFree: boolean;
  isNegotiable: boolean;
  listingType: 'sell' | 'exchange' | 'both';
  exchangePreferences: string | null;
  transactionType: 'meetup' | 'delivery' | 'both' | null;
  meetingPoint: string | null;
  contactName: string | null;
  contactPhone: string | null;
  zaloLink: string | null;
  facebookLink: string | null;
  status: 'available' | 'pending' | 'hidden' | 'expired' | 'sold' | 'deleted';
  viewCount: number;
  favoriteCount: number;
  messageCount: number;
  isFeatured: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  soldAt: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  universityId: string | null;
  universityName: string | null;
  universityShortName: string | null;
  campusId: string | null;
  campusName: string | null;
  sellerId: string | null;
  sellerName: string | null;
  sellerAvatar: string | null;
  sellerReputation: number | null;
  images: ProductImageDto[];
}

export interface ProductFilterParams {
  categoryId?: string;
  universityId?: string;
  campusId?: string;
  listingType?: 'sell' | 'exchange' | 'both';
  condition?: 'new' | 'like_new' | 'used' | 'old' | 'broken';
  isFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProductAttributeValueRequest {
  attributeId: string;
  value: string;
}

export interface ProductRequestPayload {
  title: string;
  description: string;
  categoryId: string;
  condition: 'new' | 'like_new' | 'used' | 'old' | 'broken';
  price?: number;
  isFree?: boolean;
  isNegotiable?: boolean;
  listingType?: 'sell' | 'exchange' | 'both';
  exchangePreferences?: string;
  transactionType?: 'meetup' | 'delivery' | 'both';
  meetingPoint?: string;
  universityId?: string;
  campusId?: string;
  contactName?: string;
  contactPhone?: string;
  zaloLink?: string;
  facebookLink?: string;
  newTagNames?: string[];
  attributeValues?: ProductAttributeValueRequest[];
}

export type ProductPageApiResponse = ApiResponse<SpringPage<ProductSummaryDto>>;
export type ProductDetailApiResponse = ApiResponse<ProductDetailDto>;
