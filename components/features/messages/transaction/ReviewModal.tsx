import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { reviewService } from '@/services/reviewService';

interface ReviewModalProps {
  transactionId: string;
  sellerName: string;
  onClose: () => void;
  onSuccess: () => void;
  currentUserId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ transactionId, sellerName, onClose, onSuccess, currentUserId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;
    setIsLoading(true);
    setError('');

    try {
      await reviewService.createReview(currentUserId, {
        transactionId,
        rating,
        comment,
      });
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">Đánh giá {sellerName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-2 bg-red-50 text-red-600 text-xs rounded-lg">
              {error}
            </div>
          )}
          
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Mức độ hài lòng</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full transition-transform active:scale-90"
                >
                  <Star
                    size={28}
                    className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold mt-1 max-h-0 bg-transparent text-emerald-600">
              {rating === 5 && "Rất hài lòng"}
              {rating === 4 && "Hài lòng"}
              {rating === 3 && "Bình thường"}
              {rating === 2 && "Không hài lòng"}
              {rating === 1 && "Rất tệ"}
            </p>
          </div>

          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn (không bắt buộc)..."
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700 outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Để sau
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none shadow-sm shadow-emerald-200"
            >
              {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
