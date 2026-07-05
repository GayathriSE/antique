"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileSchema, addressSchema } from "@/validations/checkout";
import type { ActionResponse } from "@/types";

export async function updateProfile(data: unknown): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  return { success: true };
}

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });
}

export async function createAddress(data: unknown): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = addressSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  await db.address.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return { success: true };
}

export async function deleteAddress(id: string): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await db.address.deleteMany({ where: { id, userId: session.user.id } });
  return { success: true };
}

export async function setDefaultAddress(id: string): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await db.$transaction([
    db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    }),
    db.address.update({ where: { id }, data: { isDefault: true } }),
  ]);

  return { success: true };
}
