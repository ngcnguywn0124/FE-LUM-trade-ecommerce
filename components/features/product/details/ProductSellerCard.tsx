import Image from "next/image";
import { Star, User } from "lucide-react";

interface ProductSellerCardProps {
  seller: {
    name: string;
    avatar?: string;
    rating?: number;
  };
}

const ProductSellerCard = ({ seller }: ProductSellerCardProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-gray-900">Thông tin người bán</h2>

      <div className="mt-4 flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
          {seller.avatar ? (
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-emerald-600">
              <User size={20} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800">{seller.name}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
            <Star size={13} className="fill-amber-500" />
            <span className="font-bold">{(seller.rating || 4.5).toFixed(1)}</span>
            <span className="text-gray-500">đánh giá cộng đồng</span>
          </div>
        </div>
      </div>

      <button className="mt-4 w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors">
        Xem thêm tin của người bán
      </button>
    </section>
  );
};

export default ProductSellerCard;
