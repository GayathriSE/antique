import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalOrders, totalProducts, totalCustomers, recentOrders] = await Promise.all([
    db.order.count(),
    db.product.count(),
    db.user.count({ where: { role: "USER" } }),
    db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: true, items: true },
    }),
  ]);

  const revenue = await db.order.aggregate({
    where: { paymentStatus: "paid" },
    _sum: { total: true },
  });

  const totalRevenue = Number(revenue._sum.total || 0);

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰", color: "bg-amber-50 border-amber-200" },
    { label: "Total Orders", value: totalOrders, icon: "📦", color: "bg-blue-50 border-blue-200" },
    { label: "Total Products", value: totalProducts, icon: "💎", color: "bg-purple-50 border-purple-200" },
    { label: "Total Customers", value: totalCustomers, icon: "👥", color: "bg-green-50 border-green-200" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.color}`}>
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
          <Link href="/admin/orders" className="text-sm text-amber-700 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Order ID</th>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Items</th>
                <th className="px-5 py-3 text-left font-medium">Total</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((order:any) => (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3 font-mono text-xs text-stone-600">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-stone-800">{order.user.name}</p>
                    <p className="text-xs text-stone-500">{order.user.email}</p>
                  </td>
                  <td className="px-5 py-3 text-stone-600">{order.items.length}</td>
                  <td className="px-5 py-3 font-semibold text-stone-800">₹{Number(order.total).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      order.status === "SHIPPED" ? "bg-purple-100 text-purple-700" :
                      order.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3 text-stone-500 text-xs">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-amber-700 hover:underline text-xs">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
