import { Suspense } from "react";
import type { Metadata } from "next";
import SearchPageClient from "../SearchPageClient";

interface SearchBySlugPageProps {
  params: Promise<{ combinedSlug: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: SearchBySlugPageProps): Promise<Metadata> {
  const { combinedSlug } = await params;
  const { q } = await searchParams;
  const canonical = q
    ? `/tim-kiem/${combinedSlug}?q=${encodeURIComponent(q)}`
    : `/tim-kiem/${combinedSlug}`;

  return {
    title: q ? `Tìm kiếm: ${q}` : 'Tìm kiếm sản phẩm',
    alternates: {
      canonical,
    },
  };
}

const SearchBySlugPage = async ({ params }: SearchBySlugPageProps) => {
  const { combinedSlug } = await params;

  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>}
    >
      <SearchPageClient combinedSlug={combinedSlug} />
    </Suspense>
  );
};

export default SearchBySlugPage;
