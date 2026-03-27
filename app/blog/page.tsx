"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Leaf,
  ShoppingBag,
  GraduationCap,
  Eye,
  Heart,
  ChevronRight,
  Sparkles,
  Tag,
} from "lucide-react";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: easeOutCurve },
  }),
};

/* ─────────────────────────── Types ─────────────────────────── */
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  featured?: boolean;
}

/* ─────────────────────────── Data ─────────────────────────── */
const CATEGORIES = [
  { name: "Tất cả", slug: "all", icon: BookOpen, color: "#2D3436" },
  { name: "Mẹo mua bán", slug: "meo-mua-ban", icon: ShoppingBag, color: "#FFBA00" },
  { name: "Sống xanh", slug: "song-xanh", icon: Leaf, color: "#8cceae" },
  { name: "Đời sống SV", slug: "doi-song-sv", icon: GraduationCap, color: "#6C5CE7" },
  { name: "Xu hướng", slug: "xu-huong", icon: TrendingUp, color: "#FF7675" },
  { name: "Chia sẻ kinh nghiệm", slug: "chia-se", icon: Lightbulb, color: "#00B894" },
];

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "5-meo-ban-do-cu-sieu-nhanh",
    title: "5 mẹo bán đồ cũ siêu nhanh – Chốt deal trong vòng 24h",
    excerpt:
      "Bạn muốn bán nhanh nhưng không biết bắt đầu từ đâu? Dưới đây là 5 bí kíp giúp tin đăng của bạn nổi bật và thu hút người mua ngay lập tức trên Lụm.vn.",
    category: "Mẹo mua bán",
    categoryColor: "#FFBA00",
    thumbnail: "/banners/deal-hunter.png",
    author: { name: "Nguyễn Quý Ngọc", avatar: "/user/avatar-user-profile-default.png" },
    publishedAt: "25/03/2026",
    readTime: "5 phút đọc",
    views: 2430,
    likes: 187,
    featured: true,
  },
  {
    id: "2",
    slug: "giao-trinh-cu-hay-moi-sinh-vien-nen-biet",
    title: "Giáo trình cũ hay mới? Những điều sinh viên nên biết trước khi mua",
    excerpt:
      "Đầu năm học mới, giáo trình là mối lo lớn. Bài viết phân tích ưu nhược của sách cũ vs mới, và gợi ý cách tìm sách chất lượng với giá hời trên Lụm.",
    category: "Chia sẻ kinh nghiệm",
    categoryColor: "#00B894",
    thumbnail: "/banners/student-marketplace.png",
    author: { name: "Thân Quang Tuân", avatar: "/user/avatar-user-profile-default.png" },
    publishedAt: "22/03/2026",
    readTime: "7 phút đọc",
    views: 1856,
    likes: 142,
    featured: true,
  },
  {
    id: "3",
    slug: "song-xanh-cho-sinh-vien",
    title: "Sống xanh cho sinh viên – Bắt đầu từ việc tái sử dụng đồ cũ",
    excerpt:
      "Mỗi món đồ cũ được tái sử dụng là một bước nhỏ hướng tới lối sống bền vững. Cùng tìm hiểu cách sinh viên có thể đóng góp cho môi trường ngay hôm nay.",
    category: "Sống xanh",
    categoryColor: "#8cceae",
    thumbnail: "/banners/safe-transaction.png",
    author: { name: "Nguyễn Ái Bình", avatar: "/user/avatar-user-profile-default.png" },
    publishedAt: "20/03/2026",
    readTime: "4 phút đọc",
    views: 1320,
    likes: 98,
  },
  {
    id: "4",
    slug: "top-5-do-cu-ban-chay-nhat",
    title: "Top 5 đồ cũ bán chạy nhất trên Lụm.vn tháng 3/2026",
    excerpt:
      "Từ MacBook đến giáo trình, đâu là những món đồ sinh viên săn lùng nhiều nhất? Cập nhật xu hướng mua sắm tháng này ngay!",
    category: "Xu hướng",
    categoryColor: "#FF7675",
    thumbnail: "/banners/promo-v4.png",
    author: { name: "Nguyễn Quý Ngọc", avatar: "/user/avatar-user-profile-default.png" },
    publishedAt: "18/03/2026",
    readTime: "6 phút đọc",
    views: 3210,
    likes: 265,
  },
  {
    id: "5",
    slug: "huong-dan-chup-anh-san-pham-dep",
    title: "Hướng dẫn chụp ảnh sản phẩm đẹp bằng điện thoại – Bán nhanh gấp đôi!",
    excerpt:
      "Ảnh đẹp = bán nhanh. Bài viết chia sẻ kỹ thuật chụp ảnh sản phẩm chuyên nghiệp chỉ với smartphone, áp dụng ngay cho tin đăng trên Lụm.",
    category: "Mẹo mua bán",
    categoryColor: "#FFBA00",
    thumbnail: "/banners/promo-v2.jpg",
    author: { name: "Thân Quang Tuân", avatar: "/user/avatar-user-profile-default.png" },
    publishedAt: "15/03/2026",
    readTime: "8 phút đọc",
    views: 1670,
    likes: 124,
  },
  {
    id: "6",
    slug: "5-cach-tiet-kiem-cho-sinh-vien",
    title: "5 cách tiết kiệm hiệu quả mà sinh viên nào cũng nên biết",
    excerpt:
      "Từ việc mua đồ cũ, chia phòng trọ cho đến nấu ăn tại nhà – đây là những cách giúp bạn sống khỏe với ngân sách sinh viên.",
    category: "Đời sống SV",
    categoryColor: "#6C5CE7",
    thumbnail: "/banners/promo-v3.jpg",
    author: { name: "Nguyễn Ái Bình", avatar: "/user/avatar-user-profile-default.png" },
    publishedAt: "12/03/2026",
    readTime: "5 phút đọc",
    views: 2100,
    likes: 176,
  },
];

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredPosts = useMemo(
    () => BLOG_POSTS.filter((post) => post.featured),
    []
  );

  const filteredPosts = useMemo(() => {
    let filtered = BLOG_POSTS;

    if (activeCategory !== "all") {
      const cat = CATEGORIES.find((c) => c.slug === activeCategory);
      if (cat) {
        filtered = filtered.filter((post) => post.category === cat.name);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  return (
    <main className="min-h-screen font-sans bg-white">
      {/* ────────── Hero ────────── */}
      <section
        id="blog-hero"
        className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#8cceae] via-[#b8f3d7] to-[#E8FFF0]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgOHYtMmgydjJoLTJ6bTItMTBoMnYyaC0ydi0yem0tNC00aDJ2MmgtMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm font-bold text-gray-800 mb-6">
              <Sparkles size={16} className="text-[#FFBA00]" />
              Blog Sinh Viên
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
              Kiến thức &{" "}
              <span className="text-orange-700">Cảm hứng</span>
              <br className="hidden sm:block" />
              cho sinh viên
            </h1>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed max-w-2xl mx-auto mb-8">
              Mẹo mua bán thông minh, bí kíp tiết kiệm và câu chuyện đời sống
              sinh viên – tất cả có tại <strong>Blog Lụm.vn</strong>.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg flex items-center px-4 py-3 gap-3 border border-white/50">
                <Search size={20} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600 text-sm font-medium shrink-0 cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── Featured Posts ────────── */}
      {featuredPosts.length > 0 && activeCategory === "all" && !searchQuery && (
        <section id="blog-featured" className="relative -mt-8 z-10 px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  variants={scaleIn}
                  custom={i}
                  className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-52 md:h-64 overflow-hidden">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                          style={{ backgroundColor: post.categoryColor + "CC" }}
                        >
                          <Tag size={12} />
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl md:text-2xl font-black text-white leading-tight line-clamp-2">
                          {post.title}
                        </h2>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={32}
                            height={32}
                            className="rounded-full border-2 border-gray-100"
                          />
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {post.author.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {post.publishedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {post.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {post.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ────────── Categories + Posts ────────── */}
      <section id="blog-posts" className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          <motion.div
            className="flex flex-wrap gap-2 mb-10 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.name}
                </button>
              );
            })}
          </motion.div>

          {/* Section Title */}
          <motion.div
            key={`title-${activeCategory}-${searchQuery}`}
            className="flex items-center justify-between mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                {activeCategory === "all"
                  ? "Tất cả bài viết"
                  : CATEGORIES.find((c) => c.slug === activeCategory)?.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {filteredPosts.length} bài viết
                {searchQuery && ` cho "${searchQuery}"`}
              </p>
            </div>
          </motion.div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <motion.div
              key={`grid-${activeCategory}-${searchQuery}`}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
            >
              {filteredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  variants={scaleIn}
                  custom={i}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all hover:-translate-y-1"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white backdrop-blur-sm"
                          style={{
                            backgroundColor: post.categoryColor + "CC",
                          }}
                        >
                          <Tag size={10} />
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[#8cceae] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {post.author.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
                          <span className="flex items-center gap-0.5">
                            <Eye size={11} />
                            {post.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Heart size={11} />
                            {post.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              key={`empty-${activeCategory}-${searchQuery}`}
              className="text-center py-20"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác nhé!
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
              >
                Xem tất cả bài viết
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ────────── Newsletter CTA ────────── */}
      <section
        id="blog-newsletter"
        className="py-20 md:py-28 bg-gradient-to-br from-[#111111] to-[#1A1A1A] text-white px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFBA00]/15 rounded-2xl mb-6">
              <BookOpen size={32} className="text-[#FFBA00]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Đừng bỏ lỡ bài viết{" "}
              <span className="text-[#FFBA00]">mới nhất!</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Đăng ký nhận thông báo để cập nhật mẹo hay, kinh nghiệm từ cộng
              đồng sinh viên mỗi tuần.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FFBA00] transition-colors placeholder-gray-500"
              />
              <button className="bg-[#FFBA00] text-black font-bold px-6 py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                Đăng ký
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── Quick Links ────────── */}
      <section id="blog-explore" className="py-16 md:py-20 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Khám phá thêm trên{" "}
              <span className="text-[#8cceae]">Lụm.vn</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              {
                title: "Bắt đầu mua bán",
                desc: "Tìm kiếm hoặc đăng tin ngay trên sàn đồ cũ dành cho sinh viên.",
                href: "/",
                icon: ShoppingBag,
                gradient: "from-[#8cceae] to-[#6abf96]",
              },
              {
                title: "Về chúng tôi",
                desc: "Tìm hiểu sứ mệnh, tầm nhìn và đội ngũ đứng sau Lụm.vn.",
                href: "/gioi-thieu",
                icon: GraduationCap,
                gradient: "from-[#FFBA00] to-[#FFA000]",
              },
              {
                title: "Đăng tin miễn phí",
                desc: "Bán đồ cũ chỉ trong 30 giây. Đơn giản, nhanh chóng và hoàn toàn miễn phí!",
                href: "/dang-tin",
                icon: TrendingUp,
                gradient: "from-[#6C5CE7] to-[#5A4ED1]",
              },
            ].map((item, i) => (
              <motion.div key={item.title} variants={fadeUp} custom={i}>
                <Link
                  href={item.href}
                  className="group flex flex-col p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all h-full"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <item.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                    {item.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-[#8cceae] group-hover:gap-2 transition-all">
                    Khám phá
                    <ChevronRight size={16} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
