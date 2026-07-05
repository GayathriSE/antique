"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Category } from "@prisma/client";

interface ProductFiltersProps {
  categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const activeCategory = searchParams.get("category");
  const activeMin = searchParams.get("minPrice");
  const activeMax = searchParams.get("maxPrice");

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters = activeCategory || activeMin || activeMax || searchParams.get("search");

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Search</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
            setParam("search", q);
          }}
        >
          <div className="flex gap-2">
            <input
              name="search"
              defaultValue={searchParams.get("search") || ""}
              placeholder="Search jewellery..."
              className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button type="submit" className="px-3 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Category</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setParam("category", null)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                !activeCategory
                  ? "bg-amber-700 text-white"
                  : "text-stone-700 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              All Collections
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setParam("category", cat.slug)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-amber-700 text-white"
                    : "text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider mb-3">Price (₹)</h3>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            const min = (e.currentTarget.elements.namedItem("min") as HTMLInputElement).value;
            const max = (e.currentTarget.elements.namedItem("max") as HTMLInputElement).value;
            setParam("minPrice", min);
            setParam("maxPrice", max);
          }}
        >
          <input
            name="min"
            type="number"
            defaultValue={activeMin || ""}
            placeholder="Min price"
            className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            name="max"
            type="number"
            defaultValue={activeMax || ""}
            placeholder="Max price"
            className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="w-full text-sm bg-stone-800 text-white py-2 rounded-lg hover:bg-stone-900 transition-colors"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full text-sm text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
