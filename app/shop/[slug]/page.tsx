import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { type DbProduct, type DbProductItem } from "@/features/products/productsSlice";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

// Allow slugs not in generateStaticParams to be rendered on-demand (ISR).
// This means new products added after a deploy work immediately without
// needing a full rebuild.
export const dynamicParams = true;

// ── Data fetching — direct Supabase query, no HTTP round-trip ─────────────────

async function getProduct(slug: string): Promise<DbProduct | null> {
  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, slug, title, image, profile_url, price, discounted_price, badge, " +
      "current_rank, peak_rank, skins, knives, battle_passes, region, level, " +
      "verified, instant_delivery, description, created_at"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) return null;

  // Fetch skins for this product
  const { data: items } = await supabase
    .from("product_items")
    .select("id, skin_id, display_name, display_icon")
    .eq("parent_product_id", (product as unknown as { id: string }).id);

  return {
    ...(product as unknown as DbProduct),
    product_items: (items ?? []) as DbProductItem[],
  };
}

async function getRelated(product: DbProduct): Promise<DbProduct[]> {
  const { data } = await supabase
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

  // If fewer than 4 same-rank, fill with other products
  if (related.length < 4) {
    const { data: others } = await supabase
      .from("products")
      .select(
        "id, slug, title, image, profile_url, price, discounted_price, badge, " +
        "current_rank, peak_rank, skins, knives, battle_passes, region, level, " +
        "verified, instant_delivery, description, created_at"
      )
      .eq("is_active", true)
      .neq("id", product.id)
      .not("id", "in", `(${related.map((p) => p.id).join(",")})`)
      .limit(4 - related.length);

    return [
      ...related,
      ...((others ?? []) as unknown as DbProduct[]).map((p) => ({
        ...p,
        product_items: [],
      })),
    ];
  }

  return related.map((p) => ({ ...p, product_items: [] }));
}

// ── Static params — pre-render known slugs at build time ──────────────────────

export async function generateStaticParams() {
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  return (data ?? []).map((p) => ({ slug: p.slug as string }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  props: PageProps<"/shop/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not Found | TEAM FURY" };
  return {
    title: `${product.title} | TEAM FURY`,
    description: product.description,
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

  return <ProductDetailClient product={product} related={related} />;
}
