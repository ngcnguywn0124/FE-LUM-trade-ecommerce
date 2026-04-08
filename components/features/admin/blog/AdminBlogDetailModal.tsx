'use client';

import React from 'react';
import { 
  X, Calendar, Eye, AlertCircle, Newspaper
} from 'lucide-react';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminBlogDetailModalProps {
  blog: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminBlogDetailModal: React.FC<AdminBlogDetailModalProps> = ({
  blog,
  isOpen,
  onClose,
}) => {
  if (!blog) return null;

  const categoryName = blog.blogCategory?.name || 'Chưa phân loại';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col font-inter"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: '#CBD5E1' }}
                >
                  <Newspaper size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                    {blog.title}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {categoryName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-gray-100">
                    <Image
                      src={blog.thumbnail || '/template.png'}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="p-5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl overflow-hidden">
                    <p className="text-emerald-900 font-semibold italic text-lg leading-relaxed break-words break-all">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Full Content */}
                  <div className="prose prose-emerald max-w-none">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                       <AlertCircle size={18} className="text-emerald-500" />
                       Nội dung chi tiết
                    </h3>
                    <div 
                      className="text-gray-700 leading-relaxed font-medium text-base break-words overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:shadow-md [&_p]:mb-4"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </div>
                </div>

                {/* Info Sidebar (Right Column) */}
                <div className="space-y-6">
                  {/* Author Card */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Người viết</h4>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                        <Image
                          src={blog.author?.avatar || '/user/avatar-user-profile-default.png'}
                          alt={blog.author?.fullName || ''}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{blog.author?.fullName || blog.author?.name || 'Admin'}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Sinh viên hệ thống</p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Thông tin bài viết</h4>
                    
                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                       <div className="flex items-center gap-2 text-gray-500">
                         <Calendar size={14} />
                         <span>Ngày tạo</span>
                       </div>
                       <span className="font-bold text-gray-900">
                         {new Date(blog.createdAt || '').toLocaleDateString('vi-VN')}
                       </span>
                    </div>

                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                       <div className="flex items-center gap-2 text-gray-500">
                         <Eye size={14} />
                         <span>Lượt xem</span>
                       </div>
                       <span className="font-bold text-gray-900">{blog.viewCount || 0}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Disclaimer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400 flex items-center gap-2 italic">
                <ShieldCheck size={14} />
                Hệ thống kiểm soát nội dung cộng đồng sinh viên Lụm.vn
              </p>
              <a 
                href={`/blog/${blog.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Xem thực tế trên web &rarr;
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminBlogDetailModal;

const ShieldCheck = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);
