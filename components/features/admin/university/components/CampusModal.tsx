'use client';

import { useState } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import * as universityService from '@/services/universityService';
import type { CampusResponse, CampusRequest } from '@/types/admin';
import { FormInput } from '@/components/shared/FormInput';

function apiErrMsg(err: unknown, fallback: string) {
  if (err instanceof AxiosError) return err.response?.data?.message ?? fallback;
  return fallback;
}

interface CampusModalProps {
  universityId: number;
  universityName: string;
  initial?: CampusResponse | null;
  onClose: () => void;
  onSaved: (c: CampusResponse) => void;
}

export default function CampusModal({
  universityId,
  universityName,
  initial,
  onClose,
  onSaved,
}: CampusModalProps) {
  const [form, setForm] = useState<CampusRequest>({
    universityId,
    campusName: initial?.campusName ?? '',
    address: initial?.address ?? '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.campusName.trim()) {
      toast.error('Tên cơ sở không được để trống');
      return;
    }
    setSaving(true);
    try {
      const result = initial
        ? await universityService.updateCampus(initial.campusId, form)
        : await universityService.createCampus(form);
      toast.success(initial ? 'Cập nhật cơ sở thành công' : 'Thêm cơ sở thành công');
      onSaved(result);
    } catch (err) {
      toast.error(apiErrMsg(err, 'Thao tác thất bại'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" />
            {initial ? 'Chỉnh sửa cơ sở' : 'Thêm cơ sở'} — {universityName}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormInput
            label="Tên cơ sở"
            required
            placeholder="Cơ sở A"
            value={form.campusName}
            onChange={(e) => setForm((f) => ({ ...f, campusName: e.target.value }))}
          />
          <FormInput
            label="Địa chỉ cơ sở"
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
              {initial ? 'Lưu thay đổi' : 'Thêm cơ sở'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
