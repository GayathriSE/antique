"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@prisma/client";
import { productSchema, type ProductInput } from "@/validations/product";
import { createProduct, updateProduct } from "@/actions/admin";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

interface SafeProductFormProps extends Omit<
  Product,
  "price" | "discountPrice"
> {
  price: number;
  discountPrice: number | null;
}

interface Props {
  categories: Category[];
  product?: SafeProductFormProps | null;
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images || []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: Number(product.price),
          discountPrice: product.discountPrice
            ? Number(product.discountPrice)
            : undefined,
          categoryId: product.categoryId,
          stock: product.stock,
          weight: product.weight || "",
          material: product.material || "",
          isFeatured: product.isFeatured,
          seoTitle: product.seoTitle || "",
          seoDescription: product.seoDescription || "",
          images: product.images,
        }
      : { isFeatured: false, stock: 0, images: [] },
  });

  async function onSubmit(data: ProductInput) {
    setIsLoading(true);
    const formData = { ...data, images };

    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    setIsLoading(false);

    if (result.success) {
      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin/products");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
        <h2 className="font-semibold text-stone-800">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Product Name
          </label>
          <input
            {...register("name")}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Price (₹)
            </label>
            <input
              {...register("price")}
              type="number"
              step="0.01"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Discount Price (₹) — optional
            </label>
            <input
              {...register("discountPrice")}
              type="number"
              step="0.01"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Category
            </label>
            <select
              {...register("categoryId")}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Stock
            </label>
            <input
              {...register("stock")}
              type="number"
              min="0"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-600">
                {errors.stock.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Weight
            </label>
            <input
              {...register("weight")}
              placeholder="e.g. 18g"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Material
            </label>
            <input
              {...register("material")}
              placeholder="e.g. 22K Gold, Kundan"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            {...register("isFeatured")}
            type="checkbox"
            id="isFeatured"
            className="w-4 h-4 text-amber-700 rounded"
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium text-stone-700"
          >
            Feature this product on homepage
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Product Images</h2>
        <ImageUpload
          images={images}
          onChange={(imgs) => {
            setImages(imgs);
            setValue("images", imgs);
          }}
        />
        {errors.images && (
          <p className="mt-1 text-xs text-red-600">{errors.images.message}</p>
        )}
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-800">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            SEO Title{" "}
            <span className="text-stone-400 font-normal">(max 60 chars)</span>
          </label>
          <input
            {...register("seoTitle")}
            maxLength={60}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            SEO Description{" "}
            <span className="text-stone-400 font-normal">(max 160 chars)</span>
          </label>
          <textarea
            {...register("seoDescription")}
            maxLength={160}
            rows={3}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors"
        >
          {isLoading
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-2.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
