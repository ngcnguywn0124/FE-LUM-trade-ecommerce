import type { ProductAttributeResponse } from '@/types/admin';

interface AttributeTableProps {
  data: ProductAttributeResponse[];
  onEdit: (attribute: ProductAttributeResponse) => void;
  onDelete: (attribute: ProductAttributeResponse) => void;
}

export default function AttributeTable({
  data,
  onEdit,
  onDelete,
}: AttributeTableProps) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">Danh mục này chưa có thuộc tính.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="py-2 pr-3 font-semibold">Tên thuộc tính</th>
            <th className="py-2 pr-3 font-semibold">Kiểu</th>
            <th className="py-2 pr-3 font-semibold">Bắt buộc</th>
            <th className="py-2 pr-3 font-semibold">Options</th>
            <th className="py-2 pr-3 font-semibold">Order</th>
            <th className="py-2 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.attributeId} className="border-b border-gray-50 last:border-b-0">
              <td className="py-2.5 pr-3 font-medium text-gray-900">{item.attributeName}</td>
              <td className="py-2.5 pr-3 text-gray-600">{item.attributeType}</td>
              <td className="py-2.5 pr-3 text-gray-600">{item.isRequired ? 'Có' : 'Không'}</td>
              <td className="py-2.5 pr-3 text-gray-600 max-w-xs truncate">
                {item.attributeType === 'select' && item.options?.length
                  ? item.options.join(', ')
                  : '-'}
              </td>
              <td className="py-2.5 pr-3 text-gray-600">{item.displayOrder}</td>
              <td className="py-2.5 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
