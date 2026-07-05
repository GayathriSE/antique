"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE } from "@/constants";

export default function CartPageClient() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <svg className="w-20 h-20 mx-auto text-stone-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="font-serif text-3xl font-bold text-stone-800 mb-3">Your cart is empty</h1>
        <p className="text-stone-500 mb-8">Discover our exquisite collection of antique jewellery.</p>
        <Link
          href="/products"
          className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
              <Link href={`/products/${item.slug}`} className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image || "/placeholder-jewel.jpg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="text-sm font-semibold text-stone-800 hover:text-amber-700 line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-stone-600 mt-1">
                  ₹{item.price.toLocaleString("en-IN")} each
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-stone-100 text-stone-700 text-sm"
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium border-x border-stone-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-stone-100 text-stone-700 text-sm"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-stone-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 h-fit">
          <h2 className="font-semibold text-stone-800 mb-5">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                {shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>
            <div className="border-t border-stone-300 pt-3 flex justify-between font-bold text-stone-900 text-base">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mt-4">
              Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("en-IN")} more for free shipping!
            </p>
          )}

          <Link
            href="/checkout"
            className="block w-full mt-6 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-xl text-center transition-colors"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="block w-full mt-3 text-center text-sm text-stone-600 hover:text-amber-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
