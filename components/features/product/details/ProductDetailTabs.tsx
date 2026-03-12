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
          <div className="prose prose-slate prose-sm max-w-none text-gray-700">
             <div 
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: description }} 
             />
             <style jsx>{`
                .rich-text-content :global(ul) {
                  list-style-type: disc !important;
                  margin-left: 1.5rem !important;
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .rich-text-content :global(ol) {
                  list-style-type: decimal !important;
                  margin-left: 1.5rem !important;
                  margin-top: 0.5rem !important;
                  margin-bottom: 0.5rem !important;
                }
                .rich-text-content :global(li) {
                  margin-bottom: 0.25rem !important;
                  display: list-item !important;
                }
                .rich-text-content :global(h1) {
                  font-size: 1.875rem !important;
                  font-weight: 800 !important;
                  margin-top: 1.5rem !important;
                  margin-bottom: 0.75rem !important;
                  color: #111827 !important;
                  line-height: 1.2 !important;
                }
                .rich-text-content :global(h2) {
                  font-size: 1.5rem !important;
                  font-weight: 700 !important;
                  margin-top: 1.25rem !important;
                  margin-bottom: 0.6rem !important;
                  color: #111827 !important;
                  line-height: 1.3 !important;
                }
                .rich-text-content :global(h3) {
                  font-size: 1.25rem !important;
                  font-weight: 700 !important;
                  margin-top: 1rem !important;
                  margin-bottom: 0.5rem !important;
                  color: #111827 !important;
                }
                .rich-text-content :global(p) {
                  margin-bottom: 0.75rem !important;
                  line-height: 1.7 !important;
                }
                .rich-text-content :global(.ql-indent-1) { padding-left: 3em !important; }
                .rich-text-content :global(.ql-indent-2) { padding-left: 6em !important; }
                .rich-text-content :global(.ql-indent-3) { padding-left: 9em !important; }
                .rich-text-content :global(strong) {
                  font-weight: 700 !important;
                  color: #111827 !important;
                }
             `}</style>
          </div>
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
