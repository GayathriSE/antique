"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryInput } from "@/validations/product";
import { createCategory, deleteCategory } from "@/actions/admin";
import { toast } from "sonner";
import type { Category } from "@prisma/client";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/categories");
    if (!res.ok) {
      setCategories([]);
      return;
    }
    const data = (await res.json()) as Category[];
    setCategories(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: CategoryInput) {
    setIsLoading(true);
    const result = await createCategory(data);
    setIsLoading(false);

    if (result.success) {
      toast.success("Category created");
      reset();
      refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteCategory(id);
    if (result.success) {
      toast.success("Category deleted");
      refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add form */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-800 mb-5">Add Category</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Name
              </label>
              <input
                {...register("name")}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Image URL (optional)
              </label>
              <input
                {...register("image")}
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              {isLoading ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <h2 className="font-semibold text-stone-800 px-5 py-4 border-b border-stone-100">
            All Categories
          </h2>
          {categories.length === 0 ? (
            <p className="text-center py-10 text-stone-400 text-sm">
              No categories yet.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      {cat.name}
                    </p>
                    <p className="text-xs text-stone-500 font-mono">
                      {cat.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
