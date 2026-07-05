"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import slugify from "slugify";
import { productSchema, categorySchema } from "@/validations/product";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function createProduct(
  data: unknown,
): Promise<ActionResponse<{ slug: string }>> {
  await requireAdmin();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  const slug = slugify(parsed.data.name, { lower: true, strict: true });

  const product = await db.product.create({
    data: {
      ...parsed.data,
      slug,
      price: parsed.data.price,
      discountPrice: parsed.data.discountPrice ?? null,
    },
  });

  revalidatePath("/products");
  revalidatePath("/");
  return { success: true, data: { slug: product.slug } };
}

export async function updateProduct(
  id: string,
  data: unknown,
): Promise<ActionResponse> {
  await requireAdmin();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  await db.product.update({
    where: { id },
    data: {
      ...parsed.data,
      price: parsed.data.price,
      discountPrice: parsed.data.discountPrice ?? null,
    },
  });

  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResponse> {
  await requireAdmin();
  await db.product.delete({ where: { id } });
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function createCategory(data: unknown): Promise<ActionResponse> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  const slug = slugify(parsed.data.name, { lower: true, strict: true });
  await db.category.create({ data: { ...parsed.data, slug } });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(
  id: string,
  data: unknown,
): Promise<ActionResponse> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  await db.category.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
  await requireAdmin();
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0)
    return {
      success: false,
      error: `Cannot delete: ${count} product(s) in this category.`,
    };

  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { success: true };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function updateOrderStatus(
  id: string,
  status: string,
): Promise<ActionResponse> {
  await requireAdmin();
  await db.order.update({ where: { id }, data: { status: status as never } });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function getAdminOrders() {
  await requireAdmin();
  return db.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminOrderById(id: string) {
  await requireAdmin();
  return db.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  });
}

export async function getAdminCustomers() {
  await requireAdmin();
  return db.user.findMany({
    where: { role: "USER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });
}
