import ProductCard from "@/components/features/product/ProductCard";
import { Product } from "@/types";

interface UserListingsSectionProps {
  listings: Product[];
}

const UserListingsSection = ({ listings }: UserListingsSectionProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900">Tin đang rao ({listings.length})</h2>
      </div>
      <p className="mt-1 text-xs text-gray-500">Các món đồ sinh viên này đang còn giao dịch.</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {listings.slice(0, 12).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default UserListingsSection;
