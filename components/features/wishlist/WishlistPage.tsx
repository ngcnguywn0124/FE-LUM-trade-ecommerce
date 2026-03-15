"use client";

import { useEffect, useMemo, useState } from "react";
import WishlistFilterTabs from "./WishlistFilterTabs";
import ProductCard from "../product/ProductCard";
import WishlistEmptyState from "./WishlistEmptyState";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { favoriteService } from "@/services/favoriteService";
import { mapSummaryToCardProduct } from "@/services/productService";
import { Product } from "@/types";
import { toast } from "sonner";

type WishlistFilter = "all" | "active" | "sold";

interface WishlistItemExtended extends Product {
  status: "active" | "sold";
}

export default function WishlistPage() {
  const [activeFilter, setActiveFilter] = useState<WishlistFilter>("all");
  const [items, setItems] = useState<WishlistItemExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await favoriteService.getMyFavorites(0, 100);
      if ((response.code === 200 || response.code === 1000) && response.data) {
        const mappedItems: WishlistItemExtended[] = response.data.content.map((fav) => ({
          ...mapSummaryToCardProduct(fav.product),
          status: fav.product.status === "sold" ? "sold" : "active",
          isFavorited: true,
        }));
        setItems(mappedItems);        
        // Đồng bộ số lượng ở Header ngay lập tức
        window.dispatchEvent(new Event("favorite-count-sync"));
      }
    } catch (error) {
      console.error("Failed to load favorites", error);
      toast.error("Không thể tải danh sách tin đã lưu");
    } finally {
      setIsLoading(false);
    }
  };

  const activeCount = useMemo(
    () => items.filter((item) => item.status === "active").length,
    [items]
  );

  const soldCount = useMemo(
    () => items.filter((item) => item.status === "sold").length,
    [items]
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.status === activeFilter);
  }, [activeFilter, items]);

  if (isLoading) {
    return (
      <div className="py-24 bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Tin đã lưu" }]} />

        <WishlistFilterTabs
          activeFilter={activeFilter}
          onChange={setActiveFilter}
          totalCount={items.length}
          activeCount={activeCount}
          soldCount={soldCount}
        />

        {filteredItems.length === 0 ? (
          <WishlistEmptyState />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
            {filteredItems.map((item) => (
              <ProductCard 
                key={item.id} 
                product={item} 
                isWishlist={true} 
                onFavoriteToggle={() => loadFavorites()}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
