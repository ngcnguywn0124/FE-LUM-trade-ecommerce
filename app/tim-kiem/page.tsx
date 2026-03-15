import { Suspense } from "react";
import type { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const canonical = q ? `/tim-kiem?q=${encodeURIComponent(q)}` : '/tim-kiem';

  return {
    title: q ? `Tìm kiếm: ${q}` : 'Tìm kiếm sản phẩm',
    alternates: {
      canonical,
    },
  };
}

const SearchPage = () => {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>}
    >
      <SearchPageClient />
    </Suspense>
  );
};

export default SearchPage;
