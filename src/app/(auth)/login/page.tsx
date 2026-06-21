import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Jewels Antique",
  description: "Sign in to your Jewels Antique account.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  return (
    <div className="w-full max-w-md">
      <LoginForm
        callbackUrl={searchParams.callbackUrl}
        error={searchParams.error}
      />
    </div>
  );
}
