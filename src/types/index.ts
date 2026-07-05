type DecimalLike = number | string | { toNumber(): number };

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

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ProductBase = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: DecimalLike;
  discountPrice: DecimalLike | null;
  images: string[];
  categoryId: string;
  stock: number;
  weight: string | null;
  material: string | null;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = Omit<ProductBase, "price" | "discountPrice"> & {
  price: number;
  discountPrice: number | null;
};

export type ProductWithCategory = ProductBase & {
  category: Category;
};

export type SafeProductWithCategory = Omit<
  ProductWithCategory,
  "price" | "discountPrice"
> & {
  price: number;
  discountPrice: number | null;
};

export type ProductWithReviews = ProductBase & {
  category: Category;
  reviews: Array<{ user?: unknown }>;
};

export type SafeProductWithReviews = Omit<
  ProductWithReviews,
  "price" | "discountPrice"
> & {
  price: number;
  discountPrice: number | null;
};

export type SafeProduct = Omit<ProductBase, "price" | "discountPrice"> & {
  price: number;
  discountPrice: number | null;
};

// ─── Cart ────────────────────────────────────────────────────────────────────

export type CartItemWithProduct = {
  id: string;
  productId: string;
  cartId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
};

export type CartWithItems = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItemWithProduct[];
};

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderWithItems = {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{ product: Product }>;
};

export type OrderWithUser = {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  user: SafeUser;
  items: Array<{ product: Product }>;
};

// ─── Address ─────────────────────────────────────────────────────────────────

export type AddressData = {
  id?: string;
  userId?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
