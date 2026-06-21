"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import { registerUser } from "@/actions/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    setServerError("");
    const result = await registerUser(data);
    setIsLoading(false);

    if (!result.success) {
      setServerError(result.error);
    } else {
      router.push("/login?registered=1");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Create Account</h2>
        <p className="text-stone-500 mt-1 text-sm">Join Jewels Antique today</p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
          <input
            {...register("name")}
            type="text"
            placeholder="Jane Doe"
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-stone-800"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-stone-800"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-stone-800"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Re-enter password"
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
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-stone-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-amber-700 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
