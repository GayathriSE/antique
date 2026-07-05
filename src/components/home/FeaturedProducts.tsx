import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getFeaturedProducts } from "@/services/product.service";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-amber-700 text-xs tracking-[0.4em] uppercase font-medium mb-2">
              Handpicked
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-800">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-2 text-amber-700 font-medium hover:text-amber-800 transition-colors text-sm"
          >
            View all
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-stone-500 text-center py-16">
            No featured products yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-amber-700 text-amber-700 font-semibold px-6 py-3 rounded-lg hover:bg-amber-700 hover:text-white transition-colors"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
