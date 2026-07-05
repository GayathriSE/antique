import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
