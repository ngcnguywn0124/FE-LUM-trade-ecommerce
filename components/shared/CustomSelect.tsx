"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  id: string | number;
  name: string;
  label?: string; // Tùy chọn để hiển thị khác với name
}

interface CustomSelectProps {
  id?: string;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: string | boolean;
  disabledPlaceholder?: string;
  error?: string;
  className?: string;
  maxHeight?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Chọn một tùy chọn",
  disabled = false,
  disabledPlaceholder,
  error,
  className = "",
  maxHeight = "max-h-60",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.id) === String(value));

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (optionId: string | number) => {
    onChange(String(optionId));
    setIsOpen(false);
  };

  const displayPlaceholder = disabled && disabledPlaceholder ? disabledPlaceholder : placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        id={id}
        type="button"
        disabled={!!disabled}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer ${
          error ? "border-red-500" : "border-gray-200"
        } ${disabled ? "bg-gray-50 opacity-100 cursor-not-allowed" : "hover:border-gray-300"}`}
      >
        <span className={`${selectedOption ? "text-gray-900" : "text-gray-400"} truncate`}>
          {selectedOption ? (selectedOption.label || selectedOption.name) : displayPlaceholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          } ${disabled ? "opacity-40" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-1.5 border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          <div className={`${maxHeight} overflow-y-auto py-1`}>
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-emerald-50 ${
                    String(value) === String(option.id)
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {option.label || option.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400 italic">Không có dữ liệu</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
