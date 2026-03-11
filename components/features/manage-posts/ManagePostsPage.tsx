'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, SlidersHorizontal, X, ChevronDown, LayoutGrid, List,
} from 'lucide-react';
import { toast } from 'sonner';

import Breadcrumb from '@/components/shared/Breadcrumb';
import PostStatsBar from './PostStatsBar';
import PostStatusTabs from './PostStatusTabs';
import PostManageCard from './PostManageCard';
import BulkActionBar from './BulkActionBar';
import DeleteConfirmModal from './DeleteConfirmModal';
import EmptyPostState from './EmptyPostState';
import Pagination from '@/components/shared/Pagination';

import { ManagedPost, ManagePostsFilters, PostSortOption } from '@/types/manage-posts';
import {
  computeAggregate,
  deleteProductById,
  getMyProducts,
  mapSummaryToManagedPost,
  markAsSold,
  renewProduct,
  toggleHidden,
} from '@/services/productService';
import { useWebSocket } from '@/hooks/useWebSocket';

const POSTS_PER_PAGE = 15;

const SORT_OPTIONS: { value: PostSortOption; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'most-views', label: 'Nhiều lượt xem' },
  { value: 'most-favorites', label: 'Nhiều yêu thích' },
];

const mapUiStatusToApiStatus = (status: ManagePostsFilters['status']) => {
  if (status === 'all') return undefined;
  if (status === 'active') return 'available';
  return status;
};

