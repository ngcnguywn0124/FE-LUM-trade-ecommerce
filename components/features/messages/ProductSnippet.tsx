import Image from 'next/image';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { MessageRelatedPost } from '@/types/messages';

interface ProductSnippetProps {
  product: MessageRelatedPost;
  isSeller: boolean;
}

const ProductSnippet = ({ product, isSeller }: ProductSnippetProps) => {
  return (
    <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between gap-3 shadow-xs sticky top-0 z-10">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h4>
          <p className="text-xs font-bold text-emerald-600">{product.price}</p>
        </div>
      </div>

      <div className="shrink-0">
        {isSeller ? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm">
            <CheckCircle size={14} />
            <span className="text-[11px] font-bold">Xác nhận đã bán</span>
          </button>
        ) : (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors cursor-pointer shadow-sm">
            <ShoppingBag size={14} />
            <span className="text-[11px] font-bold">Chốt lụm</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSnippet;
