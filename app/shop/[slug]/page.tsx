import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/utils/supabaseServer";
import { type DbProduct, type DbProductItem } from "@/features/products/productsSlice";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

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
    .eq("slug", slug)
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

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const db = createServerClient();
  const { data } = await db
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
