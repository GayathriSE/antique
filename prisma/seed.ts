import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@jewelsantique.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@jewelsantique.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Demo customer
  const userPassword = await bcrypt.hash("User@123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Jane Doe",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Demo user:", user.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "necklaces" },
      update: {},
      create: {
        name: "Necklaces",
        slug: "necklaces",
        description: "Exquisite antique necklaces",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables",
      },
    }),
    prisma.category.upsert({
      where: { slug: "rings" },
      update: {},
      create: {
        name: "Rings",
        slug: "rings",
        description: "Timeless antique rings",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables",
      },
    }),
    prisma.category.upsert({
      where: { slug: "earrings" },
      update: {},
      create: {
        name: "Earrings",
        slug: "earrings",
        description: "Elegant antique earrings",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables",
      },
    }),
    prisma.category.upsert({
      where: { slug: "bracelets" },
      update: {},
      create: {
        name: "Bracelets",
        slug: "bracelets",
        description: "Stunning antique bracelets",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables",
      },
    }),
    prisma.category.upsert({
      where: { slug: "brooches" },
      update: {},
      create: {
        name: "Brooches",
        slug: "brooches",
        description: "Rare antique brooches",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables",
      },
    }),
  ]);
  console.log("✅ Categories created:", categories.length);

  // Products
  const productData = [
    {
      name: "Victorian Gold Filigree Necklace",
      slug: "victorian-gold-filigree-necklace",
      description:
        "A breathtaking Victorian-era gold filigree necklace featuring intricate lacework patterns and a central garnet pendant. Crafted circa 1880, this piece exemplifies the romantic opulence of the period.",
      price: 45000,
      discountPrice: 39999,
      categorySlug: "necklaces",
      stock: 3,
      weight: "18g",
      material: "22K Gold, Garnet",
      isFeatured: true,
    },
    {
      name: "Mughal Kundan Ring",
      slug: "mughal-kundan-ring",
      description:
        "An authentic Mughal-period Kundan ring set with uncut diamonds and precious gemstones. The traditional foiling technique creates an ethereal glow that is timeless.",
      price: 85000,
      discountPrice: null,
      categorySlug: "rings",
      stock: 2,
      weight: "12g",
      material: "24K Gold, Kundan, Diamonds",
      isFeatured: true,
    },
    {
      name: "Art Deco Pearl Drop Earrings",
      slug: "art-deco-pearl-drop-earrings",
      description:
        "Stunning 1920s Art Deco earrings featuring South Sea pearls suspended from geometric platinum settings adorned with old-cut diamonds.",
      price: 32000,
      discountPrice: 28500,
      categorySlug: "earrings",
      stock: 5,
      weight: "8g",
      material: "Platinum, South Sea Pearls, Diamonds",
      isFeatured: true,
    },
    {
      name: "Edwardian Diamond Tennis Bracelet",
      slug: "edwardian-diamond-tennis-bracelet",
      description:
        "A magnificent Edwardian-era bracelet featuring a continuous line of old European-cut diamonds set in platinum-topped 18K gold.",
      price: 125000,
      discountPrice: null,
      categorySlug: "bracelets",
      stock: 1,
      weight: "22g",
      material: "18K Gold, Platinum, Diamonds",
      isFeatured: true,
    },
    {
      name: "Renaissance Revival Enamel Brooch",
      slug: "renaissance-revival-enamel-brooch",
      description:
        "A remarkable 19th-century Renaissance Revival brooch in gold with polychrome enamel depicting classical figures, seed pearls, and rose-cut diamonds.",
      price: 28000,
      discountPrice: 24999,
      categorySlug: "brooches",
      stock: 4,
      weight: "15g",
      material: "18K Gold, Enamel, Pearls, Rose-cut Diamonds",
      isFeatured: false,
    },
    {
      name: "Temple Jewellery Haar",
      slug: "temple-jewellery-haar",
      description:
        "Traditional South Indian temple jewellery necklace with detailed depictions of deities and celestial motifs, crafted in 22K gold with rubies and emeralds.",
      price: 95000,
      discountPrice: 89999,
      categorySlug: "necklaces",
      stock: 2,
      weight: "85g",
      material: "22K Gold, Rubies, Emeralds",
      isFeatured: true,
    },
    {
      name: "Georgian Seed Pearl Cluster Ring",
      slug: "georgian-seed-pearl-cluster-ring",
      description:
        "A delicate Georgian-era ring featuring a central rose-cut diamond surrounded by natural seed pearls, set in silver-topped gold.",
      price: 18500,
      discountPrice: 16000,
      categorySlug: "rings",
      stock: 6,
      weight: "5g",
      material: "Silver, Gold, Seed Pearls, Rose Diamond",
      isFeatured: false,
    },
    {
      name: "Jadau Polki Jhumkas",
      slug: "jadau-polki-jhumkas",
      description:
        "Exquisite Rajasthani Jadau Jhumkas with uncut Polki diamonds, emeralds, and rubies set in the traditional style with meenakari back work.",
      price: 42000,
      discountPrice: 38000,
      categorySlug: "earrings",
      stock: 4,
      weight: "30g",
      material: "22K Gold, Polki Diamonds, Emeralds, Rubies, Meenakari",
      isFeatured: true,
    },
  ];

  for (const p of productData) {
    const category = categories.find((c) => c.slug === p.categorySlug)!;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        images: [
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
          "https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=800",
        ],
        categoryId: category.id,
        stock: p.stock,
        weight: p.weight,
        material: p.material,
        isFeatured: p.isFeatured,
        seoTitle: p.name + " | Jewels Antique",
        seoDescription: p.description.slice(0, 160),
      },
    });
  }
  console.log("✅ Products seeded:", productData.length);

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
