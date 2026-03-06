'use client';

import { useState } from 'react';
import { Building2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import * as universityService from '@/services/universityService';
import type { UniversityResponse, UniversityRequest } from '@/types/admin';
import { FormInput } from '@/components/shared/FormInput';

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

interface UniversityModalProps {
  initial?: UniversityResponse | null;
  onClose: () => void;
  onSaved: (u: UniversityResponse) => void;
}

export default function UniversityModal({ initial, onClose, onSaved }: UniversityModalProps) {
  const [form, setForm] = useState<UniversityRequest>({
    universityName: initial?.universityName ?? '',
    shortName: initial?.shortName ?? '',
    city: initial?.city ?? '',
    address: initial?.address ?? '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.universityName.trim()) {
      toast.error('Tên trường không được để trống');
      return;
    }
    setSaving(true);
    try {
      const result = initial
        ? await universityService.updateUniversity(initial.universityId, form)
        : await universityService.createUniversity(form);
      toast.success(initial ? 'Cập nhật trường thành công' : 'Tạo trường thành công');
      onSaved(result);
    } catch (err) {
      toast.error(apiErrMsg(err, initial ? 'Cập nhật thất bại' : 'Tạo thất bại'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Building2 size={18} className="text-emerald-600" />
            {initial ? 'Chỉnh sửa trường đại học' : 'Thêm trường đại học'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormInput
            label="Tên trường"
            required
            placeholder="Ví dụ: Trường Đại học Công nghệ TP.HCM"
            value={form.universityName}
            onChange={(e) => setForm((f) => ({ ...f, universityName: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Tên viết tắt"
              placeholder="HUTECH"
              value={form.shortName ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, shortName: e.target.value }))}
            />
            <FormInput
              label="Thành phố"
              placeholder="TP. Hồ Chí Minh"
              value={form.city ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <FormInput
            label="Địa chỉ"
            placeholder="475A Điện Biên Phủ, Bình Thạnh, TP.HCM"
            value={form.address ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {initial ? 'Lưu thay đổi' : 'Tạo trường'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
