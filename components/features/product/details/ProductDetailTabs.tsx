"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductDetailTabsProps {
  description: string;
  specs: Array<{ label: string; value: string }>;
}

const ProductDetailTabs = ({ description, specs }: ProductDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const maxHeight = 480; // Tương đương max-h-96 (~384px) của section comment

  useEffect(() => {
    if (contentRef.current) {
      setShowButton(contentRef.current.scrollHeight > maxHeight);
    }
    // Không tự động mở rộng khi đổi tab
  }, [activeTab, description, specs]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 overflow-hidden flex flex-col">
      <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
        <button
          onClick={() => {
            setActiveTab("description");
            setIsExpanded(false);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "description"
              ? "bg-emerald-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Mô tả chi tiết
        </button>
        <button
          onClick={() => {
            setActiveTab("specs");
            setIsExpanded(false);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "specs" ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Thông tin chi tiết
        </button>
      </div>

      <div 
        ref={contentRef}
        className="relative transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: isExpanded ? "none" : `${maxHeight}px` }}
      >
        {activeTab === "description" ? (
          <p className="whitespace-pre-line text-sm leading-7 text-gray-700">{description}</p>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                {specs.map((spec, index) => (
                  <tr 
                    key={spec.label} 
                    className={`${index !== specs.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <td className="py-4 pr-4 text-sm font-medium text-gray-500 w-1/3">
                      {spec.label}:
                    </td>
                    <td className="py-4 text-sm font-semibold text-gray-900">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isExpanded && showButton && (
          <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {showButton && (
        <div className="mt-4 flex justify-center border-t border-gray-50 pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp size={16} />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductDetailTabs;
