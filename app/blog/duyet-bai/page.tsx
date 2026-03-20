"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPendingBlogPosts,
  moderateBlogPost,
  type BlogModerationPayload,
  type BlogPostDetail,
} from "@/lib/blogApi";

export default function BlogModerationPage() {
  const [posts, setPosts] = useState<BlogPostDetail[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningId, setRunningId] = useState<number | null>(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingBlogPosts();
      setPosts(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Không thể tải danh sách chờ duyệt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPending();
  }, []);

  const handleModeration = async (id: number, action: BlogModerationPayload["action"]) => {
    try {
      setRunningId(id);
      await moderateBlogPost(id, {
        action,
        note: notes[id]?.trim() || undefined,
      });

      setPosts((prev) => prev.filter((post) => post.id !== id));
      setNotes((prev) => {
        const clone = { ...prev };
        delete clone[id];
        return clone;
      });
    } catch (moderationError) {
      setError(
        moderationError instanceof Error ? moderationError.message : "Moderation thất bại, vui lòng thử lại.",
      );
    } finally {
      setRunningId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-950">Duyệt bài Blog</h1>
            <p className="text-gray-800 mt-2 font-medium">Dành cho moderator/admin xử lý bài viết người dùng gửi lên.</p>
          </div>
          <button
            type="button"
            onClick={() => void fetchPending()}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold"
          >
            Làm mới
          </button>
        </div>

        <div className="mb-5 text-sm text-gray-800">
          <Link href="/blog" className="text-emerald-700 font-bold hover:underline">
            ← Quay lại Blog
          </Link>
        </div>

        {loading && <p className="text-gray-800 font-medium">Đang tải hàng chờ duyệt...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-600">
            Không còn bài viết chờ duyệt.
          </div>
        )}

        <div className="space-y-5">
          {posts.map((post) => {
            const postId = Number(post.id);

            return (
              <article key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-950">{post.title}</h2>
                <p className="text-sm text-gray-700 mt-1 font-medium">
                  {post.author} • {post.category} • {post.date}
                </p>

                <p className="mt-3 text-gray-900">{post.excerpt}</p>
                <div className="mt-4 p-4 rounded-xl bg-gray-50 text-sm text-gray-900 max-h-48 overflow-y-auto border border-gray-200">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Ghi chú moderation (tùy chọn)</label>
                  <textarea
                    value={notes[postId] || ""}
                    onChange={(event) => setNotes((prev) => ({ ...prev, [postId]: event.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8cceae]"
                    placeholder="Nhập lý do khi từ chối/ẩn bài..."
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={runningId === postId}
                    onClick={() => void handleModeration(postId, "approve")}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    Duyệt
                  </button>
                  <button
                    type="button"
                    disabled={runningId === postId}
                    onClick={() => void handleModeration(postId, "reject")}
                    className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    Từ chối
                  </button>
                  <button
                    type="button"
                    disabled={runningId === postId}
                    onClick={() => void handleModeration(postId, "hide")}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-60"
                  >
                    Ẩn bài
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
