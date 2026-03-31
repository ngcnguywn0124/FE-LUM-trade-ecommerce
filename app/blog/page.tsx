"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  BookOpen,
  Leaf,
  ShoppingBag,
  Eye,
  Heart,
  ChevronRight,
  Sparkles,
  Smile,
  ClipboardCheck,
  Bell,
  RefreshCw
} from "lucide-react";
import { getApprovedBlogs } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";

/* ────────────────────────── Animation Variants ────────────────────────── */
const easeOutCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: easeOutCurve },
  }),
};

/* ─────────────────────────── Data ─────────────────────────── */
const CATEGORIES = [
  { name: "Tất cả", slug: "all", icon: BookOpen, color: "#2D3436" },
  { name: "Mới nhất", slug: "newest", icon: Sparkles, color: "#22c55e" },
  { name: "Xem nhiều", slug: "most-viewed", icon: Eye, color: "#3b82f6" },
  { name: "Nổi bật", slug: "featured", icon: Heart, color: "#ef4444" },
];

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBlogs = useCallback(async (currentPage: number, filterSlug: string, query: string) => {
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
        // Nếu sau này có thêm category thực thụ thì dùng ở đây
        // Hiện tại các filter slug là newest, most-viewed, featured
        category = filterSlug;
      }

      const data = await getApprovedBlogs({
        category,
        query: query || undefined,
        isFeatured,
        sort,
        page: currentPage,
        size: 9
      });
      
      if (currentPage === 0) {
        setBlogs(data.content);
      } else {
        setBlogs(prev => [...prev, ...data.content]);
      }
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Realtime update with WebSocket
  const handleBlogEvent = useCallback((message: string) => {
    if (message === "BLOG_APPROVED") {
      toast.success("Có bài viết mới vừa được xuất bản!", {
          description: "Nhấn để xem tin mới nhất",
          action: {
              label: "Làm mới",
              onClick: () => {
                  setPage(0);
                  fetchBlogs(0, activeCategory, searchQuery);
              }
          }
      });
      
      // Auto refresh if on first page
      if (page === 0) {
          fetchBlogs(0, activeCategory, searchQuery);
      }
    }
  }, [page, activeCategory, searchQuery, fetchBlogs]);

  useWebSocket(undefined, undefined, undefined, handleBlogEvent);

  useEffect(() => {
    const timer = setTimeout(() => {
        setPage(0);
        fetchBlogs(0, activeCategory, searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, fetchBlogs]);

  // Load more
  const handleLoadMore = () => {
    if (page < totalPages - 1) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBlogs(nextPage, activeCategory, searchQuery);
    }
  };

  const featuredPosts = blogs.filter(p => p.isFeatured).slice(0, 2);

  return (
    <main className="min-h-screen font-inter bg-white">
      {/* ────────── Hero ────────── */}
      <section
        id="blog-hero"
        className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#8cceae] via-[#b8f3d7] to-[#E8FFF0]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm font-bold text-gray-800 mb-6">
              <Sparkles size={16} className="text-[#FFBA00]" />
              Blog Lụm Realtime
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
              Chia sẻ & <span className="text-emerald-700">Kết nối</span>
              <br className="hidden sm:block" />
              trong cộng đồng
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8 font-medium">
              Nơi sinh viên chia sẻ kinh nghiệm sống xanh, mẹo mua sắm và những trải nghiệm đời thường.
            </p>

            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-white rounded-2xl shadow-xl flex items-center px-5 py-4 gap-3 border border-white/50 focus-within:ring-4 ring-emerald-100 transition-all">
                <Search size={22} className="text-emerald-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-lg font-semibold"
                />
              </div>
              

            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── Featured Posts ────────── */}
      {featuredPosts.length > 0 && page === 0 && !searchQuery && (
        <section id="blog-featured" className="relative -mt-10 z-10 px-4 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, i) => (
                <motion.article
                  key={post.blogId || post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-emerald-50 transition-all"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <Image
                        src={post.thumbnail || "/template.png"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="inline-block px-4 py-1.5 bg-emerald-500 text-white text-xs font-black rounded-lg mb-3 uppercase tracking-wider">
                          Nổi bật
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                          <span className="flex items-center gap-1.5">
                            <Eye size={16} /> {post.viewCount || 0}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart size={16} /> {post.likeCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ────────── Navigation & Filter ────────── */}
      <section className="py-12 px-4 border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <span className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
                <Sparkles size={20} />
              </span>
              Khám phá bài viết
            </h2>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar py-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${
                      activeCategory === cat.slug
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200"
                        : "bg-white text-gray-600 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30"
                    }`}
                  >
                    <Icon size={18} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ────────── Main Grid ────────── */}
          {isLoading && page === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-100" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
                    <div className="h-6 bg-gray-100 rounded w-3/4 mb-4" />
                    <div className="space-y-2">
                       <div className="h-3 bg-gray-100 rounded w-full" />
                       <div className="h-3 bg-gray-100 rounded w-5/6" />
                    </div>
                    <div className="mt-8 flex items-center gap-3">
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
               <BookOpen size={64} className="mx-auto text-emerald-200 mb-6" />
               <p className="text-xl font-bold text-gray-400">Chưa có bài viết nào phù hợp.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {blogs.map((post, index) => (
                  <motion.article
                    key={post.blogId || post.id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <Link href={`/blog/${post.slug}`} className="block relative h-52 shrink-0">
                      <Image
                        src={post.thumbnail || "/template.png"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[11px] font-black uppercase text-emerald-800 tracking-wider shadow-sm border border-emerald-100">
                          {post.category || "General"}
                        </span>
                      </div>
                    </Link>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight line-clamp-2 hover:text-emerald-600 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6 flex-1">
                        {post.excerpt}
                      </p>

                      <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-emerald-100">
                            <Image
                              src={post.author.avatar || "/user/avatar-user-profile-default.png"}
                              alt={post.author.fullName || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <p className="text-[13px] font-bold text-gray-900 truncate max-w-[100px]">
                              {post.author.fullName}
                            </p>
                            <p className="text-[11px] text-gray-400 font-bold">
                              {new Date(post.createdAt || '').toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 rounded-xl text-xs font-black text-red-600 border border-red-100/50">
                              <Heart size={16} fill="currentColor" />
                              {post.likeCount || 0}
                           </div>
                           <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-xl text-xs font-black text-emerald-600 border border-emerald-100/50">
                              <Eye size={16} />
                              {post.viewCount || 0}
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Load More */}
          {page < totalPages - 1 && (
             <div className="mt-16 text-center">
               <button 
                 onClick={handleLoadMore}
                 disabled={isLoading}
                 className="inline-flex items-center gap-3 px-10 py-4 bg-white border-2 border-emerald-100 text-emerald-700 rounded-2xl text-lg font-black hover:bg-emerald-50 transition-all shadow-md active:scale-95 disabled:opacity-50"
               >
                 {isLoading ? (
                   <RefreshCw className="animate-spin" size={20} />
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
