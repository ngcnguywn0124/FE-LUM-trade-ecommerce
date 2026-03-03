import { Star } from "lucide-react";

interface UserReviewSummaryProps {
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: Record<number, number>;
}

const UserReviewSummary = ({
  averageRating,
  reviewCount,
  ratingBreakdown,
}: UserReviewSummaryProps) => {
  const levels = [5, 4, 3, 2, 1];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-gray-900">Đánh giá từ sinh viên đã giao dịch</h2>
      <p className="mt-1 text-xs text-gray-500">Giúp bạn chọn người trao đổi đáng tin cậy hơn.</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-3xl font-extrabold text-gray-900">{averageRating.toFixed(1)}</p>
          <div className="mt-2 flex justify-center gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className={index < Math.round(averageRating) ? "fill-amber-500" : "text-gray-300"}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">{reviewCount} đánh giá</p>
        </div>

        <div className="space-y-2">
          {levels.map((level) => {
            const count = ratingBreakdown[level] || 0;
            const percent = reviewCount ? Math.round((count / reviewCount) * 100) : 0;

            return (
              <div key={level} className="flex items-center gap-2">
                <span className="w-8 text-xs font-medium text-gray-600">{level} sao</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserReviewSummary;
