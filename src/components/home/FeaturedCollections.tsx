import Link from "next/link";
import { db } from "@/lib/db";

async function getCategories() {
  try {
    return await db.category.findMany({ take: 5, orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

const categoryImages: Record<string, string> = {
  necklaces: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
  rings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
  earrings: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
  bracelets: "https://images.unsplash.com/photo-1573408301185-9519f94815b7?w=600&q=80",
  brooches: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
};

export default async function FeaturedCollections() {
  const categories = await getCategories();

  return (
    <section className="py-20 bg-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-amber-700 text-xs tracking-[0.4em] uppercase font-medium mb-3">Our</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-800">Collections</h2>
          <div className="mt-4 flex justify-center">
            <div className="h-px w-16 bg-amber-400" />
            <div className="mx-3 text-amber-400">✦</div>
            <div className="h-px w-16 bg-amber-400" />
          </div>
          <p className="text-stone-600 mt-6 max-w-xl mx-auto">
            From Mughal Kundan to Victorian filigree — explore our curated categories of antique jewellery.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-md hover:shadow-xl transition-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={categoryImages[cat.slug] || categoryImages.necklaces}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-serif font-semibold text-lg">{cat.name}</h3>
                <p className="text-xs text-amber-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View all →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
