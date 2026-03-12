import { Product } from "@/types";

export interface UserReview {
  id: number;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  createdAt: string;
  comment: string;
  productName: string;
  isVerifiedPurchase: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  totalListings: number;
  totalSold: number;
  followers: number;
  responseRate: number;
  responseTime: string;
  joinDate: string;
  lastActive: string;
  location: string;
}

export interface UserProfileData {
  profile: UserProfile;
  listings: Product[];
  reviews: UserReview[];
  ratingBreakdown: Record<number, number>;
}

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

export const getUserProfileData = (
  userId: string,
  products: Product[]
): UserProfileData | null => {
  if (!userId) return null;

  const userSeed = toSeed(userId);

  const listings = products.filter((item) => item.seller?.id === userId);
  if (!listings.length) return null;

  const primaryListing = listings[0];
  const reviews = buildReviews(userId, listings);
  const ratingBreakdown = buildRatingBreakdown(reviews);
  const averageRating = getAverageRating(reviews);

  const profile: UserProfile = {
    id: userId,
    name: primaryListing.seller?.name || `User ${userId}`,
    avatar: primaryListing.seller?.avatar,
    rating: averageRating || Number((primaryListing.seller?.rating || 4.5).toFixed(1)),
    reviewCount: reviews.length,
    totalListings: listings.length,
    totalSold: getStableNumber(userSeed, 1, listings.length + 8, listings.length + 55),
    followers: getStableNumber(userSeed, 2, 40, 600),
    responseRate: getStableNumber(userSeed, 3, 88, 99),
    responseTime: `${getStableNumber(userSeed, 4, 5, 35)} phút`,
    joinDate: `Tháng ${1 + (userSeed % 12)}/${2021 + (userSeed % 3)}`,
    lastActive: userSeed % 2 === 0 ? "5p trước" : "1h trước",
    location: `${primaryListing.school}${primaryListing.campus ? ` • ${primaryListing.campus}` : ""}`,
  };

  return {
    profile,
    listings,
    reviews,
    ratingBreakdown,
  };
};
