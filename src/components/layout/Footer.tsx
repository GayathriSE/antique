import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-serif font-bold text-amber-400 tracking-widest uppercase">
              Jewels Antique
            </h3>
            <p className="text-xs text-amber-500/70 tracking-[0.3em] mt-0.5 mb-4">Est. 1895</p>
            <p className="text-sm leading-relaxed text-stone-400">
              Curators of rare and exquisite antique jewellery from across the centuries. Each piece tells a timeless story.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Collections</h4>
            <ul className="space-y-2">
              {["Necklaces","Rings","Earrings","Bracelets","Brooches"].map((c) => (
                <li key={c}>
                  <Link
                    href={`/products?category=${c.toLowerCase()}`}
                    className="text-sm text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2">
              {[
                { href: "/login", label: "Sign In" },
                { href: "/register", label: "Create Account" },
                { href: "/dashboard", label: "My Orders" },
                { href: "/dashboard/profile", label: "Profile" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-stone-400 hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>📍 12 Heritage Lane, Mumbai, India</li>
              <li>📞 +91 98765 43210</li>
              <li>✉️ hello@jewelsantique.com</li>
              <li className="pt-2">
                <p className="text-xs text-stone-500">Mon–Sat 10am – 7pm IST</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Jewels Antique. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-amber-400 transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
