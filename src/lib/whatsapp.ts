interface OrderNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  itemCount: number;
  paymentId: string;
}

export async function sendAdminWhatsAppNotification(order: OrderNotificationData) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE; // e.g. "919876543210" (country code + number, no +)

  if (!phoneNumberId || !accessToken || !adminPhone) {
    console.warn("[WhatsApp] Missing env vars — skipping notification.");
    return;
  }

  const message =
    `🛍️ *New Order Received!*\n\n` +
    `📦 Order ID: #${order.orderId.slice(-8).toUpperCase()}\n` +
    `👤 Customer: ${order.customerName}\n` +
    `📧 Email: ${order.customerEmail}\n` +
    `🛒 Items: ${order.itemCount}\n` +
    `💰 Total: ₹${order.total.toLocaleString("en-IN")}\n` +
    `✅ Payment: ${order.paymentId}\n\n` +
    `View order: ${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: adminPhone,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("[WhatsApp] Failed to send notification:", err);
    } else {
      console.log("[WhatsApp] Admin notification sent successfully.");
    }
  } catch (err) {
    console.error("[WhatsApp] Error sending notification:", err);
  }
}
