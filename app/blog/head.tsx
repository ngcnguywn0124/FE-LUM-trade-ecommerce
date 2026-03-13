export default function Head() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

  return (
    <>
      <title>Blog sinh viên Lụm</title>
      <meta
        name="description"
        content="Khám phá bài viết về mẹo mua bán đồ cũ an toàn, kinh nghiệm học tập và đời sống sinh viên tại Lụm."
      />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={`${siteUrl}/blog`} />
    </>
  );
}
