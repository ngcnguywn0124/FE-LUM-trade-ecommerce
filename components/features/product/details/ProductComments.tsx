"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, ThumbsUp, User } from "lucide-react";

interface Comment {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  time: string;
  likes: number;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    user: { name: "Nguyễn Văn A", avatar: "" },
    content: "Sản phẩm còn fix giá không bạn ơi? Mình ở gần muốn qua xem ngay.",
    time: "10 phút trước",
    likes: 2,
  },
  {
    id: 2,
    user: { name: "Trần Thị B", avatar: "" },
    content: "Máy còn bảo hành không chủ thớt?",
    time: "1 giờ trước",
    likes: 0,
  },
];

const ProductComments = () => {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      user: { name: "Bạn (Tôi)", avatar: "" },
      content: newComment,
      time: "Vừa xong",
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-900">Bình luận ({comments.length})</h2>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-1 max-h-96 scrollbar-thin">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 text-emerald-600 cursor-pointer">
              {comment.user.avatar ? (
                <Image src={comment.user.avatar} alt={comment.user.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User size={18} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="rounded-2xl bg-gray-50 p-3">
                <p className="text-sm font-bold text-gray-900 cursor-pointer">{comment.user.name}</p>
                <p className="mt-1 text-sm text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
              <div className="mt-1.5 flex items-center gap-4 px-1 text-xs font-medium text-gray-500">
                <span>{comment.time}</span>
                <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer">
                  <ThumbsUp size={12} />
                  <span>{comment.likes > 0 ? comment.likes : "Thích"}</span>
                </button>
                <button className="hover:text-emerald-600 transition-colors cursor-pointer">Phản hồi</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-5">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 pr-12 text-sm text-gray-800 outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none h-20"
          />
          <button
            type="submit"
            className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 px-1">Nhập nội dung văn minh để xây dựng cộng đồng sinh viên an toàn.</p>
      </form>
    </section>
  );
};

export default ProductComments;
