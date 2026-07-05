"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCartStore } from "@/store/cart";
import { addressSchema, type AddressInput } from "@/validations/checkout";
import { createRazorpayOrder, verifyPayment } from "@/actions/order";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, TAX_RATE, INDIAN_STATES } from "@/constants";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({ resolver: zodResolver(addressSchema) });

  async function onSubmit(address: AddressInput) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    const result = await createRazorpayOrder(
      items.map((i) => ({ id: i.id, quantity: i.quantity })),
      address
    );

    if (!result.success) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    const { razorpayOrderId, amount, currency, orderId } = result.data!;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "Jewels Antique",
      description: "Antique Jewellery Purchase",
      order_id: razorpayOrderId,
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        const verify = await verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          orderId
        );

        if (verify.success) {
          clearCart();
          toast.success("Payment successful! Your order has been placed.");
          router.push(`/dashboard/orders/${orderId}`);
        } else {
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      prefill: { name: address.name, contact: address.phone },
      theme: { color: "#92400e" },
      modal: { ondismiss: () => setIsLoading(false) },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setIsLoading(false);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-600 mb-4">Your cart is empty.</p>
        <button onClick={() => router.push("/products")} className="text-amber-700 hover:underline">
          Browse Collections
        </button>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-bold text-stone-800 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Shipping form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-stone-200 p-6">
                <h2 className="font-semibold text-stone-800 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                    <input {...register("name")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                    <input {...register("phone")} placeholder="10-digit mobile" className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Address Line 1</label>
                    <input {...register("line1")} placeholder="Street, House no." className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    {errors.line1 && <p className="mt-1 text-xs text-red-600">{errors.line1.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Address Line 2 (optional)</label>
                    <input {...register("line2")} placeholder="Apartment, landmark" className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
                    <input {...register("city")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
                    <select {...register("state")} className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">PIN Code</label>
                    <input {...register("postalCode")} placeholder="6-digit PIN" className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Country</label>
                    <input {...register("country")} defaultValue="India" readOnly className="w-full px-4 py-2.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 h-fit">
              <h2 className="font-semibold text-stone-800 mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image || "/placeholder-jewel.jpg"} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-stone-800">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-300 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-stone-600"><span>Shipping</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-stone-600"><span>GST (18%)</span><span>₹{tax.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between font-bold text-stone-900 text-base border-t border-stone-300 pt-2">
                  <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isLoading ? "Processing..." : `Pay ₹${total.toLocaleString("en-IN")}`}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secured by Razorpay
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
