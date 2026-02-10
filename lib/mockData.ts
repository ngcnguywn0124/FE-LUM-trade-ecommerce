// Mock data generator cho testing
export const generateMockProducts = (count: number = 50) => {
  const categories = [
    { name: 'Laptop', subcategories: ['Laptop Gaming', 'Laptop Văn Phòng', 'MacBook', 'Laptop Đồ Họa'] },
    { name: 'Sách', subcategories: ['Sách Giáo Trình', 'Sách Tham Khảo', 'Truyện - Tiểu Thuyết', 'Sách Tiếng Anh'] },
    { name: 'Thời trang', subcategories: ['Áo thun', 'Quần Jeans', 'Áo Hoodie', 'Áo Trường', 'Giày Sneaker'] },
    { name: 'Xe cộ', subcategories: ['Xe Đạp', 'Xe Điện', 'Xe Máy', 'Phụ Kiện Xe'] },
    { name: 'Điện thoại', subcategories: ['iPhone', 'Samsung', 'Xiaomi', 'OPPO - VIVO'] },
    { name: 'Phụ kiện', subcategories: ['Tai Nghe', 'Sạc & Cáp', 'Balo & Túi', 'Chuột & Bàn Phím'] },
    { name: 'Đồ dùng học tập', subcategories: ['Vở Ghi Chú', 'Bút Viết', 'Máy Tính', 'Văn Phòng Phẩm'] },
  ];
  
  const schools = [
    { name: 'HUTECH', campuses: ['Ung Văn Khiêm', 'Đinh Tiên Hoàng', 'Nguyễn Thị Minh Khai', 'Bạch Đằng (Cơ sở 2)'] },
    { name: 'UIT', campuses: ['Linh Trung', 'Cơ sở 2'] },
    { name: 'HCMUS', campuses: ['Nguyễn Văn Cừ', 'Linh Trung'] },
    { name: 'HCMUT', campuses: ['Cơ sở 1 (Lý Thường Kiệt)', 'Cơ sở 2 (Dĩ An)'] },
    { name: 'UEH', campuses: ['Cơ sở A', 'Cơ sở B', 'Cơ sở C'] },
  ];
  
  const conditions: Array<'new' | 'like-new' | 'used'> = ['new', 'like-new', 'used'];
  
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];
    const school = schools[Math.floor(Math.random() * schools.length)];
    const campus = Math.random() > 0.3 ? school.campuses[Math.floor(Math.random() * school.campuses.length)] : undefined;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Generate realistic prices based on category
    let basePrice = 100000;
    if (category.name === 'Laptop') basePrice = 10000000;
    else if (category.name === 'Điện thoại') basePrice = 5000000;
    else if (category.name === 'Xe cộ') basePrice = 2000000;
    else if (category.name === 'Sách') basePrice = 50000;
    
    const price = basePrice + Math.floor(Math.random() * basePrice);
    const discount = Math.random() > 0.5 ? 1.2 + Math.random() * 0.5 : 1;
    
    // Create product name with subcategory
    const productName = `${subcategory} ${i} - ${condition === 'new' ? 'Mới 100%' : condition === 'like-new' ? 'Như mới' : 'Đã qua sử dụng'}`;
    
    products.push({
      id: i,
      name: productName,
      price: `${price.toLocaleString('vi-VN')}đ`,
      originalPrice: discount > 1 ? `${Math.floor(price * discount).toLocaleString('vi-VN')}đ` : undefined,
      school: school.name,
      campus: campus,
      image: `/product/${category.name.toLowerCase()}.jpg`,
      tag: Math.random() > 0.8 ? 'Nổi bật' : undefined,
      time: getRandomTime(),
      imageCount: Math.floor(Math.random() * 10) + 1,
      condition: condition,
      category: category.name,
      seller: {
        id: Math.floor(Math.random() * 1000),
        name: `Người bán ${Math.floor(Math.random() * 1000)}`,
        rating: 3 + Math.random() * 2,
      }
    });
  }
  
  return products;
};

const getRandomTime = (): string => {
  const times = [
    'Vừa xong',
    '30 phút trước',
    '1 giờ trước',
    '2 giờ trước',
    '5 giờ trước',
    '1 ngày trước',
    '2 ngày trước',
    '1 tuần trước'
  ];
  return times[Math.floor(Math.random() * times.length)];
};

// Export sample searches
export const sampleSearches = [
  { query: 'laptop', description: 'Tìm kiếm laptop' },
  { query: 'macbook', description: 'Tìm kiếm MacBook' },
  { query: 'iphone', description: 'Tìm kiếm iPhone' },
  { query: 'sách', description: 'Tìm kiếm sách' },
  { query: 'xe đạp', description: 'Tìm kiếm xe đạp' },
];

// Export sample categories
export const sampleCategories = [
  'Laptop',
  'Sách',
  'Thời trang',
  'Xe cộ',
  'Điện thoại',
  'Phụ kiện',
  'Đồ dùng học tập',
];
