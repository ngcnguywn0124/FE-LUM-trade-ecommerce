import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/features/product/ProductCard";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (!products.length) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Sản phẩm liên quan</h2>
        <Link href="/search" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
          Xem thêm
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
