"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  User, 
  Clock, 
  Tag,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Heart,
  Search,
  ChevronRight
} from "lucide-react";

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "Tất cả", count: 24 },
    { id: "tips", name: "Mẹo sinh viên", count: 8 },
    { id: "story", name: "Câu chuyện", count: 6 },
    { id: "guide", name: "Hướng dẫn", count: 5 },
    { id: "campus", name: "Đời sống campus", count: 5 }
  ];

  const featuredPost = {
    id: 1,
    title: "10 Mẹo Mua Bán Đồ Cũ An Toàn Cho Sinh Viên",
    excerpt: "Chia sẻ kinh nghiệm và những lưu ý quan trọng khi tham gia mua bán đồ cũ trên các nền tảng trực tuyến để tránh rủi ro và có giao dịch thành công.",
    image: "/banners/blog-featured.jpg",
    category: "Mẹo sinh viên",
    author: "Admin Lụm",
    date: "15 Tháng 2, 2026",
    readTime: "5 phút đọc",
    views: 1234,
    likes: 89
  };

  const blogPosts = [
    {
      id: 2,
      title: "Cách Tái Sử Dụng Sách Giáo Khoa Hiệu Quả",
      excerpt: "Những cách thông minh để tận dụng sách giáo khoa cũ, giúp tiết kiệm chi phí và bảo vệ môi trường.",
      image: "/product/product-1.jpg",
      category: "Hướng dẫn",
      author: "Nguyễn Văn A",
      date: "12 Tháng 2, 2026",
      readTime: "4 phút đọc",
      views: 856,
      likes: 45
    },
    {
      id: 3,
      title: "Kinh Nghiệm Mua Laptop Cũ Cho Sinh Viên",
      excerpt: "Những điều cần kiểm tra khi mua laptop second-hand để có sản phẩm chất lượng với giá tốt nhất.",
      image: "/product/product-2.jpg",
      category: "Mẹo sinh viên",
      author: "Trần Thị B",
      date: "10 Tháng 2, 2026",
      readTime: "6 phút đọc",
      views: 1102,
      likes: 67
    },
    {
      id: 4,
      title: "Câu Chuyện Từ Cộng Đồng Lụm",
      excerpt: "Những câu chuyện ý nghĩa về sự chia sẻ và giúp đỡ lẫn nhau trong cộng đồng sinh viên.",
      image: "/product/product-3.jpg",
      category: "Câu chuyện",
      author: "Lê Văn C",
      date: "8 Tháng 2, 2026",
      readTime: "3 phút đọc",
      views: 645,
      likes: 34
    },
    {
      id: 5,
      title: "Xu Hướng Mua Sắm Bền Vững Trong Sinh Viên",
      excerpt: "Tại sao ngày càng nhiều sinh viên chọn mua đồ cũ và tham gia vào nền kinh tế tuần hoàn.",
      image: "/product/product-4.jpg",
      category: "Đời sống campus",
      author: "Phạm Thị D",
      date: "5 Tháng 2, 2026",
      readTime: "5 phút đọc",
      views: 923,
      likes: 56
    },
    {
      id: 6,
      title: "Top 5 Món Đồ Sinh Viên Cần Nhất",
      excerpt: "Danh sách những món đồ thiết yếu mà mọi sinh viên nên có và cách mua chúng với giá hợp lý.",
      image: "/product/product-5.jpg",
      category: "Mẹo sinh viên",
      author: "Hoàng Văn E",
      date: "2 Tháng 2, 2026",
      readTime: "4 phút đọc",
      views: 1345,
      likes: 78
    },
    {
      id: 7,
      title: "Hướng Dẫn Chụp Ảnh Sản Phẩm Đẹp",
      excerpt: "Mẹo nhỏ để chụp ảnh sản phẩm thu hút, giúp bán hàng nhanh hơn trên Lụm.",
      image: "/product/product-6.jpg",
      category: "Hướng dẫn",
      author: "Vũ Thị F",
      date: "30 Tháng 1, 2026",
      readTime: "5 phút đọc",
      views: 767,
      likes: 41
    },
    {
      id: 8,
      title: "Chuyện Đời Sống Ký Túc Xá",
      excerpt: "Những câu chuyện vui buồn lẫn lộn trong cuộc sống ký túc xá của sinh viên.",
      image: "/product/product-7.jpg",
      category: "Đời sống campus",
      author: "Đỗ Văn G",
      date: "28 Tháng 1, 2026",
      readTime: "4 phút đọc",
      views: 534,
      likes: 29
    },
    {
      id: 9,
      title: "Làm Thế Nào Để Bán Đồ Nhanh Trên Lụm",
      excerpt: "Chiến lược đăng tin hiệu quả để sản phẩm của bạn được nhiều người quan tâm.",
      image: "/product/product-8.jpg",
      category: "Hướng dẫn",
      author: "Bùi Thị H",
      date: "25 Tháng 1, 2026",
      readTime: "6 phút đọc",
      views: 1876,
      likes: 92
    }
  ];

  const trendingTopics = [
    "Mua bán đồ cũ",
    "Laptop sinh viên",
    "Sách giáo khoa",
    "Đồ điện tử",
    "Đời sống ký túc xá",
    "Tiết kiệm chi phí",
    "Kinh tế tuần hoàn",
    "Môi trường xanh"
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category.toLowerCase().includes(selectedCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Blog Sinh Viên
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kiến thức, kinh nghiệm và câu chuyện từ cộng đồng sinh viên
          </p>
        </div>

        {/* Search Bar - Enhanced */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8cceae] to-[#FFBA00] rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border-2 border-transparent hover:border-[#8cceae] transition-all">
              <div className="flex items-center px-6 py-4">
                <Search className="text-[#8cceae] flex-shrink-0" size={24} strokeWidth={2.5} />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết theo tiêu đề hoặc nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 ml-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Xóa
                  </button>
                )}
                <button className="ml-3 px-6 py-2 bg-gradient-to-r from-[#8cceae] to-[#6fb896] text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Tìm thấy <span className="font-bold text-[#8cceae]">{filteredPosts.length}</span> bài viết
              </p>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
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
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Featured Post */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-[#FFBA00]" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Bài viết nổi bật</h2>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="relative h-64 sm:h-80 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 flex items-center justify-center">
                  <BookOpen size={80} className="text-gray-300" />
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
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
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
                      className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-[#FFBA00] rounded-lg font-bold hover:bg-gray-800 transition-colors"
                    >
                      Đọc ngay
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "all" ? "Tất cả bài viết" : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Không tìm thấy bài viết nào</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 flex items-center justify-center">
                        <BookOpen size={48} className="text-gray-300" />
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
                            className="text-[#8cceae] font-bold text-sm hover:text-[#6fb896] transition-colors flex items-center gap-1"
                          >
                            Đọc thêm
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
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
                {trendingTopics.map((topic, index) => (
                  <button
                    key={index}
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
    </div>
  );
};

export default BlogPage;
