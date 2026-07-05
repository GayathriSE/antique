import { getAdminCustomers } from "@/actions/admin";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Customers ({customers.length})</h1>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Email</th>
                <th className="px-5 py-3 text-left font-medium">Orders</th>
                <th className="px-5 py-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customers.map((customer:any) => (
                <tr key={customer.id} className="hover:bg-stone-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-semibold text-xs">
                        {customer.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-stone-800">{customer.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-stone-600">{customer.email}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-stone-800">{customer._count.orders}</span>
                  </td>
                  <td className="px-5 py-4 text-stone-500 text-xs">
                    {new Date(customer.createdAt).toLocaleDateString("en-IN")}
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
