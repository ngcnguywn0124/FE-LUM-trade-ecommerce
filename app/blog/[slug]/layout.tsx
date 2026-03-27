import type { Metadata } from "next";

// Generate metadata per slug
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Map slug to article data for SEO
  const articles: Record<string, { title: string; description: string }> = {
    "5-meo-ban-do-cu-sieu-nhanh": {
      title: "5 mẹo bán đồ cũ siêu nhanh – Chốt deal trong vòng 24h",
      description:
        "Bạn muốn bán nhanh nhưng không biết bắt đầu từ đâu? 5 bí kíp giúp tin đăng nổi bật và thu hút người mua ngay lập tức trên Lụm.vn.",
    },
    "giao-trinh-cu-hay-moi-sinh-vien-nen-biet": {
      title:
        "Giáo trình cũ hay mới? Những điều sinh viên nên biết trước khi mua",
      description:
        "Phân tích ưu nhược của sách cũ vs mới, gợi ý cách tìm sách chất lượng với giá hời trên Lụm.",
    },
    "song-xanh-cho-sinh-vien": {
      title: "Sống xanh cho sinh viên – Bắt đầu từ việc tái sử dụng đồ cũ",
      description:
        "Mỗi món đồ cũ được tái sử dụng là một bước nhỏ hướng tới lối sống bền vững cho sinh viên.",
    },
    "top-5-do-cu-ban-chay-nhat": {
      title: "Top 5 đồ cũ bán chạy nhất trên Lụm.vn tháng 3/2026",
      description:
        "Từ MacBook đến giáo trình, khám phá những món đồ sinh viên săn lùng nhiều nhất tháng này.",
    },
    "huong-dan-chup-anh-san-pham-dep": {
      title:
        "Hướng dẫn chụp ảnh sản phẩm đẹp bằng điện thoại – Bán nhanh gấp đôi!",
      description:
        "Kỹ thuật chụp ảnh sản phẩm chuyên nghiệp chỉ với smartphone, áp dụng ngay cho tin đăng trên Lụm.",
    },
    "5-cach-tiet-kiem-cho-sinh-vien": {
      title: "5 cách tiết kiệm hiệu quả mà sinh viên nào cũng nên biết",
      description:
        "Từ việc mua đồ cũ, chia phòng trọ cho đến nấu ăn tại nhà – những cách giúp bạn sống khỏe với ngân sách sinh viên.",
    },
  };

  const article = articles[slug];

  return {
    title: article?.title ?? "Bài viết",
    description: article?.description ?? "Đọc bài viết trên Blog Lụm.vn",
    openGraph: {
      title: article?.title ?? "Bài viết – Blog Lụm.vn",
      description: article?.description ?? "Đọc bài viết trên Blog Lụm.vn",
      type: "article",
      locale: "vi_VN",
    },
  };
}

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
