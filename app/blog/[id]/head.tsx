export default function Head({ params }: { params: { id: string } }) {
  const { id } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

  return (
    <>
      <title>{`Bài viết #${id} | Lụm`}</title>
      <meta
        name="description"
        content="Chi tiết bài viết Blog Lụm dành cho cộng đồng sinh viên."
      />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={`${siteUrl}/blog/${id}`} />
    </>
  );
}
