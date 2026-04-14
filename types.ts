export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface PartnerItem {
  name: string;
  description: string;
  role?: string;
}

export interface ExpertiseItem {
  label: string;
}

export interface NavLink {
  label: string;
  path: string;
}

export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  featureImageUrl: string;
  featureImagePath: string;
  authorName: string;
  publishedAt: string | null;
  status: BlogPostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDraft {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  featureImageUrl: string;
  featureImagePath: string;
  authorName: string;
  publishedAt: string;
  status: BlogPostStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogImageAsset {
  path: string;
  url: string;
}

export interface AdminUser {
  id: string;
  email: string;
  emailConfirmedAt: string | null;
}

export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AdminUser;
}
