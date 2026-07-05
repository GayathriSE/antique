import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/actions/order";
import { ORDER_STATUSES } from "@/constants";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) notFound();

  const status = ORDER_STATUSES.find((s) => s.value === order.status);
  const address = order.shippingAddress as Record<string, string>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/orders" className="text-amber-700 hover:underline text-sm">← Orders</Link>
        <h1 className="font-serif text-2xl font-bold text-stone-800">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
          order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
          order.status === "SHIPPED" ? "bg-purple-100 text-purple-700" :
          order.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
          "bg-yellow-100 text-yellow-700"
        }`}>{status?.label}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <h2 className="font-semibold text-stone-800 px-5 py-4 border-b border-stone-100">Items</h2>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800">{item.name}</p>
                  <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-stone-100 space-y-1 text-sm">
            <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-stone-600"><span>Shipping</span><span>₹{Number(order.shippingCost).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-stone-600"><span>Tax</span><span>₹{Number(order.tax).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between font-bold text-stone-900 text-base pt-1 border-t border-stone-200 mt-1">
              <span>Total</span><span>₹{Number(order.total).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Shipping & payment */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-semibold text-stone-800 mb-4">Shipping Address</h2>
            <div className="text-sm text-stone-600 space-y-1">
              <p className="font-medium text-stone-800">{address.name}</p>
              <p>{address.phone}</p>
              <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
              <p>{address.city}, {address.state} {address.postalCode}</p>
              <p>{address.country}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-semibold text-stone-800 mb-4">Payment</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-stone-500">Status</span><span className={`font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>{order.paymentStatus === "paid" ? "Paid" : "Pending"}</span></div>
              {order.paymentId && <div className="flex justify-between"><span className="text-stone-500">Payment ID</span><span className="text-stone-700 text-xs font-mono">{order.paymentId}</span></div>}
              <div className="flex justify-between"><span className="text-stone-500">Order Date</span><span className="text-stone-700">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
