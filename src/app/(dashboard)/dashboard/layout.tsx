import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/orders", label: "My Orders", icon: "📦" },
  { href: "/dashboard/addresses", label: "Addresses", icon: "📍" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="bg-amber-700 px-4 py-5">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg mb-2">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <p className="text-white font-semibold text-sm">{session.user.name}</p>
                <p className="text-amber-200 text-xs truncate">{session.user.email}</p>
              </div>
              <nav className="py-2">
                {sidebarLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                  >
                    <span>{l.icon}</span>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
