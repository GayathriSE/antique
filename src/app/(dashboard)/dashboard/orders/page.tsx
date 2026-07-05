import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/actions/order";
import { ORDER_STATUSES } from "@/constants";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const orders = await getUserOrders();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg">No orders yet.</p>
          <Link
            href="/products"
            className="text-amber-700 hover:underline text-sm mt-2 block"
          >
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const status = ORDER_STATUSES.find((s) => s.value === order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-stone-50">
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : order.status === "SHIPPED"
                              ? "bg-purple-100 text-purple-700"
                              : order.status === "PROCESSING"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status?.label}
                    </span>
                    <span className="text-sm font-bold text-stone-900">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </span>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-xs bg-amber-700 text-white hover:bg-amber-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
                <div className="px-5 py-3 flex gap-4 overflow-x-auto">
                  {order.items.slice(0, 4).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 shrink-0"
                    >
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="text-xs text-stone-800 font-medium line-clamp-1 max-w-[120px]">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          ×{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <span className="text-xs text-stone-400 self-center">
                      +{order.items.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
