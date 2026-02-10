import { Category, School } from "@/types";

// Categories với Subcategories
export const mockCategories: Category[] = [
  {
    id: 'laptop',
    name: 'Laptop',
    count: 234,
    subcategories: [
      { id: 'laptop-gaming', name: 'Laptop Gaming', count: 89, parentCategory: 'laptop' },
      { id: 'laptop-van-phong', name: 'Laptop Văn Phòng', count: 67, parentCategory: 'laptop' },
      { id: 'macbook', name: 'MacBook', count: 45, parentCategory: 'laptop' },
      { id: 'laptop-do-hoa', name: 'Laptop Đồ Họa', count: 33, parentCategory: 'laptop' },
    ],
  },
  {
    id: 'sach',
    name: 'Sách',
    count: 567,
    subcategories: [
      { id: 'sach-giao-trinh', name: 'Sách Giáo Trình', count: 234, parentCategory: 'sach' },
      { id: 'sach-tham-khao', name: 'Sách Tham Khảo', count: 156, parentCategory: 'sach' },
      { id: 'truyen-tieu-thuyet', name: 'Truyện - Tiểu Thuyết', count: 98, parentCategory: 'sach' },
      { id: 'sach-tieng-anh', name: 'Sách Tiếng Anh', count: 79, parentCategory: 'sach' },
    ],
  },
  {
    id: 'thoi-trang',
    name: 'Thời trang',
    count: 892,
    subcategories: [
      { id: 'ao-thun', name: 'Áo thun', count: 234, parentCategory: 'thoi-trang' },
      { id: 'quan-jeans', name: 'Quần Jeans', count: 189, parentCategory: 'thoi-trang' },
      { id: 'ao-hoodie', name: 'Áo Hoodie', count: 156, parentCategory: 'thoi-trang' },
      { id: 'ao-truong', name: 'Áo Trường', count: 134, parentCategory: 'thoi-trang' },
      { id: 'giay-sneaker', name: 'Giày Sneaker', count: 179, parentCategory: 'thoi-trang' },
    ],
  },
  {
    id: 'xe-co',
    name: 'Xe cộ',
    count: 145,
    subcategories: [
      { id: 'xe-dap', name: 'Xe Đạp', count: 67, parentCategory: 'xe-co' },
      { id: 'xe-dien', name: 'Xe Điện', count: 45, parentCategory: 'xe-co' },
      { id: 'xe-may', name: 'Xe Máy', count: 23, parentCategory: 'xe-co' },
      { id: 'phu-kien-xe', name: 'Phụ Kiện Xe', count: 10, parentCategory: 'xe-co' },
    ],
  },
  {
    id: 'dien-thoai',
    name: 'Điện thoại',
    count: 321,
    subcategories: [
      { id: 'iphone', name: 'iPhone', count: 123, parentCategory: 'dien-thoai' },
      { id: 'samsung', name: 'Samsung', count: 89, parentCategory: 'dien-thoai' },
      { id: 'xiaomi', name: 'Xiaomi', count: 67, parentCategory: 'dien-thoai' },
      { id: 'oppo-vivo', name: 'OPPO - VIVO', count: 42, parentCategory: 'dien-thoai' },
    ],
  },
  {
    id: 'phu-kien',
    name: 'Phụ kiện',
    count: 456,
    subcategories: [
      { id: 'tai-nghe', name: 'Tai Nghe', count: 156, parentCategory: 'phu-kien' },
      { id: 'sac-cap', name: 'Sạc & Cáp', count: 123, parentCategory: 'phu-kien' },
      { id: 'balo-tui', name: 'Balo & Túi', count: 98, parentCategory: 'phu-kien' },
      { id: 'chuot-ban-phim', name: 'Chuột & Bàn Phím', count: 79, parentCategory: 'phu-kien' },
    ],
  },
  {
    id: 'do-dung-hoc-tap',
    name: 'Đồ dùng học tập',
    count: 678,
    subcategories: [
      { id: 'vo-ghi-chu', name: 'Vở Ghi Chú', count: 234, parentCategory: 'do-dung-hoc-tap' },
      { id: 'but-viet', name: 'Bút Viết', count: 189, parentCategory: 'do-dung-hoc-tap' },
      { id: 'may-tinh', name: 'Máy Tính', count: 123, parentCategory: 'do-dung-hoc-tap' },
      { id: 'van-phong-pham', name: 'Văn Phòng Phẩm', count: 132, parentCategory: 'do-dung-hoc-tap' },
    ],
  },
];

// Schools với Campuses
export const mockSchools: School[] = [
  {
    id: 'hutech',
    name: 'HUTECH',
    campuses: [
      { id: 'uvk', name: 'Ung Văn Khiêm', schoolId: 'hutech' },
      { id: 'dth', name: 'Đinh Tiên Hoàng', schoolId: 'hutech' },
      { id: 'ntmk', name: 'Nguyễn Thị Minh Khai', schoolId: 'hutech' },
      { id: 'bdc', name: 'Bạch Đằng (Cơ sở 2)', schoolId: 'hutech' },
    ],
  },
  {
    id: 'uit',
    name: 'UIT',
    campuses: [
      { id: 'lt', name: 'Linh Trung', schoolId: 'uit' },
      { id: 'cs2', name: 'Cơ sở 2', schoolId: 'uit' },
    ],
  },
  {
    id: 'hcmus',
    name: 'HCMUS',
    campuses: [
      { id: 'nvc', name: 'Nguyễn Văn Cừ', schoolId: 'hcmus' },
      { id: 'lt-hcmus', name: 'Linh Trung', schoolId: 'hcmus' },
    ],
  },
  {
    id: 'hcmut',
    name: 'HCMUT',
    campuses: [
      { id: 'cs1', name: 'Cơ sở 1 (Lý Thường Kiệt)', schoolId: 'hcmut' },
      { id: 'cs2-hcmut', name: 'Cơ sở 2 (Dĩ An)', schoolId: 'hcmut' },
    ],
  },
  {
    id: 'ueh',
    name: 'UEH',
    campuses: [
      { id: 'a', name: 'Cơ sở A', schoolId: 'ueh' },
      { id: 'b', name: 'Cơ sở B', schoolId: 'ueh' },
      { id: 'c', name: 'Cơ sở C', schoolId: 'ueh' },
    ],
  },
  {
    id: 'huflit',
    name: 'HUFLIT',
    campuses: [
      { id: 'huflit-1', name: 'Cơ sở 1', schoolId: 'huflit' },
      { id: 'huflit-2', name: 'Cơ sở 2', schoolId: 'huflit' },
    ],
  },
  {
    id: 'tdtu',
    name: 'TDTU',
    campuses: [
      { id: 'tdtu-1', name: 'Cơ sở 1 (Bình Thạnh)', schoolId: 'tdtu' },
      { id: 'tdtu-2', name: 'Cơ sở 2 (Gò Vấp)', schoolId: 'tdtu' },
    ],
  },
];

// Helper function to get campuses by school
export const getCampusesBySchool = (schoolId: string) => {
  const school = mockSchools.find(s => s.id === schoolId);
  return school?.campuses || [];
};

// Helper function to get subcategories by category
export const getSubcategoriesByCategory = (categoryId: string) => {
  const category = mockCategories.find(c => c.id === categoryId);
  return category?.subcategories || [];
};

// Helper function to get school by id
export const getSchoolById = (schoolId: string) => {
  return mockSchools.find(s => s.id === schoolId);
};

// Helper function to get category by id
export const getCategoryById = (categoryId: string) => {
  return mockCategories.find(c => c.id === categoryId);
};
