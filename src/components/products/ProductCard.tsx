"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import type { SafeProductWithCategory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: SafeProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const displayPrice = product.discountPrice ?? product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discount = originalPrice
    ? Math.round((1 - Number(displayPrice) / Number(originalPrice)) * 100)
    : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: Number(displayPrice),
      image: product.images[0] || "",
      slug: product.slug,
      stock: product.stock,
    });
    toast.success("Added to cart", { description: product.name });
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 hover:border-amber-200">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-stone-50">
          {!imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0] || "/placeholder-jewel.jpg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFeatured && (
              <span className="bg-amber-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}
            {discount && (
              <span className="bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-stone-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick add button */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 bg-white/90 hover:bg-amber-700 hover:text-white text-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[11px] text-amber-700 font-medium uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
          <h3 className="text-sm font-semibold text-stone-800 leading-tight line-clamp-2 mb-2 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
          {product.material && (
            <p className="text-xs text-stone-500 mb-2 line-clamp-1">
              {product.material}
            </p>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900">
              ₹{Number(displayPrice).toLocaleString("en-IN")}
            </span>
            {originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{Number(originalPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}
