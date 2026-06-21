"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validations/auth";
import { resetPassword } from "@/actions/auth";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordInput) {
    setIsLoading(true);
    setError("");
    const result = await resetPassword(token, data);
    setIsLoading(false);

    if (result.success) {
      setMessage(result.message || "Password reset!");
    } else {
      setError(result.error);
    }
  }

  if (message) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100 text-center space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {message}
        </div>
        <Link href="/login" className="block text-amber-700 hover:underline text-sm font-medium">
          Sign in with new password
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Reset Password</h2>
        <p className="text-stone-500 mt-1 text-sm">Enter your new password below.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">New Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-stone-800"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Re-enter new password"
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-stone-800"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
