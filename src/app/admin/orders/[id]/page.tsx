import { notFound } from "next/navigation";
import { getAdminOrderById } from "@/actions/admin";
import AdminOrderStatusUpdate from "@/components/admin/AdminOrderStatusUpdate";
import { ORDER_STATUSES } from "@/constants";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getAdminOrderById(params.id);
  if (!order) notFound();

  const address = order.shippingAddress as Record<string, string>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Order #{order.id.slice(-8).toUpperCase()}</h1>
      <p className="text-stone-500 text-sm mb-8">{new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: items */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <h2 className="font-semibold text-stone-800 px-5 py-4 border-b border-stone-100">Order Items</h2>
            <div className="divide-y divide-stone-100">
              {order.items.map((item:any) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-800">{item.name}</p>
                    <p className="text-xs text-stone-500">Qty: {item.quantity} · ₹{Number(item.price).toLocaleString("en-IN")} each</p>
                  </div>
                  <p className="text-sm font-semibold">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-stone-100 space-y-1 text-sm">
              <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-stone-600"><span>Shipping</span><span>₹{Number(order.shippingCost).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-stone-600"><span>Tax</span><span>₹{Number(order.tax).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between font-bold text-stone-900 text-base border-t border-stone-200 pt-1 mt-1">
                <span>Total</span><span>₹{Number(order.total).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: management */}
        <div className="space-y-4">
          {/* Status update */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-semibold text-stone-800 mb-4">Update Status</h2>
            <AdminOrderStatusUpdate orderId={order.id} currentStatus={order.status} statuses={ORDER_STATUSES} />
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-semibold text-stone-800 mb-4">Customer</h2>
            <p className="text-sm text-stone-800 font-medium">{order.user.name}</p>
            <p className="text-xs text-stone-500">{order.user.email}</p>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-semibold text-stone-800 mb-4">Shipping Address</h2>
            <div className="text-sm text-stone-600 space-y-0.5">
              <p className="font-medium text-stone-800">{address.name}</p>
              <p>{address.phone}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}, {address.state} {address.postalCode}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h2 className="font-semibold text-stone-800 mb-4">Payment</h2>
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span className="text-stone-500">Status</span><span className={`font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>{order.paymentStatus}</span></div>
              {order.paymentId && <div className="flex justify-between"><span className="text-stone-500">ID</span><span className="text-xs font-mono text-stone-700">{order.paymentId}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
