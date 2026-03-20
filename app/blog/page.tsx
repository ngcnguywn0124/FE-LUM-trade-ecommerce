"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Clock,
  Tag,
  TrendingUp,
  BookOpen,
  Heart,
  Search,
  ChevronRight,
} from "lucide-react";
import { getBlogPosts, TRENDING_TOPICS, type BlogPostSummary } from "@/lib/blogApi";

const ALL_CATEGORY = "all";

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPosts();
        setPosts(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Không thể tải dữ liệu blog");
      } finally {
        setLoading(false);
      }
    };

    void loadBlogs();
  }, []);

  const featuredPost = useMemo(
    () => posts.find((post) => post.isFeatured) || posts[0],
    [posts],
  );

  const blogPosts = useMemo(() => {
    if (!featuredPost) {
      return posts;
    }
    return posts.filter((post) => post.id !== featuredPost.id);
  }, [featuredPost, posts]);

  const categories = useMemo(() => {
    const categoryCount = posts.reduce<Record<string, number>>((acc, post) => {
      acc[post.category] = (acc[post.category] ?? 0) + 1;
      return acc;
    }, {});

    const dynamicCategories = Object.entries(categoryCount).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      count,
    }));

    return [
      {
        id: ALL_CATEGORY,
        name: "Tất cả",
        count: posts.length,
      },
      ...dynamicCategories,
    ];
  }, [posts]);

  const filteredPosts = blogPosts.filter((post) => {
    const selectedCategoryName = categories.find((category) => category.id === selectedCategory)?.name;
    const matchesCategory = selectedCategory === ALL_CATEGORY || post.category === selectedCategoryName;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Sinh Viên Lụm",
    description: "Chia sẻ kiến thức, kinh nghiệm và câu chuyện từ cộng đồng sinh viên.",
    inLanguage: "vi-VN",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: `${siteUrl}${post.image}`,
      author: {
        "@type": "Person",
        name: post.author,
      },
      url: `${siteUrl}/blog/${post.id}`,
    })),
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Blog Sinh Viên
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kiến thức, kinh nghiệm và câu chuyện từ cộng đồng sinh viên
          </p>
        </header>

        {loading && (
          <div className="text-center py-10 text-gray-600">Đang tải bài viết...</div>
        )}

        {error && (
          <div className="mb-8 rounded-xl bg-red-50 px-4 py-3 text-center text-red-600">{error}</div>
        )}

        {/* Search Bar - Enhanced */}
        <section className="max-w-3xl mx-auto mb-12" aria-labelledby="blog-search-heading">
          <h2 id="blog-search-heading" className="sr-only">Tìm kiếm bài viết blog</h2>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8cceae] to-[#FFBA00] rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-[#8cceae] transition-all">
              <form className="flex items-center px-6 py-4" role="search" onSubmit={(event) => event.preventDefault()}>
                <Search className="text-[#8cceae] flex-shrink-0" size={24} strokeWidth={2.5} />
                <label htmlFor="blog-search-input" className="sr-only">
                  Tìm kiếm bài viết theo tiêu đề hoặc nội dung
                </label>
                <input
                  id="blog-search-input"
                  type="text"
                  placeholder="Tìm kiếm bài viết theo tiêu đề hoặc nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 ml-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="ml-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Xóa
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-3 px-6 py-2 bg-gradient-to-r from-[#8cceae] to-[#6fb896] text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105"
                >
                  Tìm kiếm
                </button>
              </form>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Tìm thấy <span className="font-bold text-[#8cceae]">{filteredPosts.length}</span> bài viết
              </p>
            </div>
          )}
        </section>

        {/* Categories */}
        <nav className="flex flex-wrap justify-center gap-3 mb-12" aria-label="Danh mục bài viết">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              aria-pressed={selectedCategory === category.id}
              className={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                selectedCategory === category.id
                  ? "bg-[#8cceae] text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#8cceae]"
              }`}
            >
              {category.name}
              <span className="ml-2 text-sm opacity-75">({category.count})</span>
            </button>
          ))}
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-[#FFBA00]" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Bài viết nổi bật</h2>
                </div>

                <article className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative h-64 sm:h-80 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 flex items-center justify-center">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 640px) 100vw, 66vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-[#FFBA00] text-gray-900 rounded-full text-sm font-bold">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#8cceae] transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{featuredPost.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <User size={16} />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} />
                          <span>{featuredPost.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart size={16} className="text-red-500" />
                          {featuredPost.likes}
                        </span>
                        <span>{featuredPost.views} lượt xem</span>
                      </div>
                      <Link
                        href={`/blog/${featuredPost.id}`}
                        aria-label={`Đọc bài viết ${featuredPost.title}`}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-[#FFBA00] rounded-lg font-bold hover:bg-gray-800 transition-colors"
                      >
                        Đọc ngay
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* Blog Posts Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === ALL_CATEGORY
                  ? "Tất cả bài viết"
                  : categories.find((category) => category.id === selectedCategory)?.name}
              </h2>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Không tìm thấy bài viết nào</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 flex items-center justify-center">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#8cceae] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1.5">
                            <User size={14} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Heart size={14} className="text-red-500" />
                              {post.likes}
                            </span>
                            <span>{post.views} views</span>
                          </div>
                          <Link
                            href={`/blog/${post.id}`}
                            aria-label={`Đọc thêm bài viết ${post.title}`}
                            className="text-[#8cceae] font-bold text-sm hover:text-[#6fb896] transition-colors flex items-center gap-1"
                          >
                            Đọc thêm
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="text-[#8cceae]" size={20} />
                Chủ đề phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TOPICS.map((topic, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Xem chủ đề ${topic}`}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-[#8cceae] hover:text-white text-gray-700 rounded-full text-sm font-medium transition-colors"
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#8cceae] to-[#6fb896] rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Đăng ký nhận tin</h3>
              <p className="text-sm text-white/90 mb-4">
                Nhận thông báo về bài viết mới mỗi tuần
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="w-full px-4 py-2 bg-white text-[#8cceae] rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Liên kết nhanh</h3>
              <div className="space-y-2">
                <Link href="/blog/gui-bai" className="block text-gray-600 hover:text-[#8cceae] transition-colors">
                  → Gửi bài Blog
                </Link>
                <Link href="/blog/bai-cua-toi" className="block text-gray-600 hover:text-[#8cceae] transition-colors">
                  → Bài viết của tôi
                </Link>
                <Link href="/blog/duyet-bai" className="block text-gray-600 hover:text-[#8cceae] transition-colors">
                  → Duyệt bài (Moderation)
                </Link>
                <Link href="/ve-chung-toi" className="block text-gray-600 hover:text-[#8cceae] transition-colors">
                  → Về chúng tôi
                </Link>
                <Link href="/dang-tin" className="block text-gray-600 hover:text-[#8cceae] transition-colors">
                  → Đăng tin ngay
                </Link>
                <Link href="/search" className="block text-gray-600 hover:text-[#8cceae] transition-colors">
                  → Khám phá sản phẩm
                </Link>
                <a href="#" className="block text-gray-600 hover:text-[#8cceae] transition-colors">
                  → Quy định đăng tin
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
