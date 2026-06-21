import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 flex flex-col">
      <header className="py-6 px-4 text-center border-b border-amber-100">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-serif font-bold text-amber-800 tracking-widest uppercase">
            Jewels Antique
          </h1>
          <p className="text-xs text-amber-600 tracking-[0.3em] mt-0.5">Est. 1895</p>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">{children}</main>
      <footer className="py-4 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Jewels Antique. All rights reserved.
      </footer>
    </div>
  );
}
