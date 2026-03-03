"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BadgeCheck, Star, User } from "lucide-react";
import { UserReview } from "@/lib/mockUserProfile";

interface UserReviewsSectionProps {
  reviews: UserReview[];
}

type SortMode = "newest" | "highest" | "lowest";

const UserReviewsSection = ({ reviews }: UserReviewsSectionProps) => {
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

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

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-bold text-gray-900">Nhận xét sau giao dịch</h2>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={ratingFilter}
            onChange={(event) =>
              setRatingFilter(event.target.value === "all" ? "all" : Number(event.target.value))
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none"
            aria-label="Lọc theo số sao"
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>

          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none"
            aria-label="Sắp xếp đánh giá"
          >
            <option value="newest">Mới nhất</option>
            <option value="highest">Tích cực nhất</option>
            <option value="lowest">Cần lưu ý</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {!filteredReviews.length ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-gray-700">Chưa có nhận xét phù hợp bộ lọc</p>
            <p className="mt-1 text-xs text-gray-500">Bạn thử đổi bộ lọc để xem thêm phản hồi từ sinh viên khác.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:bg-gray-100/50">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white bg-white shadow-sm">
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

                  <div className="mt-1.5 flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        className={index < review.rating ? "fill-amber-400" : "fill-gray-200 text-gray-200"}
                      />
                    ))}
                  </div>

                  <p className="mt-2.5 text-sm leading-relaxed text-gray-700 italic">"{review.comment}"</p>
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
    </section>
  );
};

export default UserReviewsSection;
