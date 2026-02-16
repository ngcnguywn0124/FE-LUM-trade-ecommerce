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
        <div className="space-y-2">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-start justify-between gap-4 rounded-lg bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-gray-600">{spec.label}</span>
              <span className="text-sm font-semibold text-gray-800 text-right">{spec.value}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductDetailTabs;
