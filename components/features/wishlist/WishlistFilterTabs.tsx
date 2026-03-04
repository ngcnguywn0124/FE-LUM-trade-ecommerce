type WishlistFilter = "all" | "active" | "sold";

interface WishlistFilterTabsProps {
  activeFilter: WishlistFilter;
  onChange: (filter: WishlistFilter) => void;
  totalCount: number;
  activeCount: number;
  soldCount: number;
}

const tabConfig: Array<{ id: WishlistFilter; label: string }> = [
  { id: "all", label: "Tất cả tin" },
  { id: "active", label: "Đang rao" },
  { id: "sold", label: "Đã bán" },
];

export default function WishlistFilterTabs({
  activeFilter,
  onChange,
  totalCount,
  activeCount,
  soldCount,
}: WishlistFilterTabsProps) {
  const getCount = (id: WishlistFilter) => {
    if (id === "all") return totalCount;
    if (id === "active") return activeCount;
    return soldCount;
  };

  return (
    <div className="flex items-center gap-8 border-b border-gray-100 mb-8 pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {tabConfig.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative pb-3 text-lg font-bold transition-all cursor-pointer ${
            activeFilter === tab.id
              ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab.label}
          <span className="ml-2 text-sm font-semibold text-gray-400">{getCount(tab.id)}</span>
        </button>
      ))}
    </div>
  );
}
