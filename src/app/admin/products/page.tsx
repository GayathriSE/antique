import Link from "next/link";
import { db } from "@/lib/db";
import AdminProductActions from "@/components/admin/AdminProductActions";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Products</h1>
        <Link href="/admin/products/new" className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Product</th>
                <th className="px-5 py-3 text-left font-medium">Category</th>
                <th className="px-5 py-3 text-left font-medium">Price</th>
                <th className="px-5 py-3 text-left font-medium">Stock</th>
                <th className="px-5 py-3 text-left font-medium">Featured</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product:any) => (
                <tr key={product.id} className="hover:bg-stone-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-stone-800 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-stone-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-stone-600">{product.category.name}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-stone-800">₹{Number(product.price).toLocaleString("en-IN")}</p>
                    {product.discountPrice && (
                      <p className="text-xs text-stone-400 line-through">₹{Number(product.discountPrice).toLocaleString("en-IN")}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.stock > 0 ? product.stock : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs ${product.isFeatured ? "text-amber-700 font-semibold" : "text-stone-400"}`}>
                      {product.isFeatured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="text-xs text-amber-700 hover:underline">Edit</Link>
                      <AdminProductActions id={product.id} />
                    </div>
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
