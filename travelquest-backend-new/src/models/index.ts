export interface Destination {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  region: string;
  country: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  category: string;
  highlights?: string[];
  activities?: string[];
  bestTimeToVisit?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  destinationId: string;
  category: 'Culture' | 'Adventure';
  region: string;
  duration: string;
  durationDays: number;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  highlights: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  availableDates?: string[];
  maxGroupSize?: number;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  includes?: string[];
  itinerary?: string[];
  images?: string[];
  isAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  author: string;
  authorId?: string;
  publishedAt: string;
  updatedAt: string;
  region: string;
  tags: string[];
  image: string;
  readTime: number;
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  featuredImage?: string;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  resourceType: string;
  resourceId: string;
  parentId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isApproved: boolean;
  isSpam: boolean;
  likes: number;
  dislikes: number;
  metadata: {
    userAgent: string;
    ipAddress: string;
    flagReason?: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  password: string; // This should be hashed
  role: 'admin' | 'super-admin';
  fullName: string;
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T | null;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  region?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  search?: string;
}
