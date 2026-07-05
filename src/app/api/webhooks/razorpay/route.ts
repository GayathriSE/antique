import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Razorpay webhook secret is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing webhook signature." },
      { status: 400 },
    );
  }

  const body = await request.text();
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const event = payload.event;
  const razorpayOrderId =
    payload.payload?.payment?.entity?.order_id ??
    payload.payload?.order?.entity?.id;
  const razorpayPaymentId = payload.payload?.payment?.entity?.id ?? null;

  if (!razorpayOrderId) {
    return NextResponse.json(
      { error: "Missing Razorpay order id." },
      { status: 400 },
    );
  }

  const order = await db.order.findFirst({ where: { razorpayOrderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (event === "payment.captured" || event === "order.paid") {
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        status: "PROCESSING",
        paymentId: razorpayPaymentId ?? order.paymentId,
      },
    });
  } else if (event === "payment.authorized") {
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "pending",
        paymentId: razorpayPaymentId ?? order.paymentId,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