const ManagePostsPage: React.FC = () => {
  const router = useRouter();

  const [posts, setPosts] = useState<ManagedPost[]>([]);
  const [allPosts, setAllPosts] = useState<ManagedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<ManagePostsFilters>({
    status: 'all',
    sortBy: 'newest',
    search: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  React.useEffect(() => {
    if (window.innerWidth < 640) {
      setViewMode('list');
    }
  }, []);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    ids: string[];
  }>({ isOpen: false, ids: [] });

  const reloadMyPosts = useCallback(async (status: ManagePostsFilters['status']) => {
    setIsLoading(true);
    try {
      // Tải tất cả tin để tính toán aggregate chính xác
      const allPage = await getMyProducts(undefined, 0, 500);
      const mappedAll = allPage.content.map(mapSummaryToManagedPost);
      setAllPosts(mappedAll);

      // Nếu tab hiện tại là 'all', dùng luôn mappedAll, nếu không thì lọc hoặc fetch theo status
      if (status === 'all') {
        setPosts(mappedAll);
      } else {
        const filtered = mappedAll.filter(p => p.status === status);
        setPosts(filtered);
      }
    } catch {
      setPosts([]);
      setAllPosts([]);
      toast.error('Không tải được danh sách tin đăng');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadMyPosts(filters.status);
  }, [filters.status, reloadMyPosts]);

  const aggregate = useMemo(() => computeAggregate(allPosts), [allPosts]);

  const filteredPosts = useMemo(() => {
    const result = [...posts];

    const q = filters.search.toLowerCase().trim();
    const searched = q
      ? result.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.subcategory.toLowerCase().includes(q),
        )
      : result;

    switch (filters.sortBy) {
      case 'newest':
        searched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        searched.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most-views':
        searched.sort((a, b) => b.stats.views - a.stats.views);
        break;
      case 'most-favorites':
        searched.sort((a, b) => b.stats.favorites - a.stats.favorites);
        break;
    }

    return searched;
  }, [posts, filters]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const isAllSelected =
    paginatedPosts.length > 0 && paginatedPosts.every((p) => selectedIds.has(p.id));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, search: '' }));
    setCurrentPage(1);
  }, []);

  // Debounce search: Tự động tìm kiếm sau khi người dùng ngừng nhập 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSelectPost = useCallback((id: string, checked: boolean) => {
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

  const handleToggleMenu = useCallback((id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const handleCloseMenu = useCallback(() => setOpenMenuId(null), []);

  const handleEdit = useCallback((id: string) => {
    router.push(`/chinh-sua-tin/${id}`);
  }, [router]);

  const handleView = useCallback((id: string) => {
    router.push(`/bai-dang/${id}`);
  }, [router]);

  const handleToggleVisibility = useCallback(async (id: string) => {
    try {
      await toggleHidden(id);
      const updateFn = (p: ManagedPost) => {
        if (p.id !== id) return p;
        return { ...p, status: p.status === 'active' ? 'hidden' : 'active' } as ManagedPost;
      };
      setPosts((prev) => prev.map(updateFn));
      setAllPosts((prev) => prev.map(updateFn));
      toast.success('Đã thay đổi hiển thị tin đăng');
    } catch {
      toast.error('Không thể thay đổi hiển thị tin đăng');
    }
  }, []);

  const handleMarkSold = useCallback(async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post || post.status !== 'active') {
      toast.error('Chỉ có thể đánh dấu đã bán cho tin đang trong trạng thái hiển thị');
      return;
    }

    try {
      await markAsSold(id);
      const updateFn = (p: ManagedPost) => (p.id === id ? { ...p, status: 'sold' } as ManagedPost : p);
      setPosts((prev) => prev.map(updateFn));
      setAllPosts((prev) => prev.map(updateFn));
      toast.success('Đã đánh dấu đã bán');
    } catch {
      toast.error('Không thể đánh dấu đã bán');
    }
  }, [posts]);

  const handleRenew = useCallback(async (id: string) => {
    try {
      const updated = await renewProduct(id, 7);
      const updatedPost = mapSummaryToManagedPost(updated as any);
      const updateFn = (p: ManagedPost) => (p.id === id ? updatedPost : p);
      setPosts((prev) => prev.map(updateFn));
      setAllPosts((prev) => prev.map(updateFn));
      toast.success('Gia hạn tin đăng thành công 7 ngày');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể gia hạn tin đăng';
      toast.error(msg);
    }
  }, []);

  // Lắng nghe tín hiệu Realtime qua WebSocket
  useWebSocket(useCallback((message: string) => {
    if (message.startsWith('PRODUCT_EXPIRED:')) {
      const productId = message.split(':')[1];
      const updateFn = (p: ManagedPost) => (p.id === productId ? { ...p, status: 'expired' } as ManagedPost : p);
      setPosts((prev) => prev.map(updateFn));
      setAllPosts((prev) => prev.map(updateFn));
      toast.warning('Một tin đăng của bạn vừa hết hạn!', {
        description: 'Hãy gia hạn để tiếp tục hiển thị tin.'
      });
    }
  }, []));

  const handleDeleteRequest = useCallback((id: string) => {
    setDeleteModal({ isOpen: true, ids: [id] });
  }, []);

  const handleBulkDeleteRequest = useCallback(() => {
    setDeleteModal({ isOpen: true, ids: Array.from(selectedIds) });
  }, [selectedIds]);

  const handleConfirmDelete = useCallback(async () => {
    const ids = [...deleteModal.ids];

    try {
      await Promise.all(ids.map((id) => deleteProductById(id)));
      setPosts((prev) => prev.filter((p) => !ids.includes(p.id)));
      setAllPosts((prev) => prev.filter((p) => !ids.includes(p.id)));
      setSelectedIds(new Set());
      toast.success(`Đã xóa ${ids.length} tin đăng.`);
    } catch {
      toast.error('Xóa tin đăng thất bại');
    } finally {
      setDeleteModal({ isOpen: false, ids: [] });
    }
  }, [deleteModal.ids]);

  const handleBulkHide = useCallback(async () => {
    const ids = [...selectedIds];
    const postsToHide = posts.filter(p => selectedIds.has(p.id));
    
    // Kiểm tra xem có bài nào đang chờ duyệt không
    const hasPending = postsToHide.some(p => p.status === 'pending');
    if (hasPending) {
      toast.error('Không thể ẩn/hiện tin đang trong trạng thái chờ duyệt');
      return;
    }

    try {
      await Promise.all(ids.map((id) => toggleHidden(id)));
      const updateFn = (p: ManagedPost) => {
        if (!selectedIds.has(p.id)) return p;
        return { ...p, status: p.status === 'active' ? 'hidden' : 'active' } as ManagedPost;
      };
      setPosts((prev) => prev.map(updateFn));
      setAllPosts((prev) => prev.map(updateFn));
      toast.success(`Đã cập nhật hiển thị ${selectedIds.size} tin đăng.`);
      handleDeselectAll();
    } catch {
      toast.error('Không thể cập nhật hiển thị hàng loạt');
    }
  }, [selectedIds, handleDeselectAll, posts]);

  const handleBulkSold = useCallback(async () => {
    const ids = [...selectedIds];
    const postsToSold = posts.filter((p) => selectedIds.has(p.id));

    // Phải hiển thị tin thì mới cho cập nhật đã bán
    const hasNonActive = postsToSold.some((p) => p.status !== 'active');
    if (hasNonActive) {
      toast.error('Chỉ có thể đánh dấu đã bán cho các tin đang trong trạng thái hiển thị');
      return;
    }

    try {
      await Promise.all(ids.map((id) => markAsSold(id)));
      const updateFn = (p: ManagedPost) => (selectedIds.has(p.id) ? { ...p, status: 'sold' } as ManagedPost : p);
      setPosts((prev) => prev.map(updateFn));
      setAllPosts((prev) => prev.map(updateFn));
      toast.success(`Đã đánh dấu bán ${selectedIds.size} tin đăng.`);
      handleDeselectAll();
    } catch {
      toast.error('Không thể đánh dấu bán hàng loạt');
    }
  }, [selectedIds, handleDeselectAll, posts]);

  const deleteSinglePost = posts.find(
    (p) => deleteModal.ids.length === 1 && p.id === deleteModal.ids[0],
  );

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label ?? 'Sắp xếp';

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Quản lý tin đăng' }]} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-5 pb-28">
        <PostStatsBar aggregate={aggregate} />

        <PostStatusTabs
          active={filters.status}
          onChange={(status) => {
            setFilters((prev) => ({ ...prev, status }));
            setSelectedIds(new Set());
            setCurrentPage(1);
          }}
          aggregate={aggregate}
        />

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex-1 min-w-45 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 h-10 focus-within:border-emerald-400 focus-within:shadow-emerald-100 transition-all"
          >
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSortOpen((v) => !v)}
              className="flex items-center justify-between gap-2 h-10 w-48 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-2 min-w-0">
                <SlidersHorizontal size={14} className="text-gray-400 shrink-0" />
                <span className="truncate">{currentSortLabel}</span>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 shrink-0 transition-transform ${
                  isSortOpen ? 'rotate-180' : ''
                }`}
              />
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

          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden h-10">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 h-full cursor-pointer transition-colors border-r border-gray-100 last:border-0 ${
                viewMode === 'list'
                  ? 'bg-gray-50 text-gray-800'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Xem danh sách"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 h-full cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-50 text-gray-800'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Xem lưới"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

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

        {isLoading ? (
          <div className="h-60 rounded-xl bg-white border border-gray-200 animate-pulse" />
        ) : filteredPosts.length === 0 ? (
          <EmptyPostState activeFilter={filters.status} />
        ) : (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'
                  : 'flex flex-col gap-3'
              }
            >
              {paginatedPosts.map((post) => (
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
                  onMarkAsSold={handleMarkSold}
                  onDeleteRequest={handleDeleteRequest}
                  onView={handleView}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <BulkActionBar
        selectedCount={selectedIds.size}
        totalCount={filteredPosts.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkHide={handleBulkHide}
        onBulkSold={handleBulkSold}
        onBulkDelete={handleBulkDeleteRequest}
        isAllSelected={isAllSelected}
      />

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
