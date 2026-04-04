import type { Metadata } from "next";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fetch blog data server-side for dynamic SEO metadata
async function getBlogMeta(
  slug: string
): Promise<{ title: string; description: string; thumbnail?: string } | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/blogs/slug/${slug}`, {
      next: { revalidate: 3600 }, // cache 1 hour
    });
    if (!res.ok) return null;
    const json = await res.json();
    const blog = json?.data;
    if (!blog) return null;
    return {
      title: blog.title,
      description: blog.excerpt || blog.title,
      thumbnail: blog.thumbnail,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogMeta(slug);

  const title = blog?.title ? `${blog.title} – Blog Lụm.vn` : "Bài viết – Blog Lụm.vn";
  const description = blog?.description || "Đọc bài viết trên Blog Lụm.vn";

  return {
    title,
    description,
    keywords: ["blog sinh viên", "lụm vn", "chia sẻ sinh viên", "mẹo mua bán"],
    openGraph: {
      title,
      description,
      type: "article",
      locale: "vi_VN",
      siteName: "Lụm.vn",
      images: blog?.thumbnail
        ? [{ url: blog.thumbnail, width: 1200, height: 630, alt: blog.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog?.thumbnail ? [blog.thumbnail] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
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
