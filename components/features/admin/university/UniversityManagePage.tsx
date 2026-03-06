'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Building2, Plus, Search, X, RefreshCw, Loader2, School } from 'lucide-react';
import * as universityService from '@/services/universityService';
import type { UniversityResponse, CampusResponse } from '@/types/admin';
import { useAuthStore } from '@/stores/authStore';

// Components
import UniversityModal from './components/UniversityModal';
import CampusModal from './components/CampusModal';
import ConfirmDelete from './components/ConfirmDelete';
import CampusRow from './components/CampusRow';
import UniversityCard from './components/UniversityCard';

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

export default function UniversityManagePage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.roles?.includes('ROLE_SUPER_ADMIN') ?? false;

  const [universities, setUniversities] = useState<UniversityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Modals
  const [uniModal, setUniModal] = useState<{ open: boolean; data?: UniversityResponse | null }>({
    open: false,
  });
  const [campusModal, setCampusModal] = useState<{
    open: boolean;
    universityId: string;
    universityName: string;
    data?: CampusResponse | null;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'university' | 'campus';
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await universityService.getUniversities(keyword || undefined);
      setUniversities(data);
    } catch {
      toast.error('Không thể tải danh sách trường');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // University CRUD handlers
  function handleUniSaved(saved: UniversityResponse) {
    setUniversities((prev) => {
      const idx = prev.findIndex((u) => u.universityId === saved.universityId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setUniModal({ open: false });
  }

  // Campus CRUD handlers
  function handleCampusSaved(saved: CampusResponse) {
    setUniversities((prev) =>
      prev.map((u) => {
        if (u.universityId !== saved.universityId) return u;
        const idx = u.campuses.findIndex((c) => c.campusId === saved.campusId);
        const campuses =
          idx >= 0
            ? u.campuses.map((c) => (c.campusId === saved.campusId ? saved : c))
            : [saved, ...u.campuses];
        return { ...u, campuses };
      })
    );
    setCampusModal(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'university') {
        await universityService.deleteUniversity(deleteTarget.id);
        setUniversities((prev) => prev.filter((u) => u.universityId !== deleteTarget.id));
        toast.success('Đã xóa trường đại học');
      } else {
        await universityService.deleteCampus(deleteTarget.id);
        setUniversities((prev) =>
          prev.map((u) => ({
            ...u,
            campuses: u.campuses.filter((c) => c.campusId !== deleteTarget.id),
          }))
        );
        toast.success('Đã xóa cơ sở');
      }
      setDeleteTarget(null);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Xóa thất bại'));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100">
            <School size={22} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quản lý Trường & Cơ sở</h1>
            <p className="text-sm text-gray-500">{universities.length} trường đại học</p>
          </div>
        </div>
        <button
          onClick={() => setUniModal({ open: true, data: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Thêm trường
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
          placeholder="Tìm theo tên trường hoặc tên viết tắt…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button
            onClick={() => setKeyword('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm">Đang tải…</span>
        </div>
      ) : universities.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
          <Building2 size={40} strokeWidth={1} />
          <p className="text-sm">Chưa có trường nào{keyword && ` khớp với "${keyword}"`}</p>
          <button
            onClick={load}
            className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
          >
            <RefreshCw size={12} /> Tải lại
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {universities.map((uni) => (
            <UniversityCard
              key={uni.universityId}
              uni={uni}
              isSuperAdmin={isSuperAdmin}
              isExpanded={expandedIds.has(uni.universityId)}
              onToggleExpand={() => toggleExpand(uni.universityId)}
              onEdit={() => setUniModal({ open: true, data: uni })}
              onAddCampus={() =>
                setCampusModal({
                  open: true,
                  universityId: uni.universityId,
                  universityName: uni.universityName,
                  data: null,
                })
              }
              onDelete={() =>
                setDeleteTarget({
                  type: 'university',
                  id: uni.universityId,
                  name: uni.universityName,
                })
              }
            >
              <div className="space-y-2">
                {uni.campuses.length === 0 ? (
                  <p className="text-xs text-gray-400 pl-2">
                    Chưa có cơ sở nào. Nhấn <strong>+</strong> để thêm.
                  </p>
                ) : (
                  uni.campuses.map((campus) => (
                    <CampusRow
                      key={campus.campusId}
                      campus={campus}
                      isSuperAdmin={isSuperAdmin}
                      onEdit={(c) =>
                        setCampusModal({
                          open: true,
                          universityId: uni.universityId,
                          universityName: uni.universityName,
                          data: c,
                        })
                      }
                      onDelete={(c) =>
                        setDeleteTarget({ type: 'campus', id: c.campusId, name: c.campusName })
                      }
                    />
                  ))
                )}
              </div>
            </UniversityCard>
          ))}
        </div>
      )}

      {/* Modals */}
      {uniModal.open && (
        <UniversityModal
          initial={uniModal.data}
          onClose={() => setUniModal({ open: false })}
          onSaved={handleUniSaved}
        />
      )}

      {campusModal?.open && (
        <CampusModal
          universityId={campusModal.universityId}
          universityName={campusModal.universityName}
          initial={campusModal.data}
          onClose={() => setCampusModal(null)}
          onSaved={handleCampusSaved}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.name}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
