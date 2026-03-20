"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitBlogPost } from "@/lib/blogApi";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function BlogSubmitPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Mẹo sinh viên");
  const [readTime, setReadTime] = useState("5 phút đọc");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const loggedIn = Boolean(token);
    setIsLoggedIn(loggedIn);
    setIsCheckingAuth(false);

    if (!loggedIn) {
      router.replace("/dang-nhap?redirect=/blog/gui-bai");
    }
  }, [router]);

  const canSubmit = useMemo(() => {
    return title.trim() && excerpt.trim() && category.trim() && content.trim();
  }, [title, excerpt, category, content]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      setSubmitState("error");
      setMessage("Bạn cần đăng nhập để gửi bài blog.");
      return;
    }

    if (!canSubmit) {
      setSubmitState("error");
      setMessage("Vui lòng nhập đầy đủ tiêu đề, tóm tắt, danh mục và nội dung.");
      return;
    }

    try {
      setSubmitState("submitting");
      setMessage("");

      const post = await submitBlogPost({
        title,
        excerpt,
        category,
        readTime,
        imageUrl: imageUrl.trim() || undefined,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        content,
      });

      setSubmitState("success");
      setMessage(`Đã gửi bài viết "${post.title}" thành công, hiện đang chờ duyệt.`);

      setTitle("");
      setExcerpt("");
      setContent("");
      setTags("");
      setImageUrl("");
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Gửi bài thất bại, vui lòng thử lại.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f0fdf7] to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-950">Gửi bài Blog của bạn</h1>
            <p className="text-gray-800 mt-2 font-medium">Nội dung sẽ được kiểm duyệt trước khi hiển thị công khai.</p>
          </div>
          <Link href="/blog/bai-cua-toi" className="text-emerald-700 font-bold hover:underline">
            Xem bài của tôi
          </Link>
        </div>

        {!isCheckingAuth && !isLoggedIn && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
            <p className="text-amber-900 font-semibold">Bạn cần đăng nhập trước khi gửi bài Blog.</p>
            <p className="text-amber-800 text-sm mt-1">Hãy bấm vào nút Tài khoản trên header để đăng nhập, sau đó quay lại trang này.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 space-y-5 border border-gray-200">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Tiêu đề</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8cceae]"
              placeholder="Nhập tiêu đề bài viết"
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Tóm tắt ngắn</label>
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8cceae]"
              rows={3}
              placeholder="Mô tả ngắn nội dung bài viết"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Danh mục</label>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8cceae]"
                placeholder="Ví dụ: Mẹo sinh viên"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Thời gian đọc</label>
              <input
                value={readTime}
                onChange={(event) => setReadTime(event.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8cceae]"
                placeholder="Ví dụ: 5 phút đọc"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Ảnh bìa URL (tùy chọn)</label>
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8cceae]"
                placeholder="/banners/blog-featured.jpg hoặc https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Tags (cách nhau dấu phẩy)</label>
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8cceae]"
                placeholder="ví dụ: mua bán, an toàn, sinh viên"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Nội dung (HTML)</label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8cceae] font-mono"
              rows={12}
              placeholder="<h2>Tiêu đề mục</h2><p>Nội dung...</p>"
            />
          </div>

          {message && (
            <p
              className={`text-sm font-medium ${
                submitState === "success" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitState === "submitting" || isCheckingAuth || !isLoggedIn}
              className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors disabled:opacity-60"
            >
              {submitState === "submitting"
                ? "Đang gửi..."
                : isCheckingAuth
                ? "Đang kiểm tra đăng nhập..."
                : !isLoggedIn
                ? "Đăng nhập để gửi bài"
                : "Gửi bài chờ duyệt"}
            </button>
            <Link href="/blog" className="text-gray-800 font-medium hover:text-emerald-700 transition-colors">
              Quay lại Blog
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
