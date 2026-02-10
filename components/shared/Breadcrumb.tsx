"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      {/* Home */}
      <Link
        href="/"
        className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors"
      >
        <Home size={16} />
        <span>Trang chủ</span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-gray-400" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
