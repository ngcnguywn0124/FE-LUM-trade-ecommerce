import { ManagedPost, PostStatus, PostsAggregate } from '@/types/manage-posts';

const conditions: ManagedPost['condition'][] = ['new', 'like-new', 'used', 'old'];
const statuses: PostStatus[] = ['active', 'active', 'active', 'expired', 'pending', 'hidden', 'sold'];

const categories = [
  { name: 'Laptop', sub: 'Laptop Gaming' },
  { name: 'Sách', sub: 'Sách Giáo Trình' },
  { name: 'Điện thoại', sub: 'iPhone' },
  { name: 'Thời trang', sub: 'Áo thun' },
  { name: 'Phụ kiện', sub: 'Tai Nghe' },
  { name: 'Xe cộ', sub: 'Xe Đạp' },
  { name: 'Đồ dùng học tập', sub: 'Vở Ghi Chú' },
];

const titles = [
  'Laptop Dell XPS 13 Core i7 RAM 16GB SSD 512GB như mới',
  'Sách Giáo Trình Giải Tích 1 HUTECH bản mới nhất',
  'iPhone 13 Pro Max 256GB chính hãng VN/A còn BH',
  'Áo thun HUTECH đồng phục semester 2023 size L',
  'Tai nghe Sony WH-1000XM4 chống ồn chủ động',
  'Xe đạp địa hình Giant ATX 610 2022 đã qua sử dụng',
  'Bộ sách Lập trình Python từ cơ bản đến nâng cao',
  'Máy tính casio FX-580VNX nguyên seal',
  'Laptop MacBook Air M2 2022 8GB/256GB Space Gray',
  'Điện thoại Samsung Galaxy S22 Ultra 256GB Black',
  'Vợt cầu lông Yonex Astrox 88D Pro chính hãng',
  'Bộ bàn phím chuột Logitech MX Keys + MX Master 3',
  'Quần jeans Levi\'s 501 size 30 mới 95%',
  'Máy ảnh Sony A7III body only kèm túi máy',
  'Xe máy Honda Wave Alpha 2021 ít đi 8.000km',
];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateMockManagedPosts(count = 15): ManagedPost[] {
  const rand = seededRand(99999);
  const now = new Date('2026-02-25T10:00:00');
  const result: ManagedPost[] = [];

  for (let i = 1; i <= count; i++) {
    const cat = categories[Math.floor(rand() * categories.length)];
    const condition = conditions[Math.floor(rand() * conditions.length)];
    const status = statuses[Math.floor(rand() * statuses.length)];
    const title = titles[(i - 1) % titles.length];

    const daysAgo = Math.floor(rand() * 25) + 1;
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const expiresAt = new Date(createdAt);
    expiresAt.setDate(expiresAt.getDate() + 30);

    const basePrice = cat.name === 'Laptop' ? 12000000
      : cat.name === 'Điện thoại' ? 8000000
      : cat.name === 'Xe cộ' ? 3000000
      : cat.name === 'Sách' ? 80000
      : 500000;

    const price = Math.floor(rand() * basePrice + basePrice * 0.3);
    const isFree = rand() < 0.05;

    result.push({
      id: i,
      title,
      price: isFree ? '0' : price.toLocaleString('vi-VN'),
      isFree,
      image: '/template.png',
      imageCount: Math.floor(rand() * 8) + 1,
      category: cat.name,
      subcategory: cat.sub,
      condition,
      school: 'HUTECH',
      campus: rand() > 0.4 ? 'Ung Văn Khiêm' : undefined,
      status,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      renewedCount: Math.floor(rand() * 3),
      stats: {
        views: Math.floor(rand() * 500) + 10,
        favorites: Math.floor(rand() * 50),
        messages: Math.floor(rand() * 20),
      },
    });
  }

  return result;
}

export function computeAggregate(posts: ManagedPost[]): PostsAggregate {
  return {
    total: posts.length,
    active: posts.filter((p) => p.status === 'active').length,
    expired: posts.filter((p) => p.status === 'expired').length,
    pending: posts.filter((p) => p.status === 'pending').length,
    hidden: posts.filter((p) => p.status === 'hidden').length,
    sold: posts.filter((p) => p.status === 'sold').length,
    totalViews: posts.reduce((acc, p) => acc + p.stats.views, 0),
    totalFavorites: posts.reduce((acc, p) => acc + p.stats.favorites, 0),
    totalMessages: posts.reduce((acc, p) => acc + p.stats.messages, 0),
  };
}
