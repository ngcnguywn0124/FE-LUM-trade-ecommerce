import { Search, X } from 'lucide-react';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({
  placeholder,
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Xóa từ khóa"
        >
          <X size={15} />
        </button>
      ) : null}
    </div>
  );
}
