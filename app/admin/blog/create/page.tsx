import PostBlogForm from "@/components/features/blog/PostBlogForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng bài viết mới | Admin Dashboard",
  description: "Đăng bài viết mới trên Lụm.vn",
};

export default function DangBaiAdminPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pt-6">
      <PostBlogForm />
    </main>
  );
}
