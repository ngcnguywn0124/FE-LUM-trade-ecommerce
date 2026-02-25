'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle, Search, SlidersHorizontal, X, ChevronDown, LayoutGrid, List,
} from 'lucide-react';

import Breadcrumb from '@/components/shared/Breadcrumb';
import PostStatsBar from './PostStatsBar';
import PostStatusTabs from './PostStatusTabs';
import PostManageCard from './PostManageCard';
import BulkActionBar from './BulkActionBar';
import DeleteConfirmModal from './DeleteConfirmModal';
import EmptyPostState from './EmptyPostState';

import { ManagedPost, ManagePostsFilters, PostSortOption, PostStatus } from '@/types/manage-posts';
import { generateMockManagedPosts, computeAggregate } from '@/lib/mockManagePosts';

// ─── Mock data (replace with API call) ────────────────────────────────────────
const INITIAL_POSTS: ManagedPost[] = generateMockManagedPosts(15);

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS: { value: PostSortOption; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'most-views', label: 'Nhiều lượt xem' },
  { value: 'most-favorites', label: 'Nhiều yêu thích' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const ManagePostsPage: React.FC = () => {
  const router = useRouter();

  // ── Data State ──────────────────────────────────────────────────────────────
  const [posts, setPosts] = useState<ManagedPost[]>(INITIAL_POSTS);

  // ── Filter State ────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<ManagePostsFilters>({
    status: 'all',
    sortBy: 'newest',
    search: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // ── Selection State ─────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // ── Menu State ──────────────────────────────────────────────────────────────
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // ── Modal State ─────────────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    ids: number[];
  }>({ isOpen: false, ids: [] });

  // ── Toast notification (simple) ─────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const aggregate = useMemo(() => computeAggregate(posts), [posts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter((p) => p.status === filters.status);
    }

    // Filter by search
    const q = filters.search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most-views':
        result.sort((a, b) => b.stats.views - a.stats.views);
        break;
      case 'most-favorites':
        result.sort((a, b) => b.stats.favorites - a.stats.favorites);
        break;
    }

    return result;
  }, [posts, filters]);

  const isAllSelected =
    filteredPosts.length > 0 &&
    filteredPosts.every((p) => selectedIds.has(p.id));

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setFilters((prev) => ({ ...prev, search: searchInput }));
    },
    [searchInput]
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, search: '' }));
  }, []);

  const handleSelectPost = useCallback((id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(filteredPosts.map((p) => p.id)));
  }, [filteredPosts]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleToggleMenu = useCallback((id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const handleCloseMenu = useCallback(() => setOpenMenuId(null), []);

  const handleEdit = useCallback((id: number) => {
    router.push(`/chinh-sua-tin/${id}`);
  }, [router]);

  const handleView = useCallback((id: number) => {
    router.push(`/bai-dang/${id}`);
  }, [router]);

  const handleToggleVisibility = useCallback((id: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = p.status === 'active' ? 'hidden' : 'active';
        return { ...p, status: next as PostStatus };
      })
    );
    const post = posts.find((p) => p.id === id);
    const nextLabel = post?.status === 'active' ? 'Đã ẩn tin' : 'Đã hiện tin';
    showToast(nextLabel);
  }, [posts]);

  const handleRenew = useCallback((id: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);
        return {
          ...p,
          status: 'active' as PostStatus,
          expiresAt: newExpiry.toISOString(),
          renewedCount: p.renewedCount + 1,
        };
      })
    );
    showToast('Gia hạn tin thành công! Tin sẽ hiển thị thêm 30 ngày.');
  }, []);

  const handleDeleteRequest = useCallback((id: number) => {
    setDeleteModal({ isOpen: true, ids: [id] });
  }, []);

  const handleBulkDeleteRequest = useCallback(() => {
    setDeleteModal({ isOpen: true, ids: Array.from(selectedIds) });
  }, [selectedIds]);

  const handleConfirmDelete = useCallback(() => {
    const idsToDelete = new Set(deleteModal.ids);
    setPosts((prev) => prev.filter((p) => !idsToDelete.has(p.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      idsToDelete.forEach((id) => next.delete(id));
      return next;
    });
    setDeleteModal({ isOpen: false, ids: [] });
    showToast(`Đã xóa ${deleteModal.ids.length} tin đăng.`);
  }, [deleteModal.ids]);

  const handleBulkHide = useCallback(() => {
    setPosts((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id) && p.status === 'active' ? { ...p, status: 'hidden' as PostStatus } : p
      )
    );
    showToast(`Đã ẩn ${selectedIds.size} tin đăng.`);
    handleDeselectAll();
  }, [selectedIds, handleDeselectAll]);

  const handleBulkRenew = useCallback(() => {
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 30);
    setPosts((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id)
          ? { ...p, status: 'active' as PostStatus, expiresAt: newExpiry.toISOString(), renewedCount: p.renewedCount + 1 }
          : p
      )
    );
    showToast(`Đã gia hạn ${selectedIds.size} tin đăng.`);
    handleDeselectAll();
  }, [selectedIds, handleDeselectAll]);

  const deleteSinglePost = posts.find((p) => deleteModal.ids.length === 1 && p.id === deleteModal.ids[0]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label ?? 'Sắp xếp';

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`
            fixed top-5 right-5 z-1000 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold
            animate-in slide-in-from-right-4 duration-300
            ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}
          `}
        >
          {toast.msg}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: 'Quản lý tin đăng' }]}
          />
          </div>
      {/* ── Page Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-5 pb-28">

        {/* Stats Bar */}
        <PostStatsBar aggregate={aggregate} />

        {/* Status Tabs */}
        <PostStatusTabs
          active={filters.status}
          onChange={(status) => {
            setFilters((prev) => ({ ...prev, status }));
            setSelectedIds(new Set());
          }}
          aggregate={aggregate}
        />

        {/* Search + Sort + View Mode Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-45 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 h-10 focus-within:border-emerald-400 focus-within:shadow-emerald-100 transition-all">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
            />
            {searchInput && (
              <button type="button" onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1">
                <X size={14} />
              </button>
            )}
          </form>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen((v) => !v)}
              className="flex items-center justify-between gap-2 h-10 w-48 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-2 min-w-0">
                <SlidersHorizontal size={14} className="text-gray-400 shrink-0" />
                <span className="truncate">{currentSortLabel}</span>
              </div>
              <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-lg z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, sortBy: opt.value }));
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                      filters.sortBy === opt.value
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden h-10">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 h-full cursor-pointer transition-colors border-r border-gray-100 last:border-0 ${viewMode === 'list' ? 'bg-gray-50 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
              title="Xem danh sách"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 h-full cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-gray-50 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
              title="Xem lưới"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Active search filter chip */}
        {filters.search && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Kết quả cho:</span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              &ldquo;{filters.search}&rdquo;
              <button onClick={handleClearSearch} className="hover:text-emerald-900 cursor-pointer">
                <X size={12} />
              </button>
            </span>
            <span className="text-xs text-gray-400">{filteredPosts.length} kết quả</span>
          </div>
        )}

        {/* ── Post List or Grid ── */}
        {filteredPosts.length === 0 ? (
          <EmptyPostState activeFilter={filters.status} />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {filteredPosts.map((post) => (
              <PostManageCard
                key={post.id}
                post={post}
                isSelected={selectedIds.has(post.id)}
                onSelect={handleSelectPost}
                openMenuId={openMenuId}
                onToggleMenu={handleToggleMenu}
                onCloseMenu={handleCloseMenu}
                onEdit={handleEdit}
                onToggleVisibility={handleToggleVisibility}
                onRenew={handleRenew}
                onDeleteRequest={handleDeleteRequest}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Floating Bulk Action Bar ── */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        totalCount={filteredPosts.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkHide={handleBulkHide}
        onBulkRenew={handleBulkRenew}
        onBulkDelete={handleBulkDeleteRequest}
        isAllSelected={isAllSelected}
      />

      {/* ── Delete Confirmation Modal ── */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        count={deleteModal.ids.length}
        postTitle={deleteSinglePost?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, ids: [] })}
      />
    </div>
  );
};

export default ManagePostsPage;
