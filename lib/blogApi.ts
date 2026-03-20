export type BlogPostSummary = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  isFeatured?: boolean;
};

export type BlogPostDetail = BlogPostSummary & {
  content: string;
  comments: number;
  tags: string[];
  status?: string;
  rejectionReason?: string | null;
  moderatedAt?: string | null;
  authorProfile: {
    name: string;
    role: string;
  };
};

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type BlogSubmitPayload = {
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  category: string;
  readTime?: string;
  tags?: string[];
};

export type BlogModerationPayload = {
  action: "approve" | "reject" | "hide";
  note?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8686/api/v1";

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu blog (${response.status})`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

async function fetchApiWithAuth<T>(path: string, init: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Yêu cầu thất bại (${response.status})`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  return fetchApi<BlogPostSummary[]>("/blogs");
}

export async function getBlogPostById(id: string | number): Promise<BlogPostDetail> {
  return fetchApi<BlogPostDetail>(`/blogs/${String(id)}`);
}

export async function getRelatedBlogPosts(
  id: string | number,
  limit = 3,
): Promise<BlogPostSummary[]> {
  return fetchApi<BlogPostSummary[]>(`/blogs/${String(id)}/related?limit=${limit}`);
}

export async function submitBlogPost(payload: BlogSubmitPayload): Promise<BlogPostDetail> {
  return fetchApiWithAuth<BlogPostDetail>("/blogs/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyBlogPosts(): Promise<BlogPostDetail[]> {
  return fetchApiWithAuth<BlogPostDetail[]>("/blogs/my", {
    method: "GET",
  });
}

export async function getPendingBlogPosts(): Promise<BlogPostDetail[]> {
  return fetchApiWithAuth<BlogPostDetail[]>("/blogs/moderation/pending", {
    method: "GET",
  });
}

export async function moderateBlogPost(
  id: string | number,
  payload: BlogModerationPayload,
): Promise<BlogPostDetail> {
  return fetchApiWithAuth<BlogPostDetail>(`/blogs/${String(id)}/moderation`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export const TRENDING_TOPICS = [
  "Mua bán đồ cũ",
  "Laptop sinh viên",
  "Sách giáo khoa",
  "Đồ điện tử",
  "Đời sống ký túc xá",
  "Tiết kiệm chi phí",
  "Kinh tế tuần hoàn",
  "Môi trường xanh",
] as const;
