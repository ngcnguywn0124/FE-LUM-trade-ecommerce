"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  Eye,
  Heart,
  ArrowLeft,
  Share2,
  Bookmark,
  Tag,
  ChevronRight,
  Calendar,
  User,
  MessageCircle,
  ThumbsUp,
  Facebook,
  Twitter,
  Copy,
  Check,
} from "lucide-react";

/* ────────────────────────── Animation ────────────────────────── */
const easeOutCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: easeOutCurve },
  }),
};

/* ─────────────────────────── Types ─────────────────────────── */
interface BlogArticle {
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
    role: string;
  };
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  content: ContentBlock[];
  tags: string[];
}

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; author?: string }
  | { type: "tip"; text: string };

/* ─────────────────────────── Data ─────────────────────────── */
const ARTICLES: Record<string, BlogArticle> = {
  "5-meo-ban-do-cu-sieu-nhanh": {
    id: "1",
    slug: "5-meo-ban-do-cu-sieu-nhanh",
    title: "5 mẹo bán đồ cũ siêu nhanh – Chốt deal trong vòng 24h",
    excerpt:
      "Bạn muốn bán nhanh nhưng không biết bắt đầu từ đâu? Dưới đây là 5 bí kíp giúp tin đăng của bạn nổi bật và thu hút người mua ngay lập tức trên Lụm.vn.",
    category: "Mẹo mua bán",
    categoryColor: "#FFBA00",
    thumbnail: "/banners/deal-hunter.png",
    author: {
      name: "Nguyễn Quý Ngọc",
      avatar: "/user/avatar-user-profile-default.png",
      role: "UI/UX Designer & Content Writer",
    },
    publishedAt: "25/03/2026",
    readTime: "5 phút đọc",
    views: 2430,
    likes: 187,
    tags: ["mẹo bán hàng", "đồ cũ", "sinh viên", "chốt deal"],
    content: [
      {
        type: "paragraph",
        text: "Bán đồ cũ trên Lụm.vn không chỉ giúp bạn kiếm thêm thu nhập mà còn góp phần vào lối sống xanh, bền vững. Tuy nhiên, không phải ai cũng biết cách để tin đăng của mình nổi bật giữa hàng nghìn sản phẩm khác. Bài viết này sẽ chia sẻ 5 mẹo đơn giản nhưng cực kỳ hiệu quả!",
      },
      {
        type: "heading",
        text: "1. Chụp ảnh sản phẩm thật đẹp và rõ ràng",
      },
      {
        type: "paragraph",
        text: "Ảnh là yếu tố đầu tiên thu hút người mua. Hãy chụp sản phẩm dưới ánh sáng tự nhiên, từ nhiều góc độ khác nhau. Đừng quên chụp cận cảnh những chi tiết quan trọng và các vết trầy xước (nếu có) để tạo sự tin tưởng.",
      },
      {
        type: "tip",
        text: "Mẹo: Đặt sản phẩm trên nền trắng hoặc nền gỗ sáng để ảnh trông chuyên nghiệp hơn. Tránh chụp trong phòng tối hoặc lộn xộn.",
      },
      {
        type: "heading",
        text: "2. Viết tiêu đề hấp dẫn và thông tin đầy đủ",
      },
      {
        type: "paragraph",
        text: "Tiêu đề nên ngắn gọn, bao gồm tên sản phẩm, tình trạng và giá. Ví dụ: 'MacBook Air M1 2020 - 95% mới - Giá SV: 12tr'. Người mua thường lướt rất nhanh, tiêu đề rõ ràng sẽ giúp họ dừng lại ở tin của bạn.",
      },
      {
        type: "heading",
        text: "3. Định giá hợp lý – Tham khảo thị trường",
      },
      {
        type: "paragraph",
        text: "Trước khi đặt giá, hãy xem những sản phẩm tương tự trên Lụm.vn đang được bán với giá bao nhiêu. Định giá quá cao sẽ khiến người mua bỏ qua, quá thấp thì bạn lỗ. Một mức giá hợp lý khoảng 60-80% so với giá mới là lý tưởng.",
      },
      {
        type: "list",
        items: [
          "Đồ điện tử: thường giữ giá 60-75% so với giá mới",
          "Sách giáo trình: có thể bán 40-60% giá bìa",
          "Quần áo, phụ kiện: khoảng 30-50% tùy tình trạng",
          "Đồ nội thất nhỏ: 50-70% giá mới nếu còn tốt",
        ],
      },
      {
        type: "heading",
        text: "4. Phản hồi tin nhắn nhanh chóng",
      },
      {
        type: "paragraph",
        text: "Khi người mua quan tâm, họ thường nhắn tin ngay. Nếu bạn phản hồi chậm, họ có thể đã tìm được sản phẩm khác. Hãy bật thông báo và trả lời trong vòng 30 phút để tăng tỷ lệ chốt deal.",
      },
      {
        type: "quote",
        text: "Người bán phản hồi trong 15 phút đầu tiên có tỷ lệ chốt deal cao gấp 3 lần so với phản hồi sau 1 giờ.",
        author: "Thống kê Lụm.vn 2026",
      },
      {
        type: "heading",
        text: "5. Đăng tin vào khung giờ vàng",
      },
      {
        type: "paragraph",
        text: "Sinh viên thường online nhiều nhất vào buổi tối (19h-22h) và giờ nghỉ trưa (11h30-13h). Đăng tin vào những khung giờ này sẽ giúp bài đăng của bạn tiếp cận nhiều người hơn.",
      },
      {
        type: "tip",
        text: "Bonus: Chia sẻ link tin đăng lên nhóm Facebook trường, group KTX hoặc story Instagram để tăng lượt xem thêm!",
      },
      {
        type: "paragraph",
        text: "Với 5 mẹo đơn giản trên, bạn hoàn toàn có thể chốt deal thành công trong vòng 24 giờ. Bắt đầu đăng tin ngay trên Lụm.vn và trải nghiệm sự khác biệt nhé!",
      },
    ],
  },
  "giao-trinh-cu-hay-moi-sinh-vien-nen-biet": {
    id: "2",
    slug: "giao-trinh-cu-hay-moi-sinh-vien-nen-biet",
    title:
      "Giáo trình cũ hay mới? Những điều sinh viên nên biết trước khi mua",
    excerpt:
      "Đầu năm học mới, giáo trình là mối lo lớn. Bài viết phân tích ưu nhược của sách cũ vs mới, và gợi ý cách tìm sách chất lượng với giá hời trên Lụm.",
    category: "Chia sẻ kinh nghiệm",
    categoryColor: "#00B894",
    thumbnail: "/banners/student-marketplace.png",
    author: {
      name: "Thân Quang Tuân",
      avatar: "/user/avatar-user-profile-default.png",
      role: "Fullstack Developer & Blogger",
    },
    publishedAt: "22/03/2026",
    readTime: "7 phút đọc",
    views: 1856,
    likes: 142,
    tags: ["giáo trình", "sách cũ", "sinh viên", "tiết kiệm"],
    content: [
      {
        type: "paragraph",
        text: "Mỗi đầu học kỳ, sinh viên lại đối mặt với bài toán quen thuộc: mua giáo trình mới hay tìm sách cũ? Với chi phí giáo trình ngày càng cao, việc cân nhắc kỹ trước khi mua là điều cần thiết.",
      },
      {
        type: "heading",
        text: "Ưu điểm của giáo trình cũ",
      },
      {
        type: "list",
        items: [
          "Giá rẻ hơn 40-60% so với sách mới",
          "Có sẵn ghi chú, highlight của anh chị khóa trước – rất hữu ích cho ôn thi",
          "Góp phần bảo vệ môi trường, giảm lãng phí giấy",
          "Dễ tìm trên Lụm.vn với nhiều phiên bản khác nhau",
        ],
      },
      {
        type: "heading",
        text: "Khi nào nên mua sách mới?",
      },
      {
        type: "paragraph",
        text: "Có những trường hợp sách mới là lựa chọn tốt hơn: khi giáo trình được cập nhật phiên bản mới với nội dung thay đổi đáng kể, khi bạn cần sách còn nguyên vẹn để sử dụng lâu dài, hoặc khi môn học yêu cầu phiên bản cụ thể.",
      },
      {
        type: "quote",
        text: "Kinh nghiệm của mình là luôn hỏi anh chị khóa trước xem giáo trình phiên bản cũ có khác nhiều không, trước khi quyết định mua mới.",
        author: "Một sinh viên năm 3 – HUTECH",
      },
      {
        type: "heading",
        text: "Mẹo tìm giáo trình chất lượng trên Lụm",
      },
      {
        type: "list",
        items: [
          "Lọc theo trường đại học để tìm đúng giáo trình bạn cần",
          "Kiểm tra ảnh thực tế – ưu tiên sách còn 80% trở lên",
          "Đọc đánh giá của người bán để đảm bảo uy tín",
          "Chat trực tiếp để hỏi về tình trạng sách trước khi mua",
        ],
      },
      {
        type: "tip",
        text: "Mẹo hay: Sau khi học xong, bạn có thể bán lại giáo trình trên Lụm.vn để \"thu hồi vốn\" và giúp đỡ các bạn khóa sau!",
      },
      {
        type: "paragraph",
        text: "Dù chọn sách mới hay cũ, điều quan trọng nhất là bạn có nguồn tài liệu phù hợp để học tập hiệu quả. Hãy tận dụng Lụm.vn để tìm những cuốn giáo trình chất lượng với giá sinh viên nhé!",
      },
    ],
  },
  "song-xanh-cho-sinh-vien": {
    id: "3",
    slug: "song-xanh-cho-sinh-vien",
    title: "Sống xanh cho sinh viên – Bắt đầu từ việc tái sử dụng đồ cũ",
    excerpt:
      "Mỗi món đồ cũ được tái sử dụng là một bước nhỏ hướng tới lối sống bền vững. Cùng tìm hiểu cách sinh viên có thể đóng góp cho môi trường ngay hôm nay.",
    category: "Sống xanh",
    categoryColor: "#8cceae",
    thumbnail: "/banners/safe-transaction.png",
    author: {
      name: "Nguyễn Ái Bình",
      avatar: "/user/avatar-user-profile-default.png",
      role: "Backend Developer & Green Advocate",
    },
    publishedAt: "20/03/2026",
    readTime: "4 phút đọc",
    views: 1320,
    likes: 98,
    tags: ["sống xanh", "bền vững", "tái sử dụng", "môi trường"],
    content: [
      {
        type: "paragraph",
        text: "Sống xanh không chỉ là xu hướng – nó là trách nhiệm. Và tin vui là, sinh viên hoàn toàn có thể bắt đầu hành trình sống xanh từ những việc đơn giản nhất: tái sử dụng đồ cũ.",
      },
      {
        type: "heading",
        text: "Tại sao tái sử dụng đồ cũ lại quan trọng?",
      },
      {
        type: "paragraph",
        text: "Theo thống kê, trung bình mỗi sinh viên thải ra khoảng 30-50kg rác từ đồ dùng không còn sử dụng mỗi năm. Phần lớn trong số đó vẫn còn giá trị sử dụng và có thể phục vụ người khác.",
      },
      {
        type: "list",
        items: [
          "Giảm lượng rác thải ra môi trường",
          "Tiết kiệm tài nguyên sản xuất",
          "Giảm phát thải CO2 từ quá trình sản xuất mới",
          "Xây dựng cộng đồng chia sẻ, giúp đỡ lẫn nhau",
        ],
      },
      {
        type: "heading",
        text: "Cách sinh viên có thể sống xanh hơn",
      },
      {
        type: "list",
        items: [
          "Mua đồ cũ thay vì mua mới khi có thể",
          "Bán hoặc tặng đồ không dùng thay vì vứt bỏ",
          "Sử dụng bình nước, hộp cơm tái sử dụng",
          "Mua sắm có chọn lọc, tránh mua impulse",
          "Chia sẻ tài liệu học tập với bạn bè",
        ],
      },
      {
        type: "quote",
        text: "Cũ người mới ta – không chỉ là slogan, mà là triết lý sống của cả một thế hệ sinh viên ý thức về môi trường.",
        author: "Lụm.vn",
      },
      {
        type: "tip",
        text: "Hãy bắt đầu ngay hôm nay: Dọn phòng, tìm những món đồ bạn không còn dùng và đăng bán trên Lụm.vn. Vừa kiếm thêm tiền, vừa sống xanh!",
      },
    ],
  },
  "top-5-do-cu-ban-chay-nhat": {
    id: "4",
    slug: "top-5-do-cu-ban-chay-nhat",
    title: "Top 5 đồ cũ bán chạy nhất trên Lụm.vn tháng 3/2026",
    excerpt:
      "Từ MacBook đến giáo trình, đâu là những món đồ sinh viên săn lùng nhiều nhất? Cập nhật xu hướng mua sắm tháng này ngay!",
    category: "Xu hướng",
    categoryColor: "#FF7675",
    thumbnail: "/banners/promo-v4.png",
    author: {
      name: "Nguyễn Quý Ngọc",
      avatar: "/user/avatar-user-profile-default.png",
      role: "UI/UX Designer & Content Writer",
    },
    publishedAt: "18/03/2026",
    readTime: "6 phút đọc",
    views: 3210,
    likes: 265,
    tags: ["xu hướng", "bán chạy", "MacBook", "giáo trình"],
    content: [
      {
        type: "paragraph",
        text: "Tháng 3 – tháng của mùa tựu trường và khởi đầu mới! Cùng điểm qua Top 5 danh mục đồ cũ được sinh viên tìm kiếm và giao dịch nhiều nhất trên Lụm.vn.",
      },
      {
        type: "heading",
        text: "1. Laptop & Máy tính bảng",
      },
      {
        type: "paragraph",
        text: "Không bất ngờ khi laptop luôn đứng đầu danh sách. MacBook Air M1, Lenovo ThinkPad, Dell XPS là những model được tìm kiếm nhiều nhất. Sinh viên mới vào trường thường ưu tiên tìm laptop cũ chất lượng để tiết kiệm chi phí.",
      },
      {
        type: "heading",
        text: "2. Giáo trình & Sách chuyên ngành",
      },
      {
        type: "paragraph",
        text: "Đầu học kỳ, nhu cầu mua giáo trình tăng vọt. Sách Kinh tế, IT, và Ngoại ngữ là 3 nhóm được giao dịch nhiều nhất. Giáo trình cũ giúp sinh viên tiết kiệm 40-60% chi phí.",
      },
      {
        type: "heading",
        text: "3. Xe đạp & Xe máy",
      },
      {
        type: "paragraph",
        text: "Phương tiện di chuyển luôn là nhu cầu thiết yếu. Xe đạp điện và xe máy cũ dưới 10 triệu là phân khúc hot nhất trên Lụm tháng này.",
      },
      {
        type: "heading",
        text: "4. Quần áo & Phụ kiện",
      },
      {
        type: "paragraph",
        text: "Thời trang secondhand ngày càng được yêu thích. Quần jean, áo khoác và túi xách vintage là những mặt hàng trao đổi sôi nổi nhất.",
      },
      {
        type: "heading",
        text: "5. Đồ nội thất phòng trọ",
      },
      {
        type: "paragraph",
        text: "Bàn học, kệ sách, quạt điều hòa mini... Những món đồ nội thất nhỏ nhưng cần thiết cho cuộc sống phòng trọ sinh viên.",
      },
      {
        type: "tip",
        text: "Nếu bạn đang có những món đồ thuộc Top 5 trên và không còn sử dụng, đây là thời điểm tốt nhất để đăng bán trên Lụm.vn – nhu cầu đang rất cao!",
      },
    ],
  },
  "huong-dan-chup-anh-san-pham-dep": {
    id: "5",
    slug: "huong-dan-chup-anh-san-pham-dep",
    title:
      "Hướng dẫn chụp ảnh sản phẩm đẹp bằng điện thoại – Bán nhanh gấp đôi!",
    excerpt:
      "Ảnh đẹp = bán nhanh. Bài viết chia sẻ kỹ thuật chụp ảnh sản phẩm chuyên nghiệp chỉ với smartphone, áp dụng ngay cho tin đăng trên Lụm.",
    category: "Mẹo mua bán",
    categoryColor: "#FFBA00",
    thumbnail: "/banners/promo-v2.jpg",
    author: {
      name: "Thân Quang Tuân",
      avatar: "/user/avatar-user-profile-default.png",
      role: "Fullstack Developer & Blogger",
    },
    publishedAt: "15/03/2026",
    readTime: "8 phút đọc",
    views: 1670,
    likes: 124,
    tags: ["chụp ảnh", "smartphone", "bán hàng", "mẹo"],
    content: [
      {
        type: "paragraph",
        text: "Trên Lụm.vn, ảnh sản phẩm chính là \"lời giới thiệu\" đầu tiên. Một bức ảnh đẹp có thể tăng gấp đôi lượt xem và tỷ lệ liên hệ. Bài viết này sẽ hướng dẫn bạn chụp ảnh sản phẩm chuyên nghiệp chỉ với chiếc điện thoại.",
      },
      {
        type: "heading",
        text: "Chọn ánh sáng phù hợp",
      },
      {
        type: "paragraph",
        text: "Ánh sáng tự nhiên là lựa chọn tốt nhất và miễn phí! Hãy chụp gần cửa sổ vào buổi sáng hoặc chiều muộn. Tránh ánh nắng trực tiếp vì sẽ tạo bóng cứng.",
      },
      {
        type: "heading",
        text: "Chuẩn bị background sạch sẽ",
      },
      {
        type: "paragraph",
        text: "Nền trắng, nền gỗ sáng hoặc vải linen là những lựa chọn an toàn. Tránh nền lộn xộn hoặc quá nhiều màu sắc sẽ phân tán sự chú ý khỏi sản phẩm.",
      },
      {
        type: "heading",
        text: "Chụp từ nhiều góc độ",
      },
      {
        type: "list",
        items: [
          "Ảnh tổng thể: Cho thấy toàn bộ sản phẩm",
          "Ảnh chi tiết: Cận cảnh logo, vết trầy, tem, tag",
          "Ảnh kích thước: Đặt cạnh vật thể quen thuộc để so sánh",
          "Ảnh sử dụng: Cho thấy sản phẩm khi được sử dụng thực tế",
        ],
      },
      {
        type: "tip",
        text: "Mẹo pro: Bật chế độ HDR trên điện thoại để ảnh có chi tiết tốt hơn ở cả vùng sáng và vùng tối. Tránh dùng flash vì sẽ làm ảnh bị phẳng và mất tự nhiên.",
      },
      {
        type: "heading",
        text: "Chỉnh sửa nhẹ nhàng",
      },
      {
        type: "paragraph",
        text: "Dùng app chỉnh ảnh miễn phí như Snapseed hoặc chức năng chỉnh sửa có sẵn trên điện thoại. Tăng nhẹ sáng, contrast và saturation. Nhưng đừng lạm dụng filter – người mua cần thấy ảnh thật!",
      },
      {
        type: "paragraph",
        text: "Với những mẹo trên, bạn hoàn toàn có thể tạo ra những bức ảnh sản phẩm chuyên nghiệp mà không cần máy ảnh đắt tiền. Hãy thử ngay cho tin đăng tiếp theo trên Lụm.vn nhé!",
      },
    ],
  },
  "5-cach-tiet-kiem-cho-sinh-vien": {
    id: "6",
    slug: "5-cach-tiet-kiem-cho-sinh-vien",
    title: "5 cách tiết kiệm hiệu quả mà sinh viên nào cũng nên biết",
    excerpt:
      "Từ việc mua đồ cũ, chia phòng trọ cho đến nấu ăn tại nhà – đây là những cách giúp bạn sống khỏe với ngân sách sinh viên.",
    category: "Đời sống SV",
    categoryColor: "#6C5CE7",
    thumbnail: "/banners/promo-v3.jpg",
    author: {
      name: "Nguyễn Ái Bình",
      avatar: "/user/avatar-user-profile-default.png",
      role: "Backend Developer & Green Advocate",
    },
    publishedAt: "12/03/2026",
    readTime: "5 phút đọc",
    views: 2100,
    likes: 176,
    tags: ["tiết kiệm", "sinh viên", "ngân sách", "đời sống"],
    content: [
      {
        type: "paragraph",
        text: "Cuộc sống sinh viên với ngân sách hạn hẹp đòi hỏi kỹ năng quản lý tài chính thông minh. Dưới đây là 5 cách tiết kiệm đã được kiểm chứng bởi hàng nghìn sinh viên trên cộng đồng Lụm.vn.",
      },
      {
        type: "heading",
        text: "1. Mua đồ cũ thay vì mua mới",
      },
      {
        type: "paragraph",
        text: "Laptop, giáo trình, đồ nội thất phòng trọ... tất cả đều có thể tìm được phiên bản cũ chất lượng với giá chỉ 50-70% so với mua mới. Lụm.vn là nơi lý tưởng để tìm những deal hời từ sinh viên cùng trường.",
      },
      {
        type: "heading",
        text: "2. Nấu ăn tại nhà",
      },
      {
        type: "paragraph",
        text: "Ăn ngoài trung bình tốn 50-80k/bữa, trong khi nấu ăn tại nhà chỉ khoảng 20-30k. Mỗi tháng bạn có thể tiết kiệm 1-2 triệu đồng chỉ bằng cách meal prep vào cuối tuần.",
      },
      {
        type: "heading",
        text: "3. Chia sẻ chi phí sinh hoạt",
      },
      {
        type: "paragraph",
        text: "Ở ghép 2-3 người, chia tiền internet, điện nước... giúp giảm đáng kể chi phí hàng tháng. Ngoài ra, bạn có thể chia sẻ tài khoản Netflix, Spotify với roommate.",
      },
      {
        type: "heading",
        text: "4. Tận dụng ưu đãi sinh viên",
      },
      {
        type: "list",
        items: [
          "Apple Education: Giảm giá 5-10% cho sinh viên",
          "GitHub Student Pack: Hàng chục công cụ miễn phí cho IT",
          "Spotify Student: Chỉ 29k/tháng thay vì 59k",
          "Canva Pro: Miễn phí cho email .edu",
          "Các ứng dụng giao đồ ăn thường có mã giảm giá cho sinh viên",
        ],
      },
      {
        type: "heading",
        text: "5. Bán đồ không dùng",
      },
      {
        type: "paragraph",
        text: "Cuối học kỳ, hãy dọn phòng và đăng bán những đồ bạn không còn cần trên Lụm.vn. Vừa dọn dẹp, vừa có thêm \"quỹ\" cho học kỳ mới. Nhiều sinh viên đã kiếm được 500k-2tr mỗi lần dọn phòng!",
      },
      {
        type: "quote",
        text: "Tiết kiệm không phải là chi tiêu ít đi, mà là chi tiêu thông minh hơn.",
      },
      {
        type: "tip",
        text: "Bắt đầu bằng việc ghi chép chi tiêu trong 1 tuần – bạn sẽ ngạc nhiên khi biết tiền \"bay\" đi đâu. Sau đó hãy áp dụng những mẹo trên!",
      },
    ],
  },
};

