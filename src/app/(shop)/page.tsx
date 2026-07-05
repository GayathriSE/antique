import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import { ProductCardSkeleton } from "@/components/products/ProductCard";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCollections />
      <Suspense
        fallback={
          <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </section>
        }
      >
        <FeaturedProducts />
      </Suspense>
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
