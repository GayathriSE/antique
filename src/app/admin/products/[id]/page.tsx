import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { serializeProduct } from "@/services/product.service";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;

  if (!id) {
    // defensive: if params.id is missing, return 404 rather than calling Prisma with undefined
    notFound();
  }

  const product = await db.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) notFound();

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Edit Product</h1>
      <ProductForm
        categories={categories}
        product={serializeProduct(product)}
      />
    </div>
  );
}
