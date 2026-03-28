'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, CheckCircle, XCircle, 
  Trash2, Filter, 
  ChevronLeft, ChevronRight,
  AlertCircle,  ShieldCheck,
  ShoppingBag, Leaf, Smile, ClipboardCheck, Bell, Newspaper, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { getAllBlogsForAdmin, updateBlogStatus, deleteBlog } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import Breadcrumb from '@/components/shared/Breadcrumb';
import AdminBlogActionMenu from './AdminBlogActionMenu';
import AdminBlogDetailModal from './AdminBlogDetailModal';

const BLOG_CATEGORIES = [
  { name: "Mẹo mua bán", slug: "meo-mua-ban", icon: ShoppingBag, color: "#FFBA00" },
  { name: "Sống xanh", slug: "song-xanh", icon: Leaf, color: "#8cceae" },
  { name: "Góc đời thường", slug: "goc-doi-thuong", icon: Smile, color: "#92d4da" },
  { name: "Review đồ", slug: "review-do", icon: ClipboardCheck, color: "#ea8c98" },
  { name: "Thông báo mới", slug: "thong-bao-moi", icon: Bell, color: "#c1a5e1" },
];

const AdminBlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [status, setStatus] = useState<string>('pending');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchBlogs = useCallback(async (page: number, currentStatus: string) => {
    setIsLoading(true);
    try {
      const data = await getAllBlogsForAdmin(currentStatus || undefined, page, 10);
      setBlogs(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Không thể tải danh sách bài viết');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage, status);
  }, [currentPage, status, fetchBlogs]);

  const handleApprove = async (id: string, title: string) => {
    try {
      await updateBlogStatus(id, 'approved');
      toast.success(`Đã duyệt bài viết: ${title}`);
      fetchBlogs(currentPage, status);
    } catch (error) {
      toast.error('Duyệt bài viết thất bại');
    }
  };

  const handleReject = async (id: string, title: string) => {
    const reason = window.prompt("Nhập lý do từ chối bài viết:");
    if (reason === null) return; // user cancelled

    try {
      await updateBlogStatus(id, 'rejected', reason || "Nội dung chưa phù hợp");
      toast.success(`Đã từ chối bài viết: ${title}`);
      fetchBlogs(currentPage, status);
    } catch (error) {
      toast.error('Từ chối bài viết thất bại');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;

    try {
      await deleteBlog(id);
      toast.success(`Đã xóa bài viết: ${title}`);
      fetchBlogs(currentPage, status);
    } catch (error) {
      toast.error('Xóa bài viết thất bại');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 font-inter">Đã duyệt</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 font-inter">Chờ duyệt</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 font-inter">Từ chối</span>;
      case 'hidden':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 font-inter">Đang ẩn</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 font-inter">{status}</span>;
    }
  };

  const getCategoryIcon = (categorySlug: string) => {
    const category = BLOG_CATEGORIES.find(c => c.slug === categorySlug);
    if (!category) return <Newspaper size={16} />;
    const Icon = category.icon;
    return <Icon size={16} style={{ color: category.color }} />;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen font-inter">
      <Breadcrumb 
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Quản lý Blog', href: '/admin/blog' },
        ]} 
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={28} />
            Quản lý Blog
          </h1>
          <p className="text-sm text-gray-500 mt-1">Duyệt và kiểm soát các bài chia sẻ từ sinh viên</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-emerald-700 flex items-center gap-2">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{totalElements} bài viết</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible shadow-sm">
        {/* Filters */}
        <div className="p-4 border-b border-gray-50 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide py-2">
               {['pending', 'approved', 'rejected', ''].map((s) => (
                 <button
                    key={s}
                    onClick={() => {
                        setStatus(s);
                        setCurrentPage(0);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                        status === s 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                 >
                    {s === 'pending' ? 'Bản thảo chờ duyệt' : 
                     s === 'approved' ? 'Đã xuất bản' : 
                     s === 'rejected' ? 'Đã từ chối' : 'Tất cả'}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-visible min-h-[350px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Bài viết</th>
                <th className="px-6 py-4">Tác giả</th>
                <th className="px-6 py-4">Chuyên mục</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-lg w-full" /></td>
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Không tìm thấy bài viết nào</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.blogId || blog.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                          <Image 
                            src={blog.thumbnail || '/template.png'} 
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[300px]" title={blog.title}>
                             {blog.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(blog.createdAt || '').toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {blog.author.avatar ? (
                           <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-gray-100">
                             <Image src={blog.author.avatar} alt={blog.author.fullName || ''} fill className="object-cover" />
                           </div>
                        ) : (
                           <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                             {blog.author.fullName?.charAt(0) || 'U'}
                           </div>
                        )}
                        <span className="text-sm text-gray-700 font-medium">{blog.author.fullName || blog.author.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getCategoryIcon(blog.category)}
                        <span>{BLOG_CATEGORIES.find(c => c.slug === blog.category)?.name || blog.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(blog.status || 'pending')}
                        {blog.status === 'rejected' && blog.rejectionReason && (
                          <p className="text-[10px] text-rose-500 max-w-[150px] italic">Lý do: {blog.rejectionReason}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right overflow-visible relative">
                      <div className="flex items-center justify-end">
                        <AdminBlogActionMenu
                           blog={blog}
                           isOpen={openMenuId === (blog.blogId || blog.id)}
                           onToggle={() => setOpenMenuId(openMenuId === (blog.blogId || blog.id) ? null : (blog.blogId || blog.id) || null)}
                           onClose={() => setOpenMenuId(null)}
                           onApprove={handleApprove}
                           onReject={handleReject}
                           onDelete={handleDelete}
                           onViewDetail={() => {
                              setSelectedBlog(blog);
                              setIsDetailOpen(true);
                           }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between rounded-b-2xl">
            <p className="text-xs text-gray-500">Trang {currentPage + 1} / {totalPages}</p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AdminBlogDetailModal
        blog={selectedBlog}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedBlog(null);
        }}
        onApprove={(id, title) => {
          handleApprove(id, title);
          setIsDetailOpen(false);
        }}
        onReject={(id, title) => {
          handleReject(id, title);
          setIsDetailOpen(false);
        }}
      />
    </div>
  );
};

export default AdminBlogManagement;
