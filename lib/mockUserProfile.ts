import { Product } from "@/types";
import type { ProfileResponse, UserProfile, UserProfileData, UserReview } from "@/types/profile";

const REVIEWER_NAMES = [
  "Minh Anh",
  "Tuấn Kiệt",
  "Quỳnh Như",
  "Bảo Trân",
  "Khánh Duy",
  "Gia Hân",
  "Đức Huy",
  "Thuỳ Linh",
  "Mỹ Duyên",
  "Hoàng Nam",
  "Phúc An",
  "Nhật Minh",
];

const REVIEW_TIMES = [
  "2 ngày trước",
  "4 ngày trước",
  "1 tuần trước",
  "2 tuần trước",
  "3 tuần trước",
  "1 tháng trước",
  "2 tháng trước",
  "3 tháng trước",
];

const REVIEW_TEMPLATES: Record<number, string[]> = {
  5: [
    "Phản hồi nhanh, mô tả đúng tình trạng món đồ. Hẹn trong trường đúng giờ và giao dịch rất ổn.",
    "Đồ đúng như ảnh, cho kiểm tra kỹ trước khi chốt nên rất yên tâm với sinh viên mua lần đầu.",
    "Bạn này thân thiện, hỗ trợ nhiệt tình từ lúc nhắn tin đến lúc nhận đồ.",
  ],
  4: [
    "Đồ ổn và đúng mô tả. Nếu phản hồi nhanh hơn chút nữa thì trải nghiệm sẽ trọn vẹn hơn.",
    "Giao dịch mượt, nói chuyện lịch sự và có hỗ trợ test trước khi chốt.",
    "Giá hợp lý với ngân sách sinh viên, chất lượng thực tế khá tốt.",
  ],
  3: [
    "Đồ dùng được, nhưng nên hỏi kỹ thêm về phụ kiện đi kèm trước khi gặp giao dịch.",
    "Tổng thể ổn, có vài chi tiết nhỏ chưa đúng kỳ vọng ban đầu.",
    "Không có lỗi lớn, trải nghiệm ở mức tạm ổn cho giao dịch nhanh.",
  ],
  2: [
    "Phản hồi hơi chậm, cần cải thiện khâu xác nhận lịch hẹn trong trường.",
    "Đồ chưa đúng kỳ vọng, mong mô tả rõ hơn để sinh viên khác dễ cân nhắc.",
  ],
  1: [
    "Trải nghiệm chưa tốt, cần minh bạch hơn khi đăng thông tin sản phẩm.",
    "Giao dịch chưa như mong đợi, nên cập nhật mô tả kỹ hơn trước khi đăng tin.",
  ],
};

const toSeed = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const getStableNumber = (base: number, offset: number, min: number, max: number) => {
  const range = max - min + 1;
  return min + ((base * 37 + offset * 11) % range);
};

const getReviewRatings = (sellerSeed: number, count: number): number[] => {
  const ratings: number[] = [];

  for (let i = 0; i < count; i += 1) {
    const seed = (sellerSeed * 13 + i * 17) % 100;
    if (seed < 55) ratings.push(5);
    else if (seed < 82) ratings.push(4);
    else if (seed < 92) ratings.push(3);
    else if (seed < 98) ratings.push(2);
    else ratings.push(1);
  }

  return ratings;
};

const buildReviewComment = (rating: number, index: number) => {
  const templates = REVIEW_TEMPLATES[rating] || REVIEW_TEMPLATES[4];
  return templates[index % templates.length];
};

const buildReviews = (userId: string, listings: Product[]): UserReview[] => {
  const userSeed = toSeed(userId);
  const reviewCount = getStableNumber(userSeed, 5, 12, 24);
  const ratings = getReviewRatings(userSeed, reviewCount);

  return ratings.map((rating, index) => {
    const product = listings[index % listings.length];

    return {
      id: userSeed * 1000 + index + 1,
      reviewerName: REVIEWER_NAMES[(userSeed + index) % REVIEWER_NAMES.length],
      rating,
      createdAt: REVIEW_TIMES[(userSeed + index * 2) % REVIEW_TIMES.length],
      comment: buildReviewComment(rating, index),
      productName: product?.name || "Sản phẩm đã giao dịch",
      isVerifiedPurchase: index % 4 !== 0,
    };
  });
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
    breakdown[review.rating] += 1;
  });

  return breakdown;
};

const getAverageRating = (reviews: UserReview[]): number => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / reviews.length).toFixed(1));
};

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
  return normalizedStatus !== "deleted" && normalizedStatus !== "hidden" && normalizedStatus !== "admin_hidden";
};

export const getUserProfileData = (
  profileResponse: ProfileResponse,
  products: Product[]
): UserProfileData => {
  const userSeed = toSeed(profileResponse.userId);
  const normalizedUserId = normalizeId(profileResponse.userId);

  const listings = products.filter((item) => normalizeId(item.seller?.id) === normalizedUserId);
  const visibleListings = listings.filter((item) => isCountableListingStatus(item.status));
  const primaryListing = listings[0];
  const reviewProducts = listings.length ? listings : products.slice(0, 10);
  const reviews = buildReviews(profileResponse.userId, reviewProducts);
  const ratingBreakdown = buildRatingBreakdown(reviews);
  const reputationScore = Number(profileResponse.reputationScore ?? 0);
  const averageRating = getAverageRating(reviews) || Math.max(0, Math.min(5, reputationScore));

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
    rating: profileResponse.rating ?? Number(averageRating.toFixed(1)),
    reviewCount: profileResponse.reviewCount ?? reviews.length,
    totalListings: profileResponse.totalListings ?? visibleListings.length,
    totalSold: profileResponse.totalSold ?? profileResponse.totalSales ?? getStableNumber(userSeed, 1, listings.length, listings.length + 30),
    followers: profileResponse.followersCount || getStableNumber(userSeed, 2, 10, 200),
    responseRate: Number(profileResponse.responseRate || getStableNumber(userSeed, 3, 80, 99)),
    responseTime: profileResponse.responseTime || `${getStableNumber(userSeed, 4, 5, 30)} phút`,
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
