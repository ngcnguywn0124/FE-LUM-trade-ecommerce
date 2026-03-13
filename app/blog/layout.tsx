import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Blog sinh viên Lụm",
    template: "%s | Blog Lụm",
  },
  description:
    "Blog chia sẻ mẹo mua bán đồ cũ an toàn, kinh nghiệm học tập và đời sống sinh viên từ cộng đồng Lụm.",
  keywords: [
    "blog sinh viên",
    "mua bán đồ cũ",
    "kinh nghiệm sinh viên",
    "đời sống campus",
    "Lụm",
  ],
  openGraph: {
    type: "website",
    title: "Blog sinh viên Lụm",
    description:
      "Khám phá bài viết về mẹo mua bán đồ cũ an toàn, tiết kiệm chi phí và xu hướng sống bền vững cho sinh viên.",
    locale: "vi_VN",
    siteName: "Lụm",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog sinh viên Lụm",
    description:
      "Khám phá bài viết về mẹo mua bán đồ cũ an toàn, tiết kiệm chi phí và xu hướng sống bền vững cho sinh viên.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}