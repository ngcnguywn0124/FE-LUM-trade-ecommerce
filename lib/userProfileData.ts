import type { Product } from "@/types";
import type { ReviewResponse } from "@/services/reviewService";
import type { ProfileResponse, UserProfile, UserProfileData, UserReview } from "@/types/profile";

const formatRelativeTime = (iso: string): string => {
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

const normalizeId = (value: string | number | undefined | null): string => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const isCountableListingStatus = (status?: string) => {
  if (!status) return true;
  const normalizedStatus = status.trim().toLowerCase();
  return normalizedStatus !== "deleted" && normalizedStatus !== "admin_hidden";
};

const buildRatingBreakdown = (reviews: UserReview[]): Record<number, number> => {
  const breakdown: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      breakdown[review.rating] += 1;
    }
  });

  return breakdown;
};

const getAverageRating = (reviews: UserReview[]): number => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / reviews.length).toFixed(1));
};

export const mapReviewResponseToUserReview = (review: ReviewResponse): UserReview => ({
  id: Number(review.reviewId) || Date.parse(review.createdAt) || Math.floor(Math.random() * 10_000_000),
  reviewerName: review.reviewerName,
  reviewerAvatar: review.reviewerAvatarUrl || undefined,
  rating: review.rating,
  createdAt: formatRelativeTime(review.createdAt),
  comment: review.comment,
  productName: review.productName || "Sản phẩm đã giao dịch",
  isVerifiedPurchase: Boolean(review.isVerifiedPurchase),
});

export const getUserProfileData = (
  profileResponse: ProfileResponse,
  products: Product[],
  reviews: UserReview[]
): UserProfileData => {
  const normalizedUserId = normalizeId(profileResponse.userId);

  const listings = products.filter((item) => normalizeId(item.seller?.id) === normalizedUserId);
  const visibleListings = listings.filter((item) => isCountableListingStatus(item.status));
  const primaryListing = listings[0];
  const ratingBreakdown = buildRatingBreakdown(reviews);
  const averageRating = getAverageRating(reviews);

  const backendRating = Number(profileResponse.rating ?? 0);
  const resolvedRating = backendRating > 0
    ? backendRating
    : Number(profileResponse.reputationScore ?? 0) > 0
      ? Number(profileResponse.reputationScore)
      : averageRating;

  const reviewCountFromApi = Number(profileResponse.reviewCount ?? 0);
  const resolvedReviewCount = Math.max(reviewCountFromApi, reviews.length);

  const totalListingsFromApi = Number(profileResponse.totalListings ?? 0);
  const resolvedTotalListings = Math.max(totalListingsFromApi, visibleListings.length);

  const totalSales = Number(profileResponse.totalSales ?? 0);
  const totalPurchases = Number(profileResponse.totalPurchases ?? 0);
  const totalSoldFromApi = Number(profileResponse.totalSold ?? 0);
  const resolvedTotalTransactions = Math.max(totalSoldFromApi, totalSales + totalPurchases);

  const createdAt = profileResponse.createdAt ? new Date(profileResponse.createdAt) : null;
  const joinDate = createdAt && !Number.isNaN(createdAt.getTime())
    ? `Tháng ${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`
    : "Chưa cập nhật";

  const lastActiveTimestamp = profileResponse.lastSeenAt || profileResponse.lastLoginAt;
  const lastActiveDate = lastActiveTimestamp ? new Date(lastActiveTimestamp) : null;
  const lastActive = lastActiveDate && !Number.isNaN(lastActiveDate.getTime())
    ? formatRelativeTime(lastActiveDate.toISOString())
    : "Vừa mới xong";

  const location =
    profileResponse.location ||
    (primaryListing
      ? `${primaryListing.school}${primaryListing.campus ? ` • ${primaryListing.campus}` : ""}`
      : "Chưa cập nhật địa chỉ");

  const profile: UserProfile = {
    id: profileResponse.userId,
    name: profileResponse.fullName,
    avatar: profileResponse.avatarUrl || primaryListing?.seller?.avatar,
    cover: profileResponse.coverUrl || undefined,
    rating: resolvedRating,
    reviewCount: resolvedReviewCount,
    totalListings: resolvedTotalListings,
    totalSold: resolvedTotalTransactions,
    followers: profileResponse.followersCount || 0,
    responseRate: Number(profileResponse.responseRate || 0),
    responseTime: profileResponse.responseTime || "Chưa cập nhật",
    joinDate,
    lastActive,
    isOnline: profileResponse.isOnline,
    lastSeenAt: profileResponse.lastSeenAt,
    location,
  };

  return {
    profile,
    listings,
    reviews,
    ratingBreakdown,
  };
};