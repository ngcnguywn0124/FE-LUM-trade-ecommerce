export type BlogPostSummary = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
};

export type BlogPostDetail = BlogPostSummary & {
  content: string;
  comments: number;
  tags: string[];
  authorProfile: {
    name: string;
    avatar: string;
    role: string;
  };
};

const defaultPostContent = (post: BlogPostSummary) => `
  <h2>${post.title}</h2>
  <p>${post.excerpt}</p>
  <p>Bài viết thuộc chuyên mục <strong>${post.category}</strong> dành cho cộng đồng sinh viên Lụm.</p>
`;

export const BLOG_POSTS: BlogPostSummary[] = [
  {
    id: 1,
    title: "10 Mẹo Mua Bán Đồ Cũ An Toàn Cho Sinh Viên",
    excerpt:
      "Chia sẻ kinh nghiệm và những lưu ý quan trọng khi tham gia mua bán đồ cũ trên các nền tảng trực tuyến để tránh rủi ro và có giao dịch thành công.",
    image: "/banners/blog-featured.jpg",
    category: "Mẹo sinh viên",
    author: "Admin Lụm",
    date: "15 Tháng 2, 2026",
    readTime: "5 phút đọc",
    views: 1234,
    likes: 89,
  },
  {
    id: 2,
    title: "Cách Tái Sử Dụng Sách Giáo Khoa Hiệu Quả",
    excerpt:
      "Những cách thông minh để tận dụng sách giáo khoa cũ, giúp tiết kiệm chi phí và bảo vệ môi trường.",
    image: "/product/product-1.jpg",
    category: "Hướng dẫn",
    author: "Nguyễn Văn A",
    date: "12 Tháng 2, 2026",
    readTime: "4 phút đọc",
    views: 856,
    likes: 45,
  },
  {
    id: 3,
    title: "Kinh Nghiệm Mua Laptop Cũ Cho Sinh Viên",
    excerpt:
      "Những điều cần kiểm tra khi mua laptop second-hand để có sản phẩm chất lượng với giá tốt nhất.",
    image: "/product/product-2.jpg",
    category: "Mẹo sinh viên",
    author: "Trần Thị B",
    date: "10 Tháng 2, 2026",
    readTime: "6 phút đọc",
    views: 1102,
    likes: 67,
  },
  {
    id: 4,
    title: "Câu Chuyện Từ Cộng Đồng Lụm",
    excerpt:
      "Những câu chuyện ý nghĩa về sự chia sẻ và giúp đỡ lẫn nhau trong cộng đồng sinh viên.",
    image: "/product/product-3.jpg",
    category: "Câu chuyện",
    author: "Lê Văn C",
    date: "8 Tháng 2, 2026",
    readTime: "3 phút đọc",
    views: 645,
    likes: 34,
  },
  {
    id: 5,
    title: "Xu Hướng Mua Sắm Bền Vững Trong Sinh Viên",
    excerpt:
      "Tại sao ngày càng nhiều sinh viên chọn mua đồ cũ và tham gia vào nền kinh tế tuần hoàn.",
    image: "/product/product-4.jpg",
    category: "Đời sống campus",
    author: "Phạm Thị D",
    date: "5 Tháng 2, 2026",
    readTime: "5 phút đọc",
    views: 923,
    likes: 56,
  },
  {
    id: 6,
    title: "Top 5 Món Đồ Sinh Viên Cần Nhất",
    excerpt:
      "Danh sách những món đồ thiết yếu mà mọi sinh viên nên có và cách mua chúng với giá hợp lý.",
    image: "/product/product-5.jpg",
    category: "Mẹo sinh viên",
    author: "Hoàng Văn E",
    date: "2 Tháng 2, 2026",
    readTime: "4 phút đọc",
    views: 1345,
    likes: 78,
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
    likes: 41,
  },
  {
    id: 8,
    title: "Chuyện Đời Sống Ký Túc Xá",
    excerpt:
      "Những câu chuyện vui buồn lẫn lộn trong cuộc sống ký túc xá của sinh viên.",
    image: "/product/product-7.jpg",
    category: "Đời sống campus",
    author: "Đỗ Văn G",
    date: "28 Tháng 1, 2026",
    readTime: "4 phút đọc",
    views: 534,
    likes: 29,
  },
  {
    id: 9,
    title: "Làm Thế Nào Để Bán Đồ Nhanh Trên Lụm",
    excerpt:
      "Chiến lược đăng tin hiệu quả để sản phẩm của bạn được nhiều người quan tâm.",
    image: "/product/product-8.jpg",
    category: "Hướng dẫn",
    author: "Bùi Thị H",
    date: "25 Tháng 1, 2026",
    readTime: "6 phút đọc",
    views: 1876,
    likes: 92,
  },
];

const primaryPostContent = `
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
`;

export const BLOG_CATEGORY_FILTERS = [
  { id: "all", name: "Tất cả" },
  { id: "tips", name: "Mẹo sinh viên" },
  { id: "story", name: "Câu chuyện" },
  { id: "guide", name: "Hướng dẫn" },
  { id: "campus", name: "Đời sống campus" },
] as const;

export const TRENDING_TOPICS = [
  "Mua bán đồ cũ",
  "Laptop sinh viên",
  "Sách giáo khoa",
  "Đồ điện tử",
  "Đời sống ký túc xá",
  "Tiết kiệm chi phí",
  "Kinh tế tuần hoàn",
  "Môi trường xanh",
] as const;

export const FEATURED_BLOG_ID = 1;

export function getFeaturedBlogPost(): BlogPostSummary {
  return BLOG_POSTS.find((post) => post.id === FEATURED_BLOG_ID) || BLOG_POSTS[0];
}

export function getBlogListingPosts(): BlogPostSummary[] {
  return BLOG_POSTS.filter((post) => post.id !== FEATURED_BLOG_ID);
}

export function getBlogPostIds(): string[] {
  return BLOG_POSTS.map((post) => String(post.id));
}

export function getBlogPostDetailById(id: string | number): BlogPostDetail | null {
  const targetId = Number(id);
  const post = BLOG_POSTS.find((item) => item.id === targetId);

  if (!post) return null;

  if (post.id === FEATURED_BLOG_ID) {
    return {
      ...post,
      content: primaryPostContent,
      comments: 23,
      tags: ["Mua bán", "An toàn", "Mẹo hay", "Sinh viên"],
      authorProfile: {
        name: post.author,
        avatar: "/user/avatar-1.jpg",
        role: "Content Manager",
      },
    };
  }

  return {
    ...post,
    content: defaultPostContent(post),
    comments: Math.max(5, Math.floor(post.likes / 3)),
    tags: [post.category, "Sinh viên", "Lụm"],
    authorProfile: {
      name: post.author,
      avatar: "/user/avatar-1.jpg",
      role: "Cộng tác viên",
    },
  };
}

export function getRelatedBlogPosts(currentId: number, limit = 3): BlogPostSummary[] {
  return BLOG_POSTS.filter((post) => post.id !== currentId).slice(0, limit);
}
