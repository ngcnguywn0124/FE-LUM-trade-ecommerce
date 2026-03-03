"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";
import { UserReview } from "@/lib/mockUserProfile";

interface UserReviewsSectionProps {
  reviews: UserReview[];
}

type SortMode = "newest" | "highest" | "lowest";

const UserReviewsSection = ({ reviews }: UserReviewsSectionProps) => {
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [visibleCount, setVisibleCount] = useState(5);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingStats = useMemo(() => {
    const stats = [0, 0, 0, 0, 0, 0]; // index 1-5
    reviews.forEach(r => stats[r.rating]++);
    return stats;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const matched =
      ratingFilter === "all"
        ? reviews
        : reviews.filter((review) => review.rating === ratingFilter);

    if (sortMode === "highest") {
      return [...matched].sort((a, b) => b.rating - a.rating);
    }

    if (sortMode === "lowest") {
      return [...matched].sort((a, b) => a.rating - b.rating);
    }

    return matched;
  }, [reviews, ratingFilter, sortMode]);

  const visibleReviews = useMemo(() => {
    return filteredReviews.slice(0, visibleCount);
  }, [filteredReviews, visibleCount]);

  const hasMore = visibleCount < filteredReviews.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Nhận xét sau giao dịch</h2>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none cursor-pointer"
            aria-label="Sắp xếp đánh giá"
          >
            <option value="newest">Mới nhất</option>
            <option value="highest">Tích cực nhất</option>
            <option value="lowest">Cần lưu ý</option>
          </select>
        </div>
      </div>

      {/* Summary Rating Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-6 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0">
          <div className="text-4xl font-black text-gray-900 mb-1">{averageRating}</div>
          <div className="flex items-center gap-0.5 text-amber-400 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < Math.round(Number(averageRating)) ? "fill-amber-400" : "fill-gray-200 text-gray-200"} />
            ))}
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{reviews.length} đánh giá</div>
        </div>

        <div className="md:col-span-8 flex flex-col gap-2 justify-center">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setRatingFilter(ratingFilter === star ? "all" : star)}
              className={`flex items-center gap-3 group transition-all cursor-pointer ${ratingFilter !== "all" && ratingFilter !== star ? "opacity-40" : "opacity-100"}`}
            >
              <span className="text-xs font-bold text-gray-600 w-10 shrink-0">{star} sao</span>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${star >= 4 ? "bg-emerald-500" : star >= 3 ? "bg-amber-400" : "bg-rose-400"}`}
                  style={{ width: `${(ratingStats[star] / reviews.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-400 w-8">{ratingStats[star]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {!filteredReviews.length ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-gray-700">Chưa có nhận xét phù hợp bộ lọc</p>
            <p className="mt-1 text-xs text-gray-500">Bạn thử đổi bộ lọc để xem thêm phản hồi từ sinh viên khác.</p>
          </div>
        ) : (
          visibleReviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:bg-gray-100/50">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white bg-white">
                  <Image 
                    src="/user/avatar-user-profile-default.png" // Cập nhật sau khi có dữ liệu avatar thực tế trong mock
                    alt={review.reviewerName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{review.reviewerName}</p>
                      {review.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-tight">
                          <BadgeCheck size={12} strokeWidth={2.5} />
                          Đã chốt đơn
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-gray-400">{review.createdAt}</span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          className={index < review.rating ? "fill-amber-400" : "fill-gray-200 text-gray-200"}
                        />
                      ))}
                    </div>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      review.rating >= 4 ? "bg-emerald-50 text-emerald-600" : 
                      review.rating >= 3 ? "bg-amber-50 text-amber-600" : 
                      "bg-rose-50 text-rose-600"
                    }`}>
                      {review.rating === 5 ? "Rất hài lòng" :
                       review.rating === 4 ? "Hài lòng" :
                       review.rating === 3 ? "Bình thường" :
                       review.rating === 2 ? "Không hài lòng" : "Rất tệ"}
                    </span>
                  </div>

                  <p className="mt-2.5 text-sm leading-relaxed text-gray-700 italic">&quot;{review.comment}&quot;</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <span className="rounded-md bg-gray-200 px-1.5 py-0.5">Sản phẩm:</span>
                    <span className="text-gray-900 transition-colors hover:text-emerald-600 cursor-pointer">{review.productName}</span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center pb-2">
          <button
            onClick={handleLoadMore}
            className="px-10 py-3 rounded-full border-2 border-slate-100 font-bold text-gray-700 hover:bg-slate-50 transition-all hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
          >
            Xem Thêm Đánh Giá
          </button>
        </div>
      )}
    </section>
  );
};

export default UserReviewsSection;
