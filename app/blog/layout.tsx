import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Sinh Viên",
  description:
    "Blog Lụm.vn – Chia sẻ mẹo mua bán đồ cũ, bí kíp tiết kiệm, đời sống sinh viên và xu hướng sống xanh. Cập nhật liên tục từ cộng đồng sinh viên Việt Nam.",
  keywords: [
    "blog sinh viên",
    "mẹo mua bán đồ cũ",
    "tiết kiệm sinh viên",
    "sống xanh",
    "Lụm blog",
    "đời sống sinh viên",
    "kinh nghiệm sinh viên",
  ],
  openGraph: {
    title: "Blog Sinh Viên – Lụm.vn",
    description:
      "Mẹo mua bán thông minh, bí kíp tiết kiệm và câu chuyện cộng đồng sinh viên. Cập nhật mỗi tuần trên Lụm.vn.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
