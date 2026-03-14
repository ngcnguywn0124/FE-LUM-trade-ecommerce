import apiClient from '@/lib/apiClient';
import type { Product } from '@/types';
import type { ManagedPost, PostStatus } from '@/types/manage-posts';
import type {
  ProductDetailApiResponse,
  ProductFilterParams,
  ProductPageApiResponse,
  ProductRequestPayload,
  ProductSummaryDto,
  ProductDetailDto,
  SpringPage,
} from '@/types/product-api';
import type { ApiResponse } from '@/types/auth';

const FALLBACK_IMAGE = '/template.png';

const conditionToUi = (condition?: string): Product['condition'] => {
  if (!condition) return 'used';
  if (condition === 'like-new') return 'like_new';
  return condition as Product['condition'];
};

const statusToManageStatus = (status: string): PostStatus => {
  if (status === 'available') return 'active';
  if (status === 'pending') return 'pending';
  if (status === 'hidden') return 'hidden';
  if (status === 'admin_hidden') return 'admin_hidden';
  if (status === 'expired') return 'expired';
  if (status === 'sold') return 'sold';
  return 'active';
};

const formatVnd = (price?: number | null, isFree?: boolean): string => {
  if (isFree) return 'Miễn phí';
  if (!price) return '0đ';
  return `${Math.round(price).toLocaleString('vi-VN')}đ`;
};

const formatRelativeTime = (iso?: string): string => {
  if (!iso) return 'Vừa xong';

  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;

  const months = Math.floor(days / 30);
  return `${months} tháng trước`;
};

const normalizePriceForManage = (price?: number | null, isFree?: boolean): string => {
  if (isFree || !price) return '0';
  return Math.round(price).toString();
};

const buildProductFormData = (payload: ProductRequestPayload, images: File[]): FormData => {
  const formData = new FormData();
  formData.append(
    'data',
    new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    }),
    'data.json'
  );

  images.forEach((image) => formData.append('images', image));
  return formData;
};

export const mapSummaryToCardProduct = (item: ProductSummaryDto): Product => ({
  id: item.productId,
  slug: item.slug,
  name: item.title,
  price: formatVnd(item.price, item.isFree),
  school: item.universityShortName || 'Đang cập nhật',
  campus: item.campusName || undefined,
  image: item.thumbnailUrl || FALLBACK_IMAGE,
  tag: item.isFeatured ? 'Nổi bật' : undefined,
  time: formatRelativeTime(item.createdAt),
  imageCount: item.imageCount || 1,
  viewCount: item.viewCount || 0,
  favoriteCount: item.favoriteCount || 0,
  condition: conditionToUi(item.condition),
  category: item.categoryName || undefined,
  categorySlug: item.categorySlug || undefined,
  seller: {
    id: item.sellerId || 'unknown-seller',
    name: item.sellerName || 'Người bán ẩn danh',
    avatar: item.sellerAvatar || undefined,
  },
});

export const mapDetailToCardProduct = (item: ProductDetailDto): Product => ({
  id: item.productId,
  slug: item.slug,
  name: item.title,
  price: formatVnd(item.price, item.isFree),
  school: item.universityShortName || 'Đang cập nhật',
  campus: item.campusName || undefined,
  image: item.images[0]?.imageUrl || FALLBACK_IMAGE,
  tag: item.isFeatured ? 'Nổi bật' : undefined,
  time: formatRelativeTime(item.createdAt),
  imageCount: Math.max(item.images.length, 1),
  condition: conditionToUi(item.condition),
  category: item.categoryName || undefined,
  categorySlug: item.categorySlug || undefined,
  seller: {
    id: item.sellerId || 'unknown-seller',
    name: item.sellerName || 'Người bán ẩn danh',
    avatar: item.sellerAvatar || undefined,
    rating: item.sellerReputation ?? undefined,
  },
});

