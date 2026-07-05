import { db } from "@/lib/db";
import type {
  ProductFilters,
  PaginatedResult,
  SafeProductWithCategory,
  SafeProductWithReviews,
} from "@/types";
import type { Prisma } from "@prisma/client";

export function serializeProduct(
  product: Prisma.ProductGetPayload<{ include: { category: true } }>,
): SafeProductWithCategory {
  return {
    ...product,
    price: Number(product.price),
    discountPrice:
      product.discountPrice !== null ? Number(product.discountPrice) : null,
  };
}

function serializeProductWithReviews(
  product: Prisma.ProductGetPayload<{
    include: { category: true; reviews: { include: { user: true } } };
  }>,
): SafeProductWithReviews {
  return {
    ...product,
    price: Number(product.price),
    discountPrice:
      product.discountPrice !== null ? Number(product.discountPrice) : null,
  };
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResult<SafeProductWithCategory>> {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort = "newest",
    featured,
    page = 1,
    limit = 12,
  } = filters;

  const where: Prisma.ProductWhereInput = {};

  if (category) {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { material: { contains: search, mode: "insensitive" } },
    ];
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }
  if (featured !== undefined) {
    where.isFeatured = featured;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(serializeProduct),
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export async function getProductBySlug(
  slug?: string,
): Promise<SafeProductWithReviews | null> {
  if (!slug || typeof slug !== "string" || slug.trim() === "") {
    return null;
  }

  try {
    console.log("getProductBySlug lookup for slug:", slug);
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) return null;
    return serializeProductWithReviews(product);
  } catch (err) {
    console.error("getProductBySlug error:", err);
    return null;
  }
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<SafeProductWithCategory[]> {
  const products = await db.product.findMany({
    where: { categoryId, id: { not: excludeId }, stock: { gt: 0 } },
    include: { category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  return products.map(serializeProduct);
}

export async function getFeaturedProducts(): Promise<
  SafeProductWithCategory[]
> {
  const products = await db.product.findMany({
    where: { isFeatured: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return products.map(serializeProduct);
}

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}
