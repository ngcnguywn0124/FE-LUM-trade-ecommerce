"use client";

import { useState } from "react";

interface ProductDetailTabsProps {
  description: string;
  specs: Array<{ label: string; value: string }>;
}

const ProductDetailTabs = ({ description, specs }: ProductDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab("description")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "description"
              ? "bg-emerald-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Mô tả chi tiết
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "specs" ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Thông tin chi tiết
        </button>
      </div>

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
    </section>
  );
};

export default ProductDetailTabs;
