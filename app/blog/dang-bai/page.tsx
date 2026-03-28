import PostBlogForm from "@/components/features/blog/PostBlogForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng bài viết mới | Blog Lụm.vn",
  description: "Chia sẻ kiến thức, kinh nghiệm và những điều thú vị của bạn với cộng đồng sinh viên Lụm.vn.",
};

export default function DangBaiPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pt-20">
      <PostBlogForm />
    </main>
  );
}
