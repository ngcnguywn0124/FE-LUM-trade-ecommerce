"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getMyBlogPosts, type BlogPostDetail } from "@/lib/blogApi";

const STATUS_LABEL: Record<string, string> = {
  draft: "Nháp",
  pending: "Chờ duyệt",
  published: "Đã xuất bản",
  rejected: "Bị từ chối",
  hidden: "Đang ẩn",
};

const STATUS_CLASS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  hidden: "bg-slate-100 text-slate-700",
};

export default function MyBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPostDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyBlogPosts();
        setPosts(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Không thể tải bài viết.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((left, right) => Number(right.id) - Number(left.id));
  }, [posts]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-950">Bài viết của tôi</h1>
            <p className="text-gray-800 mt-2 font-medium">Theo dõi trạng thái duyệt các bài bạn đã gửi.</p>
          </div>
          <Link href="/blog/gui-bai" className="text-emerald-700 font-bold hover:underline">
            + Gửi bài mới
          </Link>
        </div>

        {loading && <p className="text-gray-800 font-medium">Đang tải danh sách bài viết...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && sortedPosts.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-600">
            Bạn chưa gửi bài viết nào.
          </div>
        )}

        <div className="space-y-4">
          {sortedPosts.map((post) => {
            const status = (post.status || "draft").toLowerCase();
            const statusClass = STATUS_CLASS[status] || STATUS_CLASS.draft;
            const statusLabel = STATUS_LABEL[status] || status;

            return (
              <article key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                        <h2 className="text-lg font-bold text-gray-950">{post.title}</h2>
                          <p className="text-sm text-gray-700 mt-1 font-medium">
                      {post.category} • {post.date}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <p className="text-gray-800 text-sm line-clamp-2">{post.excerpt}</p>

                {post.rejectionReason && (
                  <p className="mt-3 text-sm text-rose-600">
                    Lý do từ chối/ẩn: {post.rejectionReason}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <Link href={`/blog/${post.id}`} className="text-emerald-700 font-bold hover:underline">
                    Xem chi tiết
                  </Link>
                  <span className="text-gray-700">{post.views} lượt xem</span>
                  <span className="text-gray-700">{post.likes} lượt thích</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
