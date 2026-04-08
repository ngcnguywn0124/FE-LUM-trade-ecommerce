'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight,
  AlertCircle,  ShieldCheck,
  Newspaper
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { getAllBlogsForAdmin, deleteBlog } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import Breadcrumb from '@/components/shared/Breadcrumb';
import AdminBlogActionMenu from './AdminBlogActionMenu';
import AdminBlogDetailModal from './AdminBlogDetailModal';

const AdminBlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchBlogs = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getAllBlogsForAdmin(undefined, page, 10);
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
    fetchBlogs(currentPage);
  }, [currentPage, fetchBlogs]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;

    try {
      await deleteBlog(id);
      toast.success(`Đã xóa bài viết: ${title}`);
      fetchBlogs(currentPage);
    } catch (error) {
      toast.error('Xóa bài viết thất bại');
    }
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
            <a
              href="/admin/blog/categories"
              className="bg-white border border-emerald-200 px-4 py-2 rounded-xl text-emerald-700 flex items-center gap-2 hover:bg-emerald-50 transition shadow-sm"
            >
              <Newspaper size={18} />
              <span className="text-sm font-medium">Danh mục blog</span>
            </a>
            <a 
               href="/admin/blog/create" 
               className="bg-emerald-600 border border-emerald-600 px-4 py-2 rounded-xl text-white flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm"
            >
               <Newspaper size={18} />
               <span className="text-sm font-medium">Tạo bài viết</span>
            </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-visible shadow-sm">
        {/* Table */}
        <div className="overflow-visible min-h-[350px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Bài viết</th>
                <th className="px-6 py-4">Tác giả</th>
                <th className="px-6 py-4">Chuyên mục</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-lg w-full" /></td>
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Không tìm thấy bài viết nào</td>
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
                        {blog.author?.avatar ? (
                           <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-gray-100">
                             <Image src={blog.author?.avatar || '/user/avatar-user-profile-default.png'} alt={blog.author?.fullName || ''} fill className="object-cover" />
                           </div>
                        ) : (
                           <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                             {blog.author?.fullName?.charAt(0) || 'A'}
                           </div>
                        )}
                        <span className="text-sm text-gray-700 font-medium">{blog.author?.fullName || blog.author?.name || 'Admin'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Newspaper size={16} />
                        <span>{blog.blogCategory?.name || 'Chưa phân loại'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right overflow-visible relative">
                      <div className="flex items-center justify-end">
                        <AdminBlogActionMenu
                           blog={blog}
                           isOpen={openMenuId === (blog.blogId || blog.id)}
                           onToggle={() => setOpenMenuId(openMenuId === (blog.blogId || blog.id) ? null : (blog.blogId || blog.id) || null)}
                           onClose={() => setOpenMenuId(null)}
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
      />
    </div>
  );
};

export default AdminBlogManagement;