const RELATED_SLUGS: Record<string, string[]> = {
  "5-meo-ban-do-cu-sieu-nhanh": [
    "huong-dan-chup-anh-san-pham-dep",
    "top-5-do-cu-ban-chay-nhat",
    "5-cach-tiet-kiem-cho-sinh-vien",
  ],
  "giao-trinh-cu-hay-moi-sinh-vien-nen-biet": [
    "5-cach-tiet-kiem-cho-sinh-vien",
    "song-xanh-cho-sinh-vien",
    "5-meo-ban-do-cu-sieu-nhanh",
  ],
  "song-xanh-cho-sinh-vien": [
    "giao-trinh-cu-hay-moi-sinh-vien-nen-biet",
    "5-cach-tiet-kiem-cho-sinh-vien",
    "top-5-do-cu-ban-chay-nhat",
  ],
  "top-5-do-cu-ban-chay-nhat": [
    "5-meo-ban-do-cu-sieu-nhanh",
    "huong-dan-chup-anh-san-pham-dep",
    "song-xanh-cho-sinh-vien",
  ],
  "huong-dan-chup-anh-san-pham-dep": [
    "5-meo-ban-do-cu-sieu-nhanh",
    "top-5-do-cu-ban-chay-nhat",
    "giao-trinh-cu-hay-moi-sinh-vien-nen-biet",
  ],
  "5-cach-tiet-kiem-cho-sinh-vien": [
    "giao-trinh-cu-hay-moi-sinh-vien-nen-biet",
    "song-xanh-cho-sinh-vien",
    "5-meo-ban-do-cu-sieu-nhanh",
  ],
};

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */
export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const article = ARTICLES[slug];
  const [liked, setLiked] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bài viết không tồn tại
          </h2>
          <p className="text-gray-500 mb-6">
            Bài viết bạn tìm kiếm có thể đã bị xóa hoặc đường dẫn không đúng.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
          >
            <ArrowLeft size={18} />
            Quay lại Blog
          </Link>
        </div>
      </main>
    );
  }

  const relatedArticles = (RELATED_SLUGS[slug] ?? [])
    .map((s) => ARTICLES[s])
    .filter(Boolean);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen font-sans bg-white">
      {/* ────────── Hero Banner ────────── */}
      <section className="relative pt-20 md:pt-24">
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4 z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-sm font-bold hover:bg-white/30 transition-all border border-white/20"
            >
              <ArrowLeft size={16} />
              Blog
            </Link>
          </div>

          {/* Category + Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm mb-4"
                style={{
                  backgroundColor: article.categoryColor + "CC",
                }}
              >
                <Tag size={12} />
                {article.category}
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ────────── Article Meta ────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-5">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div className="flex items-center gap-3">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={44}
                height={44}
                className="rounded-full border-2 border-gray-100"
              />
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  {article.author.name}
                </p>
                <p className="text-xs text-gray-400">{article.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {article.views.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── Article Content ────────── */}
      <article className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="prose-custom"
          >
            {/* Excerpt */}
            <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed mb-8 pb-8 border-b border-gray-100">
              {article.excerpt}
            </p>

            {/* Content blocks */}
            {article.content.map((block, idx) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p
                      key={idx}
                      className="text-gray-700 leading-relaxed text-base md:text-lg mb-5"
                    >
                      {block.text}
                    </p>
                  );
                case "heading":
                  return (
                    <h2
                      key={idx}
                      className="text-xl md:text-2xl font-black text-gray-900 mt-10 mb-4"
                    >
                      {block.text}
                    </h2>
                  );
                case "image":
                  return (
                    <figure key={idx} className="my-8">
                      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                        <Image
                          src={block.src}
                          alt={block.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="text-center text-sm text-gray-400 mt-3">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                case "list":
                  return (
                    <ul
                      key={idx}
                      className="space-y-2.5 my-5 pl-1"
                    >
                      {block.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-gray-700 text-base md:text-lg"
                        >
                          <span className="mt-2 w-2 h-2 rounded-full bg-[#8cceae] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                case "quote":
                  return (
                    <blockquote
                      key={idx}
                      className="my-8 border-l-4 border-[#FFBA00] bg-[#FFF8E1] rounded-r-2xl p-5 md:p-6"
                    >
                      <p className="text-gray-800 italic text-base md:text-lg leading-relaxed">
                        &ldquo;{block.text}&rdquo;
                      </p>
                      {block.author && (
                        <p className="mt-3 text-sm font-bold text-[#B8860B]">
                          — {block.author}
                        </p>
                      )}
                    </blockquote>
                  );
                case "tip":
                  return (
                    <div
                      key={idx}
                      className="my-6 bg-[#E8F5E9] border border-[#8cceae]/30 rounded-2xl p-5 md:p-6"
                    >
                      <p className="text-gray-800 text-base md:text-lg leading-relaxed">
                        💡 {block.text}
                      </p>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </motion.div>

          {/* ────────── Tags ────────── */}
          <motion.div
            className="mt-10 pt-8 border-t border-gray-100"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  #&thinsp;{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ────────── Action Bar ────────── */}
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <button
              onClick={() => setLiked(!liked)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                liked
                  ? "bg-red-50 text-red-500 border border-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              {liked ? article.likes + 1 : article.likes}
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  Đã sao chép!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Sao chép link
                </>
              )}
            </button>

            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer">
              <Bookmark size={16} />
              Lưu bài viết
            </button>
          </motion.div>
        </div>
      </article>

      {/* ────────── Related Posts ────────── */}
      {relatedArticles.length > 0 && (
        <section className="py-14 md:py-20 bg-gray-50/50 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                Bài viết{" "}
                <span className="text-[#8cceae]">liên quan</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {relatedArticles.map((post, i) => (
                <motion.article
                  key={post.id}
                  variants={fadeUp}
                  custom={i}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all hover:-translate-y-1"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-40 overflow-hidden">
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
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {post.readTime}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ────────── CTA ────────── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#111111] to-[#1A1A1A] text-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Bạn có đồ{" "}
              <span className="text-[#FFBA00]">không dùng?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Đăng bán ngay trên Lụm.vn – vừa kiếm thêm tiền, vừa giúp đỡ
              sinh viên khác!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FFBA00] text-black font-bold rounded-xl hover:bg-white transition-all shadow-lg"
              >
                Đăng tin ngay
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                Đọc thêm bài viết
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
