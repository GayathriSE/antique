"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validations/auth";
import { forgotPassword } from "@/actions/auth";

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setIsLoading(true);
    const result = await forgotPassword(data);
    setIsLoading(false);
    if (result.success) {
      setMessage(result.message || "Reset link sent!");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Forgot Password</h2>
        <p className="text-stone-500 mt-1 text-sm">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      {message ? (
        <div className="text-center space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {message}
          </div>
          <Link href="/login" className="text-amber-700 hover:underline text-sm font-medium">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-stone-800"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-stone-500">
            <Link href="/login" className="text-amber-700 hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
