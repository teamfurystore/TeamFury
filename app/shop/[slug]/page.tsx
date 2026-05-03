import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type DbProduct } from "@/features/products/productsSlice";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

async function getActiveProducts(): Promise<DbProduct[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/shop/products`, {
      next: { revalidate: 60 }, // ISR — revalidate every 60s
    });
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/shop/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const products = await getActiveProducts();
  const product = products.find((p) => p.slug === slug);
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
  const products = await getActiveProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  // Related: same rank first, then fill with others
  const sameRank = products.filter(
    (p) => p.id !== product.id && p.current_rank === product.current_rank
  ).slice(0, 4);
  const others = products
    .filter((p) => p.id !== product.id && !sameRank.find((r) => r.id === p.id))
    .slice(0, 4 - sameRank.length);

  return (
    <ProductDetailClient
      product={product}
      related={[...sameRank, ...others]}
    />
  );
}
