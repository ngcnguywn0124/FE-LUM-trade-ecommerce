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
  ChevronRight,
  MessageCircle,
  Eye
} from "lucide-react";

const BlogDetailPage = () => {
  const params = useParams();
  const blogId = params.id;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(89);

  // Mock data - Trong thực tế sẽ fetch từ API
  const blogPost = {
    id: 1,
    title: "10 Mẹo Mua Bán Đồ Cũ An Toàn Cho Sinh Viên",
    excerpt: "Chia sẻ kinh nghiệm và những lưu ý quan trọng khi tham gia mua bán đồ cũ trên các nền tảng trực tuyến.",
    content: `
      <h2>Giới thiệu</h2>
      <p>Trong thời đại kinh tế chia sẻ ngày càng phát triển, việc mua bán đồ cũ đã trở thành xu hướng phổ biến, đặc biệt trong cộng đồng sinh viên. Tuy nhiên, để có những giao dịch an toàn và hiệu quả, bạn cần nắm rõ một số nguyên tắc cơ bản.</p>

      <h2>1. Kiểm tra kỹ thông tin người bán/mua</h2>
      <p>Trước khi quyết định giao dịch, hãy dành thời gian tìm hiểu về người bán hoặc người mua. Kiểm tra:</p>
      <ul>
        <li>Tài khoản đã được xác thực chưa</li>
        <li>Số lượng giao dịch trước đó</li>
        <li>Đánh giá từ những người dùng khác</li>
        <li>Thời gian tham gia nền tảng</li>
      </ul>

      <h2>2. Gặp mặt tại địa điểm công cộng</h2>
      <p>Luôn ưu tiên gặp gỡ trực tiếp tại những nơi đông người như:</p>
      <ul>
        <li>Khuôn viên trường học</li>
        <li>Quán cà phê</li>
        <li>Trung tâm thương mại</li>
        <li>Cổng ký túc xá</li>
      </ul>
      <p>Tránh hẹn gặp tại những nơi vắng vẻ hoặc địa điểm riêng tư.</p>

      <h2>3. Kiểm tra kỹ sản phẩm trước khi thanh toán</h2>
      <p>Đối với đồ điện tử, hãy:</p>
      <ul>
        <li>Yêu cầu người bán demo sản phẩm</li>
        <li>Kiểm tra các tính năng chính</li>
        <li>Xem xét tình trạng ngoại quan</li>
        <li>Chụp ảnh làm bằng chứng</li>
      </ul>

      <h2>4. Sử dụng phương thức thanh toán an toàn</h2>
      <p>Ưu tiên các hình thức thanh toán có thể tra cứu được như:</p>
      <ul>
        <li>Chuyển khoản ngân hàng</li>
        <li>Ví điện tử có uy tín</li>
        <li>Thanh toán trực tiếp bằng tiền mặt (khi gặp mặt)</li>
      </ul>
      <p>Tránh các hình thức thanh toán không rõ ràng hoặc không thể truy vết.</p>

      <h2>5. Giữ bằng chứng giao dịch</h2>
      <p>Lưu trữ đầy đủ:</p>
      <ul>
        <li>Tin nhắn trao đổi</li>
        <li>Hình ảnh sản phẩm</li>
        <li>Biên lai chuyển khoản</li>
        <li>Thông tin liên lạc</li>
      </ul>

      <h2>6. Đặt câu hỏi chi tiết</h2>
      <p>Đừng ngại hỏi người bán về:</p>
      <ul>
        <li>Lý do bán sản phẩm</li>
        <li>Thời gian sử dụng</li>
        <li>Tình trạng bảo hành</li>
        <li>Lịch sử sửa chữa (nếu có)</li>
      </ul>

      <h2>7. Thương lượng giá cả hợp lý</h2>
      <p>Nghiên cứu giá thị trường trước khi đàm phán. Đưa ra mức giá công bằng cho cả hai bên và không quá ép giá gây khó chịu cho người bán.</p>

      <h2>8. Tin tưởng trực giác của bạn</h2>
      <p>Nếu bạn cảm thấy có gì đó không ổn về giao dịch, đừng ngần ngại từ chối. An toàn luôn là ưu tiên hàng đầu.</p>

      <h2>9. Tham khảo ý kiến bạn bè</h2>
      <p>Đưa theo một người bạn khi gặp gỡ người lạ. Họ có thể giúp bạn đánh giá sản phẩm và đảm bảo an toàn.</p>

      <h2>10. Báo cáo hành vi đáng ngờ</h2>
      <p>Nếu phát hiện dấu hiệu lừa đảo hoặc hành vi không phù hợp, hãy báo cáo ngay cho nền tảng và cơ quan chức năng.</p>

      <h2>Kết luận</h2>
      <p>Mua bán đồ cũ không chỉ giúp tiết kiệm chi phí mà còn góp phần bảo vệ môi trường. Tuy nhiên, hãy luôn đặt an toàn lên hàng đầu. Hy vọng 10 mẹo trên sẽ giúp bạn có những giao dịch thành công và an toàn trên Lụm!</p>
    `,
    category: "Mẹo sinh viên",
    author: {
      name: "Admin Lụm",
      avatar: "/user/avatar-1.jpg",
      role: "Content Manager"
    },
    date: "15 Tháng 2, 2026",
    readTime: "5 phút đọc",
    views: 1234,
    likes: 89,
    comments: 23,
    tags: ["Mua bán", "An toàn", "Mẹo hay", "Sinh viên"]
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Cách Tái Sử Dụng Sách Giáo Khoa Hiệu Quả",
      image: "/product/product-1.jpg",
      category: "Hướng dẫn"
    },
    {
      id: 3,
      title: "Kinh Nghiệm Mua Laptop Cũ Cho Sinh Viên",
      image: "/product/product-2.jpg",
      category: "Mẹo sinh viên"
    },
    {
      id: 4,
      title: "Câu Chuyện Từ Cộng Đồng Lụm",
      image: "/product/product-3.jpg",
      category: "Câu chuyện"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8cceae] mb-6 transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại Blog</span>
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Featured Image */}
          <div className="relative h-64 sm:h-96 bg-gradient-to-br from-[#8cceae]/20 to-[#FFBA00]/20 flex items-center justify-center">
            <BookOpen size={100} className="text-gray-300" />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-[#8cceae] text-white rounded-full text-sm font-bold shadow-lg">
                {blogPost.category}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8cceae] to-[#6fb896] flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{blogPost.author.name}</div>
                  <div className="text-sm text-gray-500">{blogPost.author.role}</div>
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
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8cceae] to-[#6fb896] flex items-center justify-center flex-shrink-0">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {blogPost.author.name}
              </h3>
              <p className="text-[#8cceae] font-medium mb-2">{blogPost.author.role}</p>
              <p className="text-gray-600 leading-relaxed">
                Chuyên viên nội dung tại Lụm, đam mê chia sẻ kiến thức và kinh nghiệm 
                về mua bán đồ cũ an toàn cho cộng đồng sinh viên.
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
                    <BookOpen size={40} className="text-gray-300" />
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
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
        </div>

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
    </div>
  );
};

export default BlogDetailPage;
