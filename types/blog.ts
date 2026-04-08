export interface BlogAuthor {
  userId?: string;
  fullName?: string;
  avatar?: string;
  name?: string;
}

export interface BlogCategory {
  blogCategoryId: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface BlogCategoryPayload {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface BlogPost {
  id?: string;
  blogId?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categoryId?: string;
  blogCategory?: BlogCategory;
  thumbnail: string;
  author?: BlogAuthor;
  createdAt?: string;
  created_at?: string;
  publishedAt?: string;
  readTime?: string;
  views?: number;
  viewCount?: number;
  likes?: number;
  likeCount?: number;
  isFeatured?: boolean;
  status?: "draft" | "published" | "archived";
}

export interface BlogFormData {
  title: string;
  categoryId: string;
  excerpt: string;
  content: string;
  thumbnail?: File;
  thumbnailPreview?: string;
}

export interface BlogErrors {
  title?: string;
  categoryId?: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
}
