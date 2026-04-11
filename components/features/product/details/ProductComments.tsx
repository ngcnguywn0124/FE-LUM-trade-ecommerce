"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Send, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import {
  createProductComment,
  createProductCommentReply,
  getProductComments,
  toggleProductCommentLike,
  type ProductCommentResponse,
} from "@/services/productCommentService";

interface ProductCommentsProps {
  productId: string;
}

const formatCommentTime = (isoDate: string) => {
  const MIN_VALID_YEAR = 2000;

  const toValidDate = (date: Date): Date | null => {
    if (Number.isNaN(date.getTime())) return null;
    if (date.getUTCFullYear() < MIN_VALID_YEAR) return null;
    return date;
  };

  const parseCommentDate = (value: unknown): Date | null => {
    if (value === null || value === undefined) return null;

    if (value instanceof Date) return toValidDate(value);

    if (typeof value === "number") {
      if (!Number.isFinite(value) || value <= 0) return null;
      const millis = value < 1_000_000_000_000 ? value * 1000 : value;
      return toValidDate(new Date(millis));
    }

    if (typeof value === "string") {
      const normalized = value.trim();
      if (!normalized) return null;

      if (/^\d+$/.test(normalized)) {
        const numericValue = Number(normalized);
        if (!Number.isFinite(numericValue) || numericValue <= 0) return null;
        const millis = numericValue < 1_000_000_000_000 ? numericValue * 1000 : numericValue;
        return toValidDate(new Date(millis));
      }

      return toValidDate(new Date(normalized));
    }

    return null;
  };

  const createdDate = parseCommentDate(isoDate);
  if (!createdDate) return "Vừa xong";

  const diffInMinutes = Math.max(1, Math.floor((Date.now() - createdDate.getTime()) / 60000));
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} ngày trước`;
  return createdDate.toLocaleDateString("vi-VN");
};

const countComments = (items: ProductCommentResponse[]): number =>
  items.reduce((total, comment) => total + 1 + countComments(comment.replies || []), 0);

const findCommentById = (
  items: ProductCommentResponse[],
  commentId: string | null,
): ProductCommentResponse | null => {
  if (!commentId) return null;
  for (const comment of items) {
    if (comment.commentId === commentId) return comment;
    const reply = findCommentById(comment.replies || [], commentId);
    if (reply) return reply;
  }
  return null;
};

const replaceCommentInTree = (
  items: ProductCommentResponse[],
  updatedComment: ProductCommentResponse,
): ProductCommentResponse[] =>
  items.map((comment) => {
    if (comment.commentId === updatedComment.commentId) {
      return {
        ...comment,
        ...updatedComment,
        replies: updatedComment.replies.length > 0 ? updatedComment.replies : comment.replies,
      };
    }

    if (!comment.replies.length) {
      return comment;
    }

    return {
      ...comment,
      replies: replaceCommentInTree(comment.replies, updatedComment),
    };
  });

const appendReplyToTree = (
  items: ProductCommentResponse[],
  parentCommentId: string,
  reply: ProductCommentResponse,
): ProductCommentResponse[] =>
  items.map((comment) => (
    comment.commentId === parentCommentId
      ? { ...comment, replies: [...comment.replies, reply] }
      : comment
  ));

const ProductComments = ({ productId }: ProductCommentsProps) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<ProductCommentResponse[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingReplyToId, setSubmittingReplyToId] = useState<string | null>(null);
  const [likingCommentIds, setLikingCommentIds] = useState<string[]>([]);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadComments = async () => {
      setIsLoading(true);
      try {
        const page = await getProductComments(productId, 0, 20);
        if (!isMounted) return;
        setComments(page.content);
        setTotalComments(Math.max(page.totalElements, countComments(page.content)));
      } catch {
        if (!isMounted) return;
        setComments([]);
        setTotalComments(0);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadComments();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const commentCountLabel = useMemo(
    () => Math.max(totalComments, countComments(comments)),
    [totalComments, comments],
  );
  const replyingTarget = useMemo(
    () => findCommentById(comments, replyingToId),
    [comments, replyingToId],
  );

  const requireUser = () => {
    if (user) return true;
    toast.error("Vui lòng đăng nhập để tiếp tục");
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!requireUser()) return;

    setIsSubmitting(true);
    try {
      const created = await createProductComment(productId, { content: newComment });
      setComments((prev) => [created, ...prev]);
      setTotalComments((prev) => prev + 1);
      setNewComment("");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(message || "Không thể gửi bình luận");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleReply = (commentId: string) => {
    if (!requireUser()) return;

    setReplyingToId((prev) => {
      if (prev === commentId) {
        setReplyContent("");
        return null;
      }
      setReplyContent("");
      return commentId;
    });
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingToId || !replyContent.trim()) return;
    if (!requireUser()) return;

    setSubmittingReplyToId(replyingToId);
    try {
      const created = await createProductCommentReply(productId, replyingToId, { content: replyContent });
      const parentCommentId = created.parentCommentId || replyingToId;

      setComments((prev) => appendReplyToTree(prev, parentCommentId, created));
      setTotalComments((prev) => prev + 1);
      setReplyContent("");
      setReplyingToId(null);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(message || "Không thể gửi phản hồi");
    } finally {
      setSubmittingReplyToId(null);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    if (!requireUser()) return;
    if (likingCommentIds.includes(commentId)) return;

    setLikingCommentIds((prev) => [...prev, commentId]);
    try {
      const updated = await toggleProductCommentLike(productId, commentId);
      setComments((prev) => replaceCommentInTree(prev, updated));
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(message || "Không thể cập nhật lượt thích");
    } finally {
      setLikingCommentIds((prev) => prev.filter((id) => id !== commentId));
    }
  };

  const renderReplyForm = (commentId: string) => {
    if (replyingToId !== commentId) return null;

    return (
      <form onSubmit={handleSubmitReply} className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
        <p className="mb-2 text-xs font-medium text-emerald-700">
          {replyingTarget ? `Đang phản hồi ${replyingTarget.userName}` : "Phản hồi bình luận"}
        </p>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Viết phản hồi của bạn..."
          disabled={submittingReplyToId === commentId}
          className="h-20 w-full resize-none rounded-xl border border-emerald-200 bg-white p-3 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500"
        />
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setReplyingToId(null);
              setReplyContent("");
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submittingReplyToId === commentId || !replyContent.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            <Send size={14} />
            Gửi phản hồi
          </button>
        </div>
      </form>
    );
  };

  const renderComment = (comment: ProductCommentResponse, nested = false) => {
    const isLiking = likingCommentIds.includes(comment.commentId);

    return (
      <div key={comment.commentId} className={`flex gap-4 ${nested ? "mt-3" : ""}`}>
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 shadow-xs">
          <Image
            src={comment.userAvatarUrl || "/user/avatar-user-profile-default.png"}
            alt={comment.userName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-sm font-bold text-gray-900">{comment.userName}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">{comment.content}</p>
          </div>
          <div className="mt-1.5 flex items-center gap-4 px-1 text-xs font-medium text-gray-500">
            <span>{formatCommentTime(comment.createdAt)}</span>
            <button
              type="button"
              disabled={isLiking}
              onClick={() => void handleToggleLike(comment.commentId)}
              className={`flex items-center gap-1 transition-colors ${
                comment.likedByCurrentUser ? "text-emerald-600" : "text-gray-500 hover:text-emerald-600"
              } ${isLiking ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <ThumbsUp size={12} className={comment.likedByCurrentUser ? "fill-current" : ""} />
              <span>{comment.likeCount > 0 ? comment.likeCount : "Thích"}</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleReply(comment.commentId)}
              className="cursor-pointer text-gray-500 transition-colors hover:text-emerald-600"
            >
              Phản hồi
            </button>
          </div>
          {renderReplyForm(comment.commentId)}
          {!nested && comment.replies.length > 0 ? (
            <div className="mt-4 border-l border-gray-200 pl-4">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-900">Bình luận ({commentCountLabel})</h2>
      </div>

      <div className="max-h-96 flex-1 space-y-6 overflow-y-auto pr-1 scrollbar-thin">
        {isLoading ? (
          <p className="text-sm text-gray-500">Đang tải bình luận...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có bình luận nào cho sản phẩm này.</p>
        ) : comments.map((comment) => renderComment(comment))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-5">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Viết bình luận của bạn..." : "Đăng nhập để viết bình luận..."}
            disabled={isSubmitting}
            className="h-20 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 pr-12 text-sm text-gray-800 outline-none transition-all focus:border-emerald-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={isSubmitting || !user || !newComment.trim()}
            className="absolute right-3 bottom-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="px-1 text-[10px] text-gray-400">
          Nhập nội dung văn minh để xây dựng cộng đồng sinh viên an toàn.
        </p>
      </form>
    </section>
  );
};

export default ProductComments;
