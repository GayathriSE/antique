import type { Metadata } from "next";
import { Suspense } from "react";
import ProductCard, { ProductCardSkeleton } from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import ProductPagination from "@/components/products/ProductPagination";
import SortSelect from "@/components/products/SortSelect";
import { getProducts, getCategories } from "@/services/product.service";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our complete collection of rare antique jewellery.",
};

interface PageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;

  let products: Awaited<ReturnType<typeof getProducts>>["data"] = [];
  let total = 0, totalPages = 0, hasNext = false, hasPrev = false;
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    const result = await getProducts({
      category: searchParams.category,
      search: searchParams.search,
      sort: (searchParams.sort as "newest" | "price_asc" | "price_desc") || "newest",
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      page,
      limit: 12,
    });
    products = result.data;
    total = result.total;
    totalPages = result.totalPages;
    hasNext = result.hasNext;
    hasPrev = result.hasPrev;
    categories = await getCategories();
  } catch {
    // DB not connected yet — show empty state
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-stone-800">Collections</h1>
        <p className="text-stone-500 mt-2">
          {total} {total === 1 ? "piece" : "pieces"} found
          {searchParams.category && ` in ${searchParams.category}`}
          {searchParams.search && ` for "${searchParams.search}"`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0">
          <ProductFilters categories={categories} />
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-stone-500">Page {page} of {totalPages || 1}</p>
            <Suspense>
              <SortSelect current={searchParams.sort} />
            </Suspense>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24 text-stone-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium">No pieces found</p>
              <p className="text-sm mt-1">
                {total === 0 ? "Connect your database and seed data to see products." : "Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10">
              <ProductPagination page={page} totalPages={totalPages} hasNext={hasNext} hasPrev={hasPrev} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
