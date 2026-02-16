"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductImageGallery from "@/components/features/product/details/ProductImageGallery";
import ProductSummary from "@/components/features/product/details/ProductSummary";
import ProductDetailTabs from "@/components/features/product/details/ProductDetailTabs";
import ProductComments from "@/components/features/product/details/ProductComments";
import RelatedProducts from "@/components/features/product/details/RelatedProducts";
import { generateMockProducts } from "@/lib/mockData";
import { Product } from "@/types";

const PRODUCT_DATA: Product[] = generateMockProducts(120);

const conditionLabels: Record<string, string> = {
  new: "Mới 100%",
  "like-new": "Như mới",
  used: "Đã qua sử dụng",
  "for-parts": "Dùng để lấy linh kiện",
};

const ProductDetailPage = () => {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);

  const product = useMemo(
    () => PRODUCT_DATA.find((item) => item.id === productId),
    [productId]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    // Lọc các sản phẩm của cùng người bán
    return PRODUCT_DATA.filter(
      (item) => item.id !== product.id && item.seller?.id === product.seller?.id
    ).slice(0, 20);
  }, [product]);

  if (!product) {
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

  const imageList = useMemo(() => {
    // Ưu tiên ảnh chính, nếu không có thì dùng fallback
    const mainImage = product.image || "/cate/khac-v2.png";
    return Array.from({ length: Math.max(product.imageCount || 1, 4) }, () => mainImage);
  }, [product]);
  const productCondition = conditionLabels[product.condition || "used"] || "Đã qua sử dụng";
  const productDescription = `Mình cần nhượng lại ${product.name} này. Sản phẩm vẫn còn sử dụng rất tốt, ngoại hình còn khá mới và chưa qua sửa chữa.

Thông tin chi tiết:
- Tình trạng: ${productCondition}
- Lý do bán: Mình mới nâng cấp lên dòng cao hơn nên không còn nhu cầu sử dụng.
- Ưu điểm: Máy chạy ổn định, pin còn tốt, đầy đủ phụ kiện đi kèm.

Mình ưu tiên giao dịch trực tiếp tại khu vực ${product.school}${product.campus ? ` (${product.campus})` : ""} để các bạn có thể kiểm tra sản phẩm kỹ lưỡng trước khi mua.

Giá cả có thể thương lượng nhẹ cho các bạn sinh viên nhiệt tình. Vui lòng nhắn tin qua hệ thống chat để hẹn lịch xem máy hoặc hỏi thêm thông tin nhé. Cảm ơn mọi người đã quan tâm!Mình cần nhượng lại ${product.name} này. Sản phẩm vẫn còn sử dụng rất tốt, ngoại hình còn khá mới và chưa qua sửa chữa.

Thông tin chi tiết:
- Tình trạng: ${productCondition}
- Lý do bán: Mình mới nâng cấp lên dòng cao hơn nên không còn nhu cầu sử dụng.
- Ưu điểm: Máy chạy ổn định, pin còn tốt, đầy đủ phụ kiện đi kèm.

Mình ưu tiên giao dịch trực tiếp tại khu vực ${product.school}${product.campus ? ` (${product.campus})` : ""} để các bạn có thể kiểm tra sản phẩm kỹ lưỡng trước khi mua.

Giá cả có thể thương lượng nhẹ cho các bạn sinh viên nhiệt tình. Vui lòng nhắn tin qua hệ thống chat để hẹn lịch xem máy hoặc hỏi thêm thông tin nhé. Cảm ơn mọi người đã quan tâm!Mình cần nhượng lại ${product.name} này. Sản phẩm vẫn còn sử dụng rất tốt, ngoại hình còn khá mới và chưa qua sửa chữa.

Thông tin chi tiết:
- Tình trạng: ${productCondition}
- Lý do bán: Mình mới nâng cấp lên dòng cao hơn nên không còn nhu cầu sử dụng.
- Ưu điểm: Máy chạy ổn định, pin còn tốt, đầy đủ phụ kiện đi kèm.

Mình ưu tiên giao dịch trực tiếp tại khu vực ${product.school}${product.campus ? ` (${product.campus})` : ""} để các bạn có thể kiểm tra sản phẩm kỹ lưỡng trước khi mua.

Giá cả có thể thương lượng nhẹ cho các bạn sinh viên nhiệt tình. Vui lòng nhắn tin qua hệ thống chat để hẹn lịch xem máy hoặc hỏi thêm thông tin nhé. Cảm ơn mọi người đã quan tâm!Mình cần nhượng lại ${product.name} này. Sản phẩm vẫn còn sử dụng rất tốt, ngoại hình còn khá mới và chưa qua sửa chữa.

Thông tin chi tiết:
- Tình trạng: ${productCondition}
- Lý do bán: Mình mới nâng cấp lên dòng cao hơn nên không còn nhu cầu sử dụng.
- Ưu điểm: Máy chạy ổn định, pin còn tốt, đầy đủ phụ kiện đi kèm.

Mình ưu tiên giao dịch trực tiếp tại khu vực ${product.school}${product.campus ? ` (${product.campus})` : ""} để các bạn có thể kiểm tra sản phẩm kỹ lưỡng trước khi mua.

Giá cả có thể thương lượng nhẹ cho các bạn sinh viên nhiệt tình. Vui lòng nhắn tin qua hệ thống chat để hẹn lịch xem máy hoặc hỏi thêm thông tin nhé. Cảm ơn mọi người đã quan tâm!`;

  const specs = [
    { label: "Danh mục", value: product.category || "Đang cập nhật" },
    { label: "Tình trạng", value: productCondition },
    { label: "Khu vực", value: `${product.school}${product.campus ? ` • ${product.campus}` : ""}` },
    { label: "Số hình ảnh", value: `${product.imageCount || 1} ảnh` },
    { label: "Thời gian đăng", value: product.time || "Vừa xong" },
    { label: "Người bán", value: product.seller?.name || "Người bán ẩn danh" },
    { label: "Đánh giá người bán", value: "Chưa có đánh giá" },
    { label: "Lượt xem", value: `${Math.floor(product.id * 3.7)} lượt` },
    { label: "Lượt thích", value: `${Math.floor(product.id * 1.2)} lượt` },
    { label: "Lượt bình luận", value: `${Math.floor(product.id * 0.8)} bình luận` },
  ];

  const infoTags = [
    "Kèm phụ kiện",
    `${productCondition}`,
    `${product.imageCount || 1} ảnh thật`,
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: product.category || "Sản phẩm", href: `/search?category=${encodeURIComponent(product.category || "")}` },
            { label: product.name },
          ]}
        />

        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <ProductImageGallery images={imageList} name={product.name} />
            </div>

            <div className="lg:col-span-7">
              <ProductSummary
                name={product.name}
                price={product.price}
                school={product.school}
                campus={product.campus}
                postedTime={product.time || "Vừa xong"}
                infoTags={infoTags}
                seller={{
                  name: product.seller?.name || "Người bán ẩn danh",
                  avatar: product.seller?.avatar,
                  rating: product.seller?.rating,
                  activityStatus: "Đang hoạt động",
                  soldCount: Math.max(3, Math.floor(product.id / 2)),
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

        <RelatedProducts 
          products={relatedProducts} 
          sellerName={product.seller?.name} 
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
