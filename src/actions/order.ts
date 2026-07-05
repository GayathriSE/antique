"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Razorpay from "razorpay";
import { addressSchema } from "@/validations/checkout";
import type { ActionResponse } from "@/types";
import type { AddressData } from "@/types";
import crypto from "crypto";
import { sendAdminWhatsAppNotification } from "@/lib/whatsapp";

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function createRazorpayOrder(
  cartItems: { id: string; quantity: number }[],
  address: AddressData,
): Promise<
  ActionResponse<{
    razorpayOrderId: string;
    amount: number;
    currency: string;
    orderId: string;
  }>
> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, error: "Please sign in to checkout." };

  const parsed = addressSchema.safeParse(address);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // Fetch actual product prices from DB (never trust client-side prices)
  const productIds = cartItems.map((i: any) => i.id);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    return { success: false, error: "One or more products not found." };
  }

  for (const item of cartItems) {
    const product = products.find((p: any) => p.id === item.id)!;
    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `"${product.name}" has insufficient stock.`,
      };
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((p: any) => p.id === item.id)!;
    const price = Number(product.discountPrice ?? product.price);
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 5000 ? 0 : 299;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return { success: false, error: "Razorpay is not configured." };
  }

  // Create Razorpay order
  const rpOrder = await razorpay.orders.create({
    amount: total * 100, // in paise
    currency: "INR",
    receipt: `order_${Date.now()}`,
  });

  // Create pending DB order
  const order = await db.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      subtotal,
      shippingCost: shipping,
      tax,
      total,
      razorpayOrderId: rpOrder.id,
      paymentStatus: "pending",
      shippingAddress: parsed.data,
      items: {
        create: cartItems.map((item) => {
          const product = products.find((p: any) => p.id === item.id)!;
          return {
            productId: product.id,
            quantity: item.quantity,
            price: product.discountPrice ?? product.price,
            name: product.name,
            image: product.images[0] || null,
          };
        }),
      },
    },
  });

  return {
    success: true,
    data: {
      razorpayOrderId: rpOrder.id,
      amount: total * 100,
      currency: "INR",
      orderId: order.id,
    },
  };
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  orderId: string,
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  // Verify signature
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return { success: false, error: "Payment verification failed." };
  }

  // Update order status and decrement stock
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });

  if (!order) return { success: false, error: "Order not found." };

  await db.$transaction([
    db.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING",
        paymentStatus: "paid",
        paymentId: razorpayPaymentId,
      },
    }),
    ...order.items.map((item: any) =>
      db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      }),
    ),
  ]);

  // Send WhatsApp notification to admin (non-blocking)
  sendAdminWhatsAppNotification({
    orderId: order.id,
    customerName: order.user.name || "Unknown",
    customerEmail: order.user.email,
    total: Number(order.total),
    itemCount: order.items.reduce((s: any, i: any) => s + i.quantity, 0),
    paymentId: razorpayPaymentId,
  }).catch((err) => console.error("[WhatsApp] Notification error:", err));

  return { success: true, message: "Payment verified successfully." };
}

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { include: { product: true } } },
  });
}
