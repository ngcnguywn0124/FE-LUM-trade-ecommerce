"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  Eye,
  Heart,
  ArrowRight,
  ArrowLeft,
  Share2,
  Tag,
  Calendar,
  Sparkles,
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  RefreshCw,
  Clock3
} from "lucide-react";
import { getBlogPostBySlug, getApprovedBlogs } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";

/* ────────────────────────── Animation ────────────────────────── */
const easeOutCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOutCurve },
  }),
};

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await getBlogPostBySlug(slug);
        setBlog(data);
        
        // Fetch related blogs (same category)
        const related = await getApprovedBlogs({
           category: data.category,
           size: 3
        });
        setRelatedBlogs(related.content.filter((b: BlogPost) => (b.blogId || b.id) !== (data.blogId || data.id)));
      } catch (error) {
        console.error("Error fetching blog detail:", error);
        toast.error("Không tìm thấy bài viết");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết bài viết!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 px-4">
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
           <div className="h-4 w-24 bg-gray-100 rounded-full" />
           <div className="h-12 w-3/4 bg-gray-100 rounded-2xl" />
           <div className="h-96 w-full bg-gray-100 rounded-3xl" />
           <div className="space-y-4">
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
           </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <RefreshCw size={40} className="text-rose-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Bài viết không tồn tại</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Xin lỗi, bài viết bạn đang tìm kiếm có thể đã bị gỡ bỏ hoặc chuyển sang địa chỉ khác.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="px-8 py-3.5 bg-gray-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl"
          >
            Quay lại Blog
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* ────────── Header Section ────────── */}
      <section className="relative pt-24 pb-12 md:pb-20 bg-gradient-to-b from-emerald-50/50 to-white overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm mb-8 hover:gap-3 transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              QUAY LẠI BLOG
            </Link>

            <span className="block w-fit px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-6 shadow-lg shadow-emerald-100">
              {blog.category}
            </span>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.15] mb-8 tracking-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                     <Image 
                       src={blog.author.avatar || "/user/avatar-user-profile-default.png"} 
                       alt={blog.author.fullName || ""} 
                       fill 
                       className="object-cover" 
                     />
                  </div>
                  <div>
                     <p className="text-sm font-black text-gray-900 leading-none mb-1">{blog.author.fullName}</p>
                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Tác giả sinh viên</p>
                  </div>
               </div>

               <div className="flex items-center gap-5 text-gray-400">
                 <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Calendar size={16} className="text-emerald-500" />
                    {new Date(blog.createdAt || "").toLocaleDateString("vi-VN")}
                 </div>
                 <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Clock3 size={16} className="text-emerald-500" />
                    5 phút đọc
                 </div>
                 <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Eye size={16} className="text-emerald-500" />
                    {blog.viewCount || 0} lượt xem
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── Main Image ────────── */}
      <section className="px-4 -mt-8 md:-mt-12 relative z-20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: easeOutCurve }}
            className="relative h-64 md:h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border-8 border-white"
          >
            <Image
              src={blog.thumbnail || "/template.png"}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* ────────── Content ────────── */}
      <section className="py-16 md:py-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          {/* Left: Share sidebar */}
          <div className="hidden md:flex flex-col gap-6 sticky top-32 h-fit">
            <button 
                onClick={() => setLiked(!liked)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${liked ? 'bg-rose-500 text-white shadow-rose-200 scale-110' : 'bg-white text-gray-400 hover:text-rose-500 border border-gray-100'}`}
            >
                <Heart size={24} fill={liked ? "currentColor" : "none"} />
            </button>
            <button 
                onClick={handleShare}
                className="w-14 h-14 rounded-2xl bg-white text-gray-400 hover:text-emerald-500 flex items-center justify-center transition-all border border-gray-100 shadow-lg"
            >
                <Share2 size={24} />
            </button>
            <div className="h-20 w-px bg-gray-100 mx-auto" />
            <div className="rotate-90 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] origin-left translate-x-3 mt-4">CHIA SẺ</div>
          </div>

          {/* Center: Article body */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="prose prose-emerald max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg prose-headings:font-black prose-headings:text-gray-900 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:rounded-2xl prose-blockquote:py-1"
            >
               {/* Excerpt */}
               <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-12 italic border-l-4 border-emerald-500 pl-8 py-2 bg-emerald-50/30 rounded-r-3xl">
                  {blog.excerpt}
               </p>

               {/* Main Content (rendering as HTML if possible, or whitespace-pre-wrap string) */}
               <div className="text-gray-700 text-lg md:text-xl leading-[1.8] whitespace-pre-wrap font-medium">
                  {blog.content}
               </div>

               {/* Bottom Tags (Mocked tags from category) */}
               <div className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-50 text-gray-500 text-sm font-bold rounded-xl border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-default">
                    # {blog.category}
                  </span>
                  <span className="px-4 py-2 bg-gray-50 text-gray-500 text-sm font-bold rounded-xl border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-default">
                    # sinh_vien
                  </span>
                  <span className="px-4 py-2 bg-gray-50 text-gray-500 text-sm font-bold rounded-xl border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-default">
                    # lum_vn
                  </span>
               </div>
            </motion.div>
            
            {/* Author Card Bottom */}
            <div className="mt-16 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row items-center gap-8">
               <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                  <Image 
                    src={blog.author.avatar || "/user/avatar-user-profile-default.png"} 
                    alt={blog.author.fullName || ""} 
                    fill 
                    className="object-cover" 
                  />
               </div>
               <div className="text-center sm:text-left">
                  <h4 className="text-xl font-black text-gray-900 mb-2">{blog.author.fullName}</h4>
                  <p className="text-gray-500 text-base leading-relaxed mb-4">
                    Thành viên nhiệt huyết của cộng đồng Lụm.vn, chuyên chia sẻ những bí kíp mua sắm thông minh và lối sống bền vững cho sinh viên.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                     <button className="text-emerald-600 font-black text-sm hover:underline">Xem thêm bài viết</button>
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                     <button className="text-emerald-600 font-black text-sm hover:underline">Theo dõi</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── Related Articles ────────── */}
      {relatedBlogs.length > 0 && (
        <section className="py-24 bg-gray-50/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
               <div>
                  <span className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-4 block">Xem thêm</span>
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Bài viết liên quan</h2>
               </div>
               <Link href="/blog" className="hidden sm:flex items-center gap-2 font-black text-gray-900 hover:text-emerald-600 transition-colors">
                  Tất cả bài viết <ArrowLeft className="rotate-180" size={18} />
               </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {relatedBlogs.map((post, i) => (
                  <motion.article 
                    key={post.blogId || post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative h-52 overflow-hidden">
                        <Image 
                          src={post.thumbnail || "/template.png"} 
                          alt={post.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-black text-gray-900 text-lg mb-4 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-gray-100">
                                 <Image src={post.author.avatar || "/user/avatar-user-profile-default.png"} alt="" fill className="object-cover" />
                              </div>
                              <span className="text-[11px] font-bold text-gray-500">{post.author.fullName}</span>
                           </div>
                           <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* ────────── Newsletter / CTA ────────── */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full animate-bounce" />
              <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-emerald-500 rounded-[2rem] rotate-12" />
           </div>
           
           <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10 leading-tight">
             Cùng xây dựng cộng đồng<br /><span className="text-emerald-400">Sinh viên Lụm.vn</span>
           </h2>
           <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
             Nơi mỗi bài viết không chỉ là kiến thức, mà còn là sự kết nối giữa hàng nghìn sinh viên.
           </p>
           <Link 
             href="/blog/dang-bai"
             className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-white rounded-full text-xl font-black hover:bg-emerald-400 transition-all shadow-2xl relative z-10"
           >
             Đăng bài ngay hôm nay
             <ArrowRight size={24} />
           </Link>
        </div>
      </section>
    </main>
  );
}
