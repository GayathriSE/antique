"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import type { SafeProductWithReviews } from "@/types";

interface Props {
  product: SafeProductWithReviews;
}

export default function ProductDetail({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const displayPrice = product.discountPrice ?? product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discount = originalPrice
    ? Math.round((1 - Number(displayPrice) / Number(originalPrice)) * 100)
    : null;

  function handleAddToCart() {
    if (product.stock <= 0) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(displayPrice),
        image: product.images[0] || "",
        slug: product.slug,
        stock: product.stock,
      });
    }
    toast.success("Added to cart", {
      description: `${quantity}× ${product.name}`,
    });
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-xs text-stone-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-700">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-700">
          Collections
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-amber-700"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-stone-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[selectedImage] || "/placeholder-jewel.jpg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-amber-600"
                      : "border-stone-200"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <p className="text-xs text-amber-700 font-semibold uppercase tracking-widest mb-2">
            {product.category.name}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(avgRating)
                        ? "text-amber-400"
                        : "text-stone-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-stone-500">
                ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-stone-900">
              ₹{Number(displayPrice).toLocaleString("en-IN")}
            </span>
            {originalPrice && (
              <span className="text-lg text-stone-400 line-through">
                ₹{Number(originalPrice).toLocaleString("en-IN")}
              </span>
            )}
            {discount && (
              <span className="bg-red-100 text-red-700 text-sm font-semibold px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Specifications */}
          <div className="border border-stone-200 rounded-xl p-5 mb-6 space-y-3">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Specifications
            </h3>
            {[
              { label: "Material", value: product.material },
              { label: "Weight", value: product.weight },
              {
                label: "Stock",
                value:
                  product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock",
              },
            ]
              .filter((s) => s.value)
              .map((s) => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-stone-500">{s.label}</span>
                  <span className="text-stone-800 font-medium">{s.value}</span>
                </div>
              ))}
          </div>

          {/* Quantity + Add to cart */}
          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-stone-700">
                  Quantity
                </span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-stone-100 transition-colors text-stone-700"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold border-x border-stone-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="px-3 py-2 hover:bg-stone-100 transition-colors text-stone-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Add to Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white font-semibold py-3 rounded-xl text-center transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-stone-200 text-stone-500 font-semibold py-3 rounded-xl cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}

          {/* Trust badges */}
          <div className="mt-6 flex gap-6 text-xs text-stone-500">
            <span>🔒 Secure payment</span>
            <span>📦 Insured shipping</span>
            <span>✅ Authenticated</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 border-t border-stone-200 pt-10">
        <h2 className="font-serif text-2xl font-bold text-stone-800 mb-4">
          About this Piece
        </h2>
        <p className="text-stone-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="mt-12 border-t border-stone-200 pt-10">
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">
            Reviews ({product.reviews.length})
          </h2>
          <div className="space-y-6">
            {product.reviews.map((r) => (
              <div
                key={r.id}
                className="border border-stone-100 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-semibold text-sm">
                    {r.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      {r.user.name}
                    </p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < r.rating
                              ? "text-amber-400 text-xs"
                              : "text-stone-200 text-xs"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-stone-600">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
