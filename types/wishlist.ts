export type WishlistPostStatus = "active" | "sold";

export interface WishlistItem {
  id: number;
  name: string;
  price: string;
  school: string;
  campus?: string;
  image: string;
  time: string;
  imageCount: number;
  status: WishlistPostStatus;
}
