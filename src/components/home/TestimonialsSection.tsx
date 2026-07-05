const testimonials = [
  {
    name: "Priya Mehta",
    location: "Mumbai",
    rating: 5,
    text: "The Mughal Kundan ring I purchased is absolutely breathtaking. The craftsmanship is unmatched and the authenticity certificate gave me complete confidence. A true heirloom.",
    avatar: "PM",
  },
  {
    name: "Sarah Thompson",
    location: "London",
    rating: 5,
    text: "I've been collecting antique jewellery for 20 years and Jewels Antique has the most curated selection I've seen. The Victorian necklace arrived beautifully packaged with detailed provenance.",
    avatar: "ST",
  },
  {
    name: "Rajesh Sharma",
    location: "Delhi",
    rating: 5,
    text: "Gifted my wife the temple jewellery haar for our anniversary. The team helped me choose the perfect piece and it arrived exactly as described. She was moved to tears.",
    avatar: "RS",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase font-medium mb-3">Stories</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">From Our Collectors</h2>
          <div className="mt-4 flex justify-center">
            <div className="h-px w-16 bg-amber-400/40" />
            <div className="mx-3 text-amber-400/60">✦</div>
            <div className="h-px w-16 bg-amber-400/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-stone-800/60 border border-stone-700 rounded-2xl p-8 hover:border-amber-400/40 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-stone-300 leading-relaxed text-sm italic mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-stone-500 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
