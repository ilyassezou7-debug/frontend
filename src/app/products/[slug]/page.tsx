import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, PRODUCTS } from "@/config/products";
import ProductPageClient from "./ProductPageClient";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.displayName,
    description: `${product.headline} – مكونات طبيعية، الدفع عند الاستلام، توصيل مجاني.`,
    openGraph: {
      title: product.displayName,
      description: product.subheading,
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductPageClient product={product!} />;
}
