import Link from "next/link";
import { getAdminOrders } from "@/actions/admin";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Orders ({orders.length})</h1>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Order ID</th>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Total</th>
                <th className="px-5 py-3 text-left font-medium">Payment</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="px-5 py-4 font-mono text-xs text-stone-600">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-stone-800">{order.user.name}</p>
                    <p className="text-xs text-stone-500">{order.user.email}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-stone-800">₹{Number(order.total).toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      order.status === "SHIPPED" ? "bg-purple-100 text-purple-700" :
                      order.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4 text-stone-500 text-xs">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-amber-700 hover:underline text-xs">Manage</Link>
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
