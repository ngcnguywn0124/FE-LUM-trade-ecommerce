"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Eye,
  Heart,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { getApprovedBlogs } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";

/* ─────────────────────────── Data ─────────────────────────── */
const CATEGORIES = [
  { name: "Tất cả", slug: "all", icon: BookOpen },
  { name: "Mới nhất", slug: "newest", icon: Sparkles },
  { name: "Xem nhiều", slug: "most-viewed", icon: Eye },
  { name: "Nổi bật", slug: "featured", icon: Heart },
];

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBlogs = useCallback(
    async (currentPage: number, filterSlug: string, query: string) => {
      setIsLoading(true);
      try {
        let isFeatured = undefined;
        let sort = "createdAt,desc";
        let category = undefined;

        if (filterSlug === "featured") {
          isFeatured = true;
        } else if (filterSlug === "most-viewed") {
          sort = "viewCount,desc";
        } else if (filterSlug !== "all" && filterSlug !== "newest") {
          category = filterSlug;
        }

        const data = await getApprovedBlogs({
          category,
          query: query || undefined,
          isFeatured,
          sort,
          page: currentPage,
          size: 9,
        });

        if (currentPage === 0) {
          setBlogs(data.content);
        } else {
          setBlogs((prev) => [...prev, ...data.content]);
        }
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Realtime update with WebSocket
  const handleBlogEvent = useCallback(
    (message: string) => {
      if (message === "BLOG_APPROVED") {
        toast.success("Có bài viết mới vừa được xuất bản!", {
          description: "Nhấn để làm mới",
          action: {
            label: "Làm mới",
            onClick: () => {
              setPage(0);
              fetchBlogs(0, activeCategory, searchQuery);
            },
          },
        });
        if (page === 0) {
          fetchBlogs(0, activeCategory, searchQuery);
        }
      }
    },
    [page, activeCategory, searchQuery, fetchBlogs]
  );

  useWebSocket(undefined, undefined, undefined, handleBlogEvent);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchBlogs(0, activeCategory, searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, fetchBlogs]);

  const handleLoadMore = () => {
    if (page < totalPages - 1) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBlogs(nextPage, activeCategory, searchQuery);
    }
  };

  const featuredPosts = blogs.filter((p) => p.isFeatured).slice(0, 2);

  return (
    <main className="min-h-screen font-inter bg-white">
      {/* ────────── Hero ────────── */}
      <section
        id="blog-hero"
        aria-label="Blog hero"
        className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#8cceae] via-[#b8f3d7] to-[#E8FFF0]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm font-bold text-gray-800 mb-6">
            <Sparkles size={16} className="text-[#FFBA00]" aria-hidden="true" />
            Blog Lụm Realtime
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
            Chia sẻ &{" "}
            <span className="text-emerald-700">Kết nối</span>
            <br className="hidden sm:block" />
            trong cộng đồng
          </h1>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8 font-medium">
            Nơi sinh viên chia sẻ kinh nghiệm sống xanh, mẹo mua sắm và những
            trải nghiệm đời thường.
          </p>

          <div className="max-w-xl mx-auto">
            <label htmlFor="blog-search" className="sr-only">
              Tìm kiếm bài viết
            </label>
            <div className="bg-white rounded-2xl shadow-xl flex items-center px-5 py-4 gap-3 border border-white/50 focus-within:ring-2 focus-within:ring-emerald-300 transition-shadow">
              <Search
                size={22}
                className="text-emerald-500 shrink-0"
                aria-hidden="true"
              />
              <input
                id="blog-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base font-semibold"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────────── Featured Posts ────────── */}
      {featuredPosts.length > 0 && page === 0 && !searchQuery && (
        <section
          id="blog-featured"
          aria-label="Bài viết nổi bật"
          className="relative -mt-10 z-10 px-4 mb-20"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.blogId || post.id}
                  className="group relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-emerald-100 transition-shadow duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <Image
                        src={post.thumbnail || "/template.png"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block px-4 py-1.5 bg-emerald-500 text-white text-xs font-black rounded-lg mb-3 uppercase tracking-wider">
                          Nổi bật
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 line-clamp-2">
                          {post.title}
                        </h2>
                        <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                          <span className="flex items-center gap-1.5">
                            <Eye size={16} aria-hidden="true" />{" "}
                            {post.viewCount || 0}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart size={16} aria-hidden="true" />{" "}
                            {post.likeCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ────────── Navigation & Filter ────────── */}
      <section
        aria-label="Khám phá bài viết"
        className="py-12 px-4 border-t border-gray-100 bg-gray-50/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <span
                className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white"
                aria-hidden="true"
              >
                <Sparkles size={20} />
              </span>
              Khám phá bài viết
            </h2>

            {/* Category filter */}
            <nav
              aria-label="Lọc theo danh mục"
              className="flex items-center gap-3 overflow-x-auto pb-1 w-full md:w-auto no-scrollbar"
            >
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    aria-pressed={isActive}
                    aria-label={`Lọc: ${cat.name}`}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-colors whitespace-nowrap border ${isActive
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50"
                      }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {cat.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ────────── Blog Grid ────────── */}
          {isLoading && page === 0 ? (
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              aria-label="Đang tải bài viết"
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-6 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-2xl" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                        <div className="h-2 bg-gray-100 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-emerald-50/20 rounded-3xl border-2 border-dashed border-emerald-100">
              <BookOpen
                size={64}
                className="mx-auto text-emerald-200 mb-6"
                aria-hidden="true"
              />
              <p className="text-xl font-bold text-gray-400">
                Chưa có bài viết nào phù hợp.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <article
                  key={post.blogId || post.id}
                  className="flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block relative h-52 shrink-0 overflow-hidden"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={post.thumbnail || "/template.png"}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[11px] font-black uppercase text-emerald-800 tracking-wider shadow-sm border border-emerald-100">
                        {post.category || "General"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-black text-gray-900 mb-3 leading-snug line-clamp-2 hover:text-emerald-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-emerald-100 shrink-0">
                          <Image
                            src={
                              post.author.avatar ||
                              "/user/avatar-user-profile-default.png"
                            }
                            alt={post.author.fullName || ""}
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[13px] font-bold text-gray-900 truncate max-w-[100px]">
                            {post.author.fullName}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium">
                            {new Date(
                              post.createdAt || ""
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg text-xs font-bold text-red-500 border border-red-100/50">
                          <Heart size={13} fill="currentColor" aria-hidden="true" />
                          {post.likeCount || 0}
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-lg text-xs font-bold text-emerald-600 border border-emerald-100/50">
                          <Eye size={13} aria-hidden="true" />
                          {post.viewCount || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More */}
          {page < totalPages - 1 && (
            <div className="mt-14 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                aria-label="Xem thêm bài viết"
                className="inline-flex items-center gap-3 px-10 py-4 bg-white border-2 border-emerald-100 text-emerald-700 rounded-2xl text-base font-bold hover:bg-emerald-50 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw
                      className="animate-spin"
                      size={18}
                      aria-hidden="true"
                    />
                    Đang tải...
                  </>
                ) : (
                  "Xem thêm bài viết"
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
