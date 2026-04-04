export interface BlogAuthor {
  userId?: string;
  fullName?: string;
  avatar?: string;
  // compatibility with old structure
  name?: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  icon: any; // Lucide icon
  color: string;
}

export interface BlogPost {
  id?: string;
  blogId?: string; // from backend
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryColor?: string;
  thumbnail: string;
  author: BlogAuthor;
  createdAt?: string;
  publishedAt?: string;
  approvedAt?: string;
  readTime?: string;
  views?: number;
  viewCount?: number; // from backend
  likes?: number;
  likeCount?: number; // from backend
  isFeatured?: boolean;
  status?: "pending" | "approved" | "rejected" | "hidden";
  rejectionReason?: string;
}

export interface BlogFormData {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnail?: File;
  thumbnailPreview?: string;
}

export interface BlogErrors {
  title?: string;
  category?: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
}
