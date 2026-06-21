import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Jewels Antique",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <ForgotPasswordForm />
    </div>
  );
}
