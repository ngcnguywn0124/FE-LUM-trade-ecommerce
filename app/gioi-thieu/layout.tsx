import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Lụm.vn là sàn thương mại điện tử đồ cũ đầu tiên dành riêng cho sinh viên Việt Nam. Kết nối cộng đồng, lan tỏa giá trị xanh, giúp mỗi giao dịch an toàn, nhanh chóng và tiết kiệm.",
  keywords: [
    "Lụm",
    "mua bán đồ cũ",
    "sinh viên",
    "thương mại điện tử",
    "đồ cũ sinh viên",
    "sống xanh",
    "tiết kiệm sinh viên",
  ],
  openGraph: {
    title: "Giới thiệu về Lụm.vn – Sàn đồ cũ dành cho sinh viên",
    description:
      "Cũ người mới ta, Sinh viên chốt giá! Lụm.vn giúp sinh viên mua bán đồ cũ an toàn, nhanh chóng và bền vững.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
