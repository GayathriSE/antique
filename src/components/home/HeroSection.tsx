import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-950/80" />

      {/* Decorative gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Pre-heading */}
        <p className="text-amber-400 text-xs tracking-[0.5em] uppercase font-medium mb-6">
          Since 1895 · Curated Heirlooms
        </p>

        {/* Main heading */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Where History
          <br />
          <span className="text-amber-400">Meets Beauty</span>
        </h1>

        {/* Subtitle */}
        <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Discover rare antique jewellery from Mughal courts, Victorian England, and Art Deco Paris.
          Each piece carries centuries of craftsmanship and stories untold.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/25 text-sm tracking-wide uppercase"
          >
            Explore Collections
          </Link>
          <Link
            href="/#about"
            className="border border-amber-400/60 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-semibold px-8 py-4 rounded-lg transition-all duration-300 text-sm tracking-wide uppercase backdrop-blur-sm"
          >
            Our Story
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { num: "500+", label: "Rare Pieces" },
            { num: "130", label: "Years Legacy" },
            { num: "50+", label: "Categories" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-amber-400 font-serif">{s.num}</p>
              <p className="text-xs text-stone-400 tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
