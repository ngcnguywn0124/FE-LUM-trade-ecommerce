export type ItemCondition = 'new' | 'like-new' | 'used' | 'old' | 'broken';
export type TransactionType = 'meetup' | 'delivery' | 'both';

export interface TechnicalSpecField {
  key: string;
  label: string;
  placeholder: string;
}

export interface PostItemFormData {
  title: string;
  categoryId: string;
  subcategoryId: string;
  condition: ItemCondition;
  price: string;
  isFree: boolean;
  negotiable: boolean;
  tags: string[];
  description: string;
  technicalSpecs: { key: string; value: string }[];
  schoolId: string;
  campusId: string;
  meetingPoint: string;
  transactionType: TransactionType;
  contactName: string;
  contactPhone: string;
  zaloLink: string;
  facebookLink: string;
  imagePreviews: string[];
}

export interface PostItemErrors {
  title?: string;
  categoryId?: string;
  subcategoryId?: string;
  condition?: string;
  price?: string;
  description?: string;
  schoolId?: string;
  campusId?: string;
  meetingPoint?: string;
  transactionType?: string;
  contactName?: string;
  contactPhone?: string;
  zaloLink?: string;
  facebookLink?: string;
  imagePreviews?: string;
}
