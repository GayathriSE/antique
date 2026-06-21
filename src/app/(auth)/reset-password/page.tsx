import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Jewels Antique",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  if (!searchParams.token) {
    return (
      <div className="w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-600">Invalid Link</h2>
        <p className="text-stone-600 mt-2">This password reset link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <ResetPasswordForm token={searchParams.token} />
    </div>
  );
}
