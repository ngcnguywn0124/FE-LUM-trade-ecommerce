"use client";

import { useMemo, useState } from "react";
import WishlistFilterTabs from "./WishlistFilterTabs";
import ProductCard from "../product/ProductCard";
import WishlistEmptyState from "./WishlistEmptyState";
import { mockWishlist } from "@/lib/mockWishlist";
import Breadcrumb from "@/components/shared/Breadcrumb";

type WishlistFilter = "all" | "active" | "sold";

export default function WishlistPage() {
  const [activeFilter, setActiveFilter] = useState<WishlistFilter>("all");

  const activeCount = useMemo(
    () => mockWishlist.filter((item) => item.status === "active").length,
    []
  );

  const soldCount = useMemo(
    () => mockWishlist.filter((item) => item.status === "sold").length,
    []
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return mockWishlist;
    return mockWishlist.filter((item) => item.status === activeFilter);
  }, [activeFilter]);

  return (
    <section className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Tin đã lưu" }]} />

        <WishlistFilterTabs
          activeFilter={activeFilter}
          onChange={setActiveFilter}
          totalCount={mockWishlist.length}
          activeCount={activeCount}
          soldCount={soldCount}
        />

        {filteredItems.length === 0 ? (
          <WishlistEmptyState />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
            {filteredItems.map((item) => (
              <ProductCard key={item.id} product={item} isWishlist={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
