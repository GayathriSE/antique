import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { ORDER_STATUSES } from "@/constants";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [orders, addressCount] = await Promise.all([
    db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    db.address.count({ where: { userId } }),
  ]);

  const totalSpent = orders
    .filter((o:any) => o.paymentStatus === "paid")
    .reduce((s:any, o:any) => s + Number(o.total), 0);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-8">My Account</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Orders", value: orders.length, icon: "📦" },
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: "💰" },
          { label: "Addresses", value: addressCount, icon: "📍" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-5">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold text-stone-800 mt-2">{s.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-amber-700 hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <p>No orders yet.</p>
            <Link href="/products" className="text-amber-700 hover:underline text-sm mt-2 block">Browse Collections</Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {orders.map((order:any) => {
              const status = ORDER_STATUSES.find((s) => s.value === order.status);
              return (
                <div key={order.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      order.status === "SHIPPED" ? "bg-purple-100 text-purple-700" :
                      order.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {status?.label}
                    </span>
                    <span className="text-sm font-bold text-stone-900">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </span>
                    <Link href={`/dashboard/orders/${order.id}`} className="text-xs text-amber-700 hover:underline">
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
