export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-amber-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image collage */}
          <div className="relative h-[500px] hidden lg:block">
            <div className="absolute top-0 left-0 w-[60%] h-[65%] rounded-2xl overflow-hidden shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80"
                alt="Antique jewellery craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[55%] h-[55%] rounded-2xl overflow-hidden shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80"
                alt="Gold jewellery collection"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Gold accent badge */}
            <div className="absolute top-[40%] right-[25%] bg-amber-700 text-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-xl z-10">
              <span className="font-serif font-bold text-3xl">130</span>
              <span className="text-[10px] tracking-widest uppercase">Years of</span>
              <span className="text-[10px] tracking-widest uppercase">Legacy</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-amber-700 text-xs tracking-[0.4em] uppercase font-medium mb-3">Our Heritage</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-800 leading-tight mb-6">
              Guardians of
              <br />
              <span className="text-amber-700">Timeless Beauty</span>
            </h2>

            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Founded in 1895 in the heart of Mumbai, Jewels Antique has been preserving and curating exceptional pieces of antique jewellery for over a century. What began as a small atelier serving the Nawabs and Maharajas has grown into one of India&apos;s most trusted destinations for rare jewellery.
              </p>
              <p>
                Each piece in our collection is authenticated by our team of expert gemologists and historians. We source jewellery from estate sales, royal auctions, and private collectors across India, Europe, and the Middle East.
              </p>
              <p>
                From Mughal-era Kundan and Polki to Victorian filigree and Art Deco platinum — our collection spans civilisations and centuries, each piece a tangible link to history.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { icon: "🔍", title: "Authenticated", desc: "Every piece verified by experts" },
                { icon: "📦", title: "Insured Shipping", desc: "Safe delivery guaranteed" },
                { icon: "🏆", title: "Certified", desc: "With provenance documentation" },
              ].map((f) => (
                <div key={f.title} className="text-center">
                  <span className="text-2xl">{f.icon}</span>
                  <p className="text-sm font-semibold text-stone-800 mt-2">{f.title}</p>
                  <p className="text-xs text-stone-500 mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
