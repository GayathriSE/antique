import type { Prisma } from "@prisma/client";

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN";

export type SafeUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
};

// ─── Product ─────────────────────────────────────────────────────────────────

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export type ProductWithReviews = Prisma.ProductGetPayload<{
  include: { category: true; reviews: { include: { user: true } } };
}>;

// ─── Cart ────────────────────────────────────────────────────────────────────

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export type CartWithItems = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type OrderWithUser = Prisma.OrderGetPayload<{
  include: { user: true; items: true };
}>;

// ─── Address ─────────────────────────────────────────────────────────────────

export type AddressData = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

// ─── Pagination ──────────────────────────────────────────────────────────────

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// ─── Action Response ─────────────────────────────────────────────────────────

export type ActionResponse<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// ─── Filters ─────────────────────────────────────────────────────────────────

export type ProductFilters = {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc";
  featured?: boolean;
  page?: number;
  limit?: number;
};
