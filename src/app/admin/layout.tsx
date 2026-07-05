import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "💎" },
  { href: "/admin/categories", label: "Categories", icon: "📁" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session?.user || role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-stone-100">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 shrink-0 flex flex-col">
        <div className="px-6 py-6 border-b border-stone-700">
          <h1 className="text-lg font-serif font-bold text-amber-400 tracking-widest uppercase">
            Jewels Admin
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Management Console</p>
        </div>

        <nav className="flex-1 py-4">
          {adminLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-6 py-3 text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-stone-700">
          <p className="text-xs text-stone-500 mb-2">{session.user.email}</p>
          <Link href="/" className="block text-xs text-stone-400 hover:text-amber-400 mb-2">← View Store</Link>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit" className="text-xs text-red-400 hover:text-red-300 transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
