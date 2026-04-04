import PostBlogForm from "@/components/features/blog/PostBlogForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa bài viết | Admin Dashboard",
  description: "Chỉnh sửa bài viết trên Lụm.vn",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogAdminPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <main className="min-h-screen bg-gray-50/50 pt-6">
      <PostBlogForm id={id} />
    </main>
  );
}
