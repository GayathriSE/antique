import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Jewels Antique",
  description: "Create your Jewels Antique account.",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <RegisterForm />
    </div>
  );
}