export const mapSummaryToManagedPost = (item: ProductSummaryDto): ManagedPost => {
  const formatPriceForManage = (price: number | null, isFree: boolean | null | undefined) => {
    if (isFree) return 'Miễn phí';
    if (!price) return '0đ';
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  return {
    id: item.productId,
    slug: item.slug,
    title: item.title,
    price: formatPriceForManage(item.price, item.isFree),
    isFree: Boolean(item.isFree),
    image: item.thumbnailUrl || FALLBACK_IMAGE,
    imageCount: item.imageCount || 1,
    category: item.categoryName || 'Khác',
    subcategory: item.categoryName || 'Khác',
    condition: (conditionToUi(item.condition) as ManagedPost['condition']) || 'used',
    school: item.universityShortName || 'Đang cập nhật',
    campus: item.campusName || undefined,
    status: statusToManageStatus(item.status),  previousStatus: item.previousStatus || undefined,    createdAt: item.createdAt,
    expiresAt: item.expiresAt || item.createdAt,
    renewedCount: item.renewalCount || 0,
    stats: {
      views: item.viewCount || 0,
      favorites: item.favoriteCount || 0,
      messages: 0,
    },
  };
};

export const computeAggregate = (posts: ManagedPost[]) => ({
  total: posts.length,
  active: posts.filter((p) => p.status === 'active').length,
  expired: posts.filter((p) => p.status === 'expired').length,
  pending: posts.filter((p) => p.status === 'pending').length,
  hidden: posts.filter((p) => p.status === 'hidden' || p.status === 'admin_hidden').length,
  sold: posts.filter((p) => p.status === 'sold').length,
  totalViews: posts.reduce((acc, p) => acc + p.stats.views, 0),
  totalFavorites: posts.reduce((acc, p) => acc + p.stats.favorites, 0),
  totalMessages: posts.reduce((acc, p) => acc + p.stats.messages, 0),
  rating: 0,
  ratingCount: 0,
});

export async function getProducts(params: ProductFilterParams = {}): Promise<SpringPage<ProductSummaryDto>> {
  const res = await apiClient.get<ProductPageApiResponse>('/products', { params });
  return res.data.data;
}

export async function searchProducts(keyword: string, page = 0, size = 20): Promise<SpringPage<ProductSummaryDto>> {
  const res = await apiClient.get<ProductPageApiResponse>('/products/search', {
    params: { keyword, page, size },
  });
  return res.data.data;
}

export async function getTrendingProducts(page = 0, size = 20): Promise<SpringPage<ProductSummaryDto>> {
  const res = await apiClient.get<ProductPageApiResponse>('/products/trending', {
    params: { page, size },
  });
  return res.data.data;
}

export async function getProductById(id: string): Promise<ProductDetailDto> {
  const res = await apiClient.get<ProductDetailApiResponse>(`/products/${id}`);
  return res.data.data;
}

export async function getProductBySlug(slug: string): Promise<ProductDetailDto> {
  const res = await apiClient.get<ProductDetailApiResponse>(`/products/slug/${slug}`);
  return res.data.data;
}

export async function createProduct(payload: ProductRequestPayload, images: File[]): Promise<ProductDetailDto> {
  const res = await apiClient.post<ProductDetailApiResponse>(
    '/products',
    buildProductFormData(payload, images),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return res.data.data;
}

export async function updateProduct(id: string, payload: ProductRequestPayload, images: File[] = []): Promise<ProductDetailDto> {
  const res = await apiClient.put<ProductDetailApiResponse>(
    `/products/${id}`,
    buildProductFormData(payload, images),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return res.data.data;
}

export async function setPrimaryImage(productId: string, imageId: string): Promise<void> {
  await apiClient.patch(`/products/${productId}/primary-image/${imageId}`);
}

export async function getMyProducts(status?: string, page = 0, size = 20): Promise<SpringPage<ProductSummaryDto>> {
  const res = await apiClient.get<ProductPageApiResponse>('/products/my', {
    params: {
      status,
      page,
      size,
    },
  });

  return res.data.data;
}

export async function getAllProductsForAdmin(
  status?: string,
  keyword?: string,
  page = 0,
  size = 20
): Promise<SpringPage<ProductSummaryDto>> {
  const res = await apiClient.get<ProductPageApiResponse>('/products/admin', {
    params: { status, keyword, page, size },
  });
  return res.data.data;
}

export async function approveProduct(id: string): Promise<ProductDetailDto> {
  const res = await apiClient.patch<ProductDetailApiResponse>(`/products/${id}/approve`);
  return res.data.data;
}

export async function hideProductByAdmin(id: string): Promise<ProductDetailDto> {
  const res = await apiClient.patch<ProductDetailApiResponse>(`/products/${id}/hide`);
  return res.data.data;
}

export async function toggleFeatured(id: string): Promise<ProductDetailDto> {
  const res = await apiClient.patch<ProductDetailApiResponse>(`/products/${id}/feature`);
  return res.data.data;
}

export async function markAsSold(id: string): Promise<ProductDetailDto> {
  const res = await apiClient.patch<ProductDetailApiResponse>(`/products/${id}/sold`);
  return res.data.data;
}

export async function toggleHidden(id: string): Promise<ProductDetailDto> {
  const res = await apiClient.patch<ProductDetailApiResponse>(`/products/${id}/toggle-hidden`);
  return res.data.data;
}

export async function renewProduct(id: string, days = 30): Promise<ProductDetailDto> {
  const res = await apiClient.patch<ProductDetailApiResponse>(`/products/${id}/renew`, null, {
    params: { days },
  });
  return res.data.data;
}

export async function deleteProductById(id: string): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
}

export async function hardDeleteProductById(id: string): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(`/products/${id}/hard`);
}
