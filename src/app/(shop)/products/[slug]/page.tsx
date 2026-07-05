import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/products/ProductDetail";
import ProductCard from "@/components/products/ProductCard";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/services/product.service";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // `params` is an async object in the App Router; await it before using
  const { slug } = (await params) as { slug: string };
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description.slice(0, 160),
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  // `params` is a Promise in this environment; unwrap before accessing properties
  const { slug } = (await params) as { slug: string };
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-bold text-stone-800 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
