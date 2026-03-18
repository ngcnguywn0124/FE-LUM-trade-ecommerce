"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductImageGallery from "@/components/features/product/details/ProductImageGallery";
import ProductSummary from "@/components/features/product/details/ProductSummary";
import ProductDetailTabs from "@/components/features/product/details/ProductDetailTabs";
import ProductComments from "@/components/features/product/details/ProductComments";
import RelatedProducts from "@/components/features/product/details/RelatedProducts";
import SimilarProducts from "@/components/features/product/details/SimilarProducts";
import StickyMobileBar from "@/components/layout/StickyMobileBar";
import { Product } from "@/types";
import {
  getProductById,
  getProductBySlug,
  getProducts,
  mapDetailToCardProduct,
  mapSummaryToCardProduct,
} from "@/services/productService";
import type { ProductDetailDto } from "@/types/product-api";
import { useWebSocket, type ProductStatusEvent } from "@/hooks/useWebSocket";

const conditionLabels: Record<string, string> = {
  new: "Mới 100%",
  like_new: "Như mới 99%",
  used: "Đã qua sử dụng",
  old: "Cũ/Vẫn dùng tốt",
  broken: "Hỏng/Lấy linh kiện",
};

const ProductDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();

  const [productDetail, setProductDetail] = useState<ProductDetailDto | null>(null);
  const [relatedPool, setRelatedPool] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chuyển về home nếu bài không được duyệt và người xem không phải chủ bài
  useEffect(() => {
    if (!isInitialized || isLoading || !productDetail) return;
    const isOwner = !!user && user.userId === productDetail.sellerId;
    if (productDetail.status !== 'available' && !isOwner) {
      router.replace('/');
    }
  }, [isInitialized, isLoading, productDetail, user, router]);

  // Lắng nghe thay đổi trạng thái realtime qua WebSocket
  const handleProductStatusChanged = useCallback((event: ProductStatusEvent) => {
    if (event.productId !== productDetail?.productId) return;
    const isOwner = !!user && user.userId === productDetail?.sellerId;
    if (event.newStatus !== 'available' && !isOwner) {
      router.replace('/');
      return;
    }
    setProductDetail((prev) => prev ? { ...prev, status: event.newStatus as ProductDetailDto['status'] } : prev);
    if (isOwner) {
      if (event.newStatus === 'available') {
        toast.success('Tin đăng đã được duyệt và hiển thị trở lại!');
      } else if (event.newStatus === 'admin_hidden') {
        toast.error('Tin đăng này đã bị ẩn bởi quản trị viên.', { description: event.message });
      }
    }
  }, [productDetail?.productId, productDetail?.sellerId, user, router]);

  useWebSocket(undefined, productDetail?.productId, handleProductStatusChanged);

  useEffect(() => {
    const loadDetail = async () => {
      setIsLoading(true);

      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        const detail = isUuid ? await getProductById(slug) : await getProductBySlug(slug);
        setProductDetail(detail);

        const related = await getProducts({ page: 0, size: 120, sort: "createdAt,desc" });
        setRelatedPool(related.content.map(mapSummaryToCardProduct));
      } catch {
        setProductDetail(null);
        setRelatedPool([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
  }, [slug]);

  const product = useMemo(() => {
    if (!productDetail) return null;
    return mapDetailToCardProduct(productDetail);
  }, [productDetail]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return relatedPool
      .filter((item) => item.id !== product.id && item.seller?.id === product.seller?.id)
      .slice(0, 20);
  }, [product, relatedPool]);

  const similarProductsPool = useMemo(() => {
    if (!product) return [];
    return relatedPool.filter((item) => item.id !== product.id);
  }, [product, relatedPool]);

  const imageList = useMemo(() => {
    if (!productDetail) return [];

    if (productDetail.images.length > 0) {
      return productDetail.images
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((item) => item.imageUrl);
    }

    return ["/cate/khac-v2.png"];
  }, [productDetail]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 pt-24 pb-12" />;
  }

  if (!product || !productDetail) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <SearchX size={48} className="text-orange-500" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Không tìm thấy sản phẩm</h1>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              Sản phẩm có thể đã được gỡ hoặc mã sản phẩm không hợp lệ.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/search"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Quay lại tìm kiếm
              </Link>
              <Link
                href="/"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = !!user && user.userId === productDetail.sellerId;
  const productCondition = conditionLabels[product.condition || "used"] || "Đã qua sử dụng";
  const productDescription = productDetail.description || "Chưa có mô tả chi tiết.";

  const specs = [
    { label: "Danh mục", value: productDetail.categoryName || "Đang cập nhật" },
    { label: "Tình trạng", value: productCondition },
    {
      label: "Khu vực",
      value: `${product.school}${product.campus ? ` • ${product.campus}` : ""}`,
    },
    // Hiển thị các thông số kỹ thuật động từ backend
    ...(productDetail.attributeValues?.map(attr => ({
      label: attr.attributeName,
      value: attr.value
    })) || [])
  ];

  const infoTags = [
    // Hiển thị thêm các tags từ dữ liệu bài đăng
    ...(productDetail.tags?.map(t => t.tagName) || [])
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24 md:pb-12">
      <StickyMobileBar contactPhone={productDetail.contactPhone} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            {
              label: product.category || "Sản phẩm",
              href: `/tim-kiem?category=${encodeURIComponent(product.category || "")}`,
            },
            { label: product.name },
          ]}
        />

        {isOwner && productDetail.status === 'admin_hidden' && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <span className="mt-0.5 text-base">🚫</span>
            <div>
              <p className="font-semibold">Tin đăng này đã bị ẩn bởi quản trị viên</p>
              <p className="text-red-600">Tin đăng hiện không hiển thị với người dùng khác. Vui lòng liên hệ hỗ trợ nếu bạn có thắc mắc.</p>
            </div>
          </div>
        )}

        {isOwner && productDetail.status === 'pending' && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            <span className="mt-0.5 text-base">⏳</span>
            <div>
              <p className="font-semibold">Tin đăng đang chờ duyệt</p>
              <p className="text-yellow-700">Tin đăng của bạn sẽ hiển thị sau khi được quản trị viên phê duyệt.</p>
            </div>
          </div>
        )}

        {isOwner && productDetail.status === 'hidden' && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <span className="mt-0.5 text-base">👁️‍🗨️</span>
            <div>
              <p className="font-semibold">Tin đăng đang bị ẩn</p>
              <p className="text-gray-500">Tin đăng này hiện không hiển thị công khai.</p>
            </div>
          </div>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <ProductImageGallery images={imageList} name={product.name} />
            </div>

            <div className="lg:col-span-7">
              <ProductSummary
                id={product.id.toString()}
                name={product.name}
                price={product.price}
                school={product.school}
                campus={product.campus}
                postedTime={product.time || "Vừa xong"}
                infoTags={infoTags}
                isFavorited={product.isFavorited}
                isNegotiable={productDetail.isNegotiable}
                contactPhone={productDetail.contactPhone}
                seller={{
                  id: productDetail.sellerId ?? undefined,
                  name: product.seller?.name || "Người bán ẩn danh",
                  avatar: product.seller?.avatar,
                  rating: productDetail.sellerReputation ?? 0,
                  isOnline: productDetail.sellerIsOnline,
                  lastSeenAt: productDetail.sellerLastSeenAt,
                  totalSales: productDetail.sellerTotalSales ?? 0,
                }}
              />
            </div>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8">
            <ProductDetailTabs description={productDescription} specs={specs} />
          </div>
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <ProductComments />
          </div>
        </div>

        <RelatedProducts products={relatedProducts} sellerName={product.seller?.name} />

        <SimilarProducts
          products={similarProductsPool}
          currentProductId={product.id}
          category={product.category}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
