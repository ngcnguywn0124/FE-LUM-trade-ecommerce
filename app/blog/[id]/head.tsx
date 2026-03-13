import { FEATURED_BLOG_ID, getBlogPostDetailById } from "@/lib/blogData";

export default function Head({ params }: { params: { id: string } }) {
  const { id } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const blogPost =
    getBlogPostDetailById(id) ||
    getBlogPostDetailById(FEATURED_BLOG_ID)!;

  return (
    <>
      <title>{blogPost.title} | Lụm</title>
      <meta
        name="description"
        content={blogPost.excerpt}
      />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={`${siteUrl}/blog/${blogPost.id}`} />
    </>
  );
}
