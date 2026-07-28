import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/utils/supabaseServer";
import { type DbProduct, type DbProductItem } from "@/features/products/productsSlice";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getProduct(slug: string): Promise<DbProduct | null> {
  const db = createServerClient();

  const { data: product, error } = await db
    .from("products")
    .select(
      "id, slug, title, image, profile_url, price, discounted_price, badge, " +
      "current_rank, peak_rank, skins, knives, battle_passes, region, level, " +
      "verified, instant_delivery, description, created_at"
    )
    .eq("slug", slug.trim())
    .eq("is_active", true)
    .single();

  if (error || !product) return null;

  const pid = (product as unknown as { id: string }).id;

  const { data: items } = await db
    .from("product_items")
    .select("id, skin_id, display_name, display_icon")
    .eq("parent_product_id", pid);

  return {
    ...(product as unknown as DbProduct),
    product_items: (items ?? []) as DbProductItem[],
  };
}

async function getRelated(product: DbProduct): Promise<DbProduct[]> {
  const db = createServerClient();

  const { data } = await db
    .from("products")
    .select(
      "id, slug, title, image, profile_url, price, discounted_price, badge, " +
      "current_rank, peak_rank, skins, knives, battle_passes, region, level, " +
      "verified, instant_delivery, description, created_at"
    )
    .eq("is_active", true)
    .neq("id", product.id)
    .eq("current_rank", product.current_rank)
    .limit(4);

  const related = (data ?? []) as unknown as DbProduct[];

  if (related.length < 4) {
    const excludeIds = [product.id, ...related.map((p) => p.id)];
    const { data: others } = await db
      .from("products")
      .select(
        "id, slug, title, image, profile_url, price, discounted_price, badge, " +
        "current_rank, peak_rank, skins, knives, battle_passes, region, level, " +
        "verified, instant_delivery, description, created_at"
      )
      .eq("is_active", true)
      .not("id", "in", `(${excludeIds.join(",")})`)
      .limit(4 - related.length);

    return [
      ...related.map((p) => ({ ...p, product_items: [] })),
      ...((others ?? []) as unknown as DbProduct[]).map((p) => ({ ...p, product_items: [] })),
    ];
  }

  return related.map((p) => ({ ...p, product_items: [] }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  props: PageProps<"/shop/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not Found" };

  const title = `${product.title} | TEAM FURY`;
  const description =
    product.description ||
    `Buy ${product.title} — ${product.skins ?? 0} skins, ${product.knives ?? 0} knives. Verified Valorant account with instant delivery.`;
  const image = product.image ?? "/tf_logo_hd.jpg";
  const url = `https://www.teamfury.store/shop/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: product.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage(
  props: PageProps<"/shop/[slug]">
) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.description ||
      `Premium Valorant account — ${product.skins ?? 0} skins, ${product.knives ?? 0} knives.`,
    image: product.image ?? "https://www.teamfury.store/tf_logo_hd.jpg",
    url: `https://www.teamfury.store/shop/${slug}`,
    brand: { "@type": "Brand", name: "TEAM FURY" },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.discounted_price ?? product.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "TEAM FURY" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
