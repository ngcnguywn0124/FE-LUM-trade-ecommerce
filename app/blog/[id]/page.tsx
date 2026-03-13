"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Calendar, 
  User, 
  Clock, 
  Tag,
  Heart,
  Share2,
  BookOpen,
  ChevronLeft,
  MessageCircle,
  Eye
} from "lucide-react";
import {
  FEATURED_BLOG_ID,
  getBlogPostDetailById,
  getRelatedBlogPosts,
} from "@/lib/blogData";

const BlogDetailPage = () => {
  const params = useParams<{ id: string }>();
  const blogId = Array.isArray(params.id) ? params.id[0] : params.id;
  const blogPost =
    getBlogPostDetailById(blogId ?? FEATURED_BLOG_ID) ||
    getBlogPostDetailById(FEATURED_BLOG_ID)!;
  const relatedPosts = getRelatedBlogPosts(blogPost.id, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const currentUrl = `${siteUrl}/blog/${String(blogPost.id)}`;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(blogPost.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Đã copy link bài viết!");
    }
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogPost.title,
    description: blogPost.excerpt,
    image: `${siteUrl}${blogPost.image}`,
    articleSection: blogPost.category,
    author: {
      "@type": "Person",
      name: blogPost.authorProfile.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Lụm",
    },
    mainEntityOfPage: currentUrl,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: likes,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: blogPost.comments,
      },
    ],
    url: currentUrl,
    inLanguage: "vi-VN",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blogPost.title,
        item: currentUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <nav aria-label="Điều hướng bài viết">
          <ol className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <li>
              <Link href="/" className="hover:text-[#8cceae] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-[#8cceae] transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700 line-clamp-1">{blogPost.title}</li>
          </ol>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8cceae] mb-6 transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại Blog</span>
          </Link>
        </nav>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8" aria-labelledby="blog-detail-title">
          {/* Featured Image */}
          <div className="relative h-64 sm:h-96 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 flex items-center justify-center">
            <Image
              src={blogPost.image}
              alt={blogPost.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, 1024px"
            />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-[#8cceae] text-white rounded-full text-sm font-bold shadow-lg">
                {blogPost.category}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Title */}
            <h1 id="blog-detail-title" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8cceae] to-[#6fb896] flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{blogPost.authorProfile.name}</div>
                  <div className="text-sm text-gray-500">{blogPost.authorProfile.role}</div>
                </div>
              </div>
              
              <div className="flex-1"></div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>{blogPost.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>{blogPost.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={16} />
                  <span>{blogPost.views}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50"
                }`}
              >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-[#8cceae] text-gray-700 hover:text-white rounded-xl font-bold transition-all hover:scale-105"
              >
                <Share2 size={20} />
                <span>Chia sẻ</span>
              </button>

              <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl">
                <MessageCircle size={20} />
                <span className="font-bold">{blogPost.comments} bình luận</span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
              style={{
                lineHeight: '1.8'
              }}
            />

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-200">
              <Tag size={20} className="text-gray-400" />
              {blogPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#8cceae]/10 text-[#8cceae] rounded-full text-sm font-medium hover:bg-[#8cceae]/20 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8" aria-labelledby="author-bio-title">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8cceae] to-[#6fb896] flex items-center justify-center flex-shrink-0">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 id="author-bio-title" className="text-xl font-bold text-gray-900 mb-1">
                {blogPost.authorProfile.name}
              </h2>
              <p className="text-[#8cceae] font-medium mb-2">{blogPost.authorProfile.role}</p>
              <p className="text-gray-600 leading-relaxed">
                Chuyên viên nội dung tại Lụm, đam mê chia sẻ kiến thức và kinh nghiệm 
                về mua bán đồ cũ an toàn cho cộng đồng sinh viên.
              </p>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8" aria-labelledby="related-posts-title">
          <h2 id="related-posts-title" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen size={28} className="text-[#8cceae]" />
            Bài viết liên quan
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-40 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 flex items-center justify-center">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-white/90 text-gray-900 rounded-full text-xs font-bold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#8cceae] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8" aria-labelledby="comments-title">
          <h2 id="comments-title" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle size={28} className="text-[#8cceae]" />
            Bình luận ({blogPost.comments})
          </h2>
          
          {/* Comment Form */}
          <div className="mb-8">
            <textarea
              placeholder="Viết bình luận của bạn..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8cceae] focus:outline-none resize-none"
            />
            <div className="flex justify-end mt-3">
              <button className="px-6 py-2 bg-gradient-to-r from-[#8cceae] to-[#6fb896] text-white rounded-lg font-bold hover:shadow-lg transition-all hover:scale-105">
                Gửi bình luận
              </button>
            </div>
          </div>

          {/* Sample Comments */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8cceae] to-[#6fb896] flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-bold text-gray-900 mb-1">Nguyễn Văn A</div>
                  <p className="text-gray-600">
                    Bài viết rất hữu ích! Mình đã áp dụng và thấy hiệu quả rõ rệt. Cảm ơn admin đã chia sẻ!
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>2 giờ trước</span>
                  <button className="hover:text-[#8cceae] transition-colors">Thích</button>
                  <button className="hover:text-[#8cceae] transition-colors">Trả lời</button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFBA00] to-[#ffc82a] flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-bold text-gray-900 mb-1">Trần Thị B</div>
                  <p className="text-gray-600">
                    Có thể viết thêm về cách phân biệt hàng thật hàng giả không ạ? 😊
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>5 giờ trước</span>
                  <button className="hover:text-[#8cceae] transition-colors">Thích</button>
                  <button className="hover:text-[#8cceae] transition-colors">Trả lời</button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Custom Styles for Article Content */}
      <style jsx global>{`
        .prose h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose p {
          color: #4b5563;
          margin-bottom: 1rem;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: #4b5563;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </main>
  );
};

export default BlogDetailPage;
