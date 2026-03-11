'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, CheckCircle, XCircle, Eye, 
  Trash2, Filter, MoreVertical, 
  ChevronLeft, ChevronRight, Star,
  AlertCircle, ExternalLink, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { 
  getAllProductsForAdmin, 
  approveProduct, 
  hideProductByAdmin,
  toggleFeatured,
  deleteProductById
} from '@/services/productService';
import type { ProductSummaryDto } from '@/types/product-api';
import Breadcrumb from '@/components/shared/Breadcrumb';
import AdminPostActionMenu from './AdminPostActionMenu';

const AdminProductManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductSummaryDto[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>(''); // empty means all for admin
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Dropdown Menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ`;
    }
    if (price >= 1000000) {
      return `${(price / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} triệu`;
    }
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  const fetchProducts = useCallback(async (page: number, currentStatus: string, currentKeyword: string) => {
    setIsLoading(true);
    try {
      const data = await getAllProductsForAdmin(
        currentStatus || undefined,
        currentKeyword || undefined,
        page,
        20
      );
      setProducts(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Không thể tải danh sách tin đăng');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search logic like user management page
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchTerm);
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts(currentPage, status, keyword);
  }, [currentPage, status, keyword, fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchTerm);
    setCurrentPage(0);
  };

  const handleApprove = async (id: string, title: string) => {
    try {
      await approveProduct(id);
      toast.success(`Đã duyệt tin: ${title}`);
      fetchProducts(currentPage, status, keyword);
    } catch (error) {
      toast.error('Duyệt tin thất bại');
    }
  };

  const handleHide = async (id: string, title: string) => {
    try {
      await hideProductByAdmin(id);
      toast.success(`Đã ẩn tin: ${title}`);
      fetchProducts(currentPage, status, keyword);
    } catch (error) {
      toast.error('Ẩn tin thất bại');
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await toggleFeatured(id);
      toast.success(current ? 'Đã gỡ trạng thái nổi bật' : 'Đã đặt làm tin nổi bật');
      fetchProducts(currentPage, status, keyword);
    } catch (error) {
      toast.error('Cập nhật trạng thái nổi bật thất bại');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tin "${title}"?`)) return;
    try {
      await deleteProductById(id);
      toast.success('Đã xóa tin đăng');
      fetchProducts(currentPage, status, keyword);
    } catch (error) {
      toast.error('Xóa tin thất bại');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Đang bán</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Chờ duyệt</span>;
      case 'hidden':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Đang ẩn</span>;
      case 'sold':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Đã bán</span>;
      case 'expired':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Hết hạn</span>;
      case 'admin_hidden':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Vi phạm</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={28} />
            Quản lý tin đăng
          </h1>
          <p className="text-sm text-gray-500 mt-1">Duyệt, ẩn và quản lý tất cả bài đăng trên hệ thống</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-emerald-700 flex items-center gap-2">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{totalElements} tổng số tin</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible">
        {/* Filters */}
        <div className="p-4 border-b border-gray-50 flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm theo tiêu đề, người bán..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-emerald-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              className="bg-gray-50 border-none rounded-xl text-sm text-gray-700 py-2.5 px-4 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="available">Đang hiển thị</option>
              <option value="hidden">Admin ẩn</option>
              <option value="sold">Đã bán</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Người bán / Trường</th>
                <th className="px-6 py-4">Giá / Ngày đăng</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-12 bg-gray-100 rounded-lg w-full" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Không tìm thấy tin đăng nào</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.productId} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <Image 
                            src={product.thumbnailUrl || '/template.png'} 
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                             <p className="font-semibold text-gray-900 truncate max-w-[200px]" title={product.title}>
                                {product.title}
                             </p>
                             {product.isFeatured && (
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                             )}
                          </div>
                          <p className="text-xs text-gray-500 uppercase font-medium">{product.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">{product.sellerName}</p>
                        <p className="text-xs text-gray-400">{product.universityShortName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-emerald-600">
                        {product.isFree ? 'Miễn phí' : formatPrice(product.price ?? 0)}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <AdminPostActionMenu
                           product={product}
                           isOpen={openMenuId === product.productId}
                           onToggle={() => setOpenMenuId(openMenuId === product.productId ? null : product.productId)}
                           onClose={() => setOpenMenuId(null)}
                           onApprove={handleApprove}
                           onHide={handleHide}
                           onToggleFeatured={handleToggleFeatured}
                           onDelete={handleDelete}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-500">Trang {currentPage + 1} / {totalPages}</p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductManagement;
