import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/utils/products";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/shop/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Not Found | TEAM FURY" };
  return {
    title: `${product.title} | TEAM FURY`,
    description: product.description,
  };
}

export default async function ProductDetailPage(
  props: PageProps<"/shop/[slug]">
) {
  const { slug } = await props.params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  // Related: same rank or adjacent, exclude current
  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.currentRank === product.currentRank
  ).slice(0, 4);
  const fallback = PRODUCTS.filter(
    (p) => p.id !== product.id && !related.find((r) => r.id === p.id)
  ).slice(0, 4 - related.length);

  return (
    <ProductDetailClient
      product={product}
      related={[...related, ...fallback]}
    />
  );
}
