export type ItemCondition = 'new' | 'like-new' | 'used';

export interface PostItemFormData {
  title: string;
  categoryId: string;
  subcategoryId: string;
  condition: ItemCondition;
  price: string;
  negotiable: boolean;
  description: string;
  schoolId: string;
  campusId: string;
  contactName: string;
  contactPhone: string;
  imagePreviews: string[];
}

export interface PostItemErrors {
  title?: string;
  categoryId?: string;
  subcategoryId?: string;
  price?: string;
  description?: string;
  schoolId?: string;
  campusId?: string;
  contactName?: string;
  contactPhone?: string;
  imagePreviews?: string;
}
