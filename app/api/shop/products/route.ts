import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

/**
 * GET /api/shop/products
 * Public — returns only active products with their skins (product_items) embedded.
 *
 * Response: { success: true, data: DbProduct[] }
 * Each product includes:
 *   product_items: [{ id, skin_id, display_name, display_icon }]
 */
export async function GET() {
  // Fetch products and all their skins in parallel
  const [productsRes, skinsRes] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, slug, title, image, profile_url, price, discounted_price, badge, " +
        "current_rank, peak_rank, skins, knives, battle_passes, region, level, " +
        "verified, instant_delivery, description, created_at"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("product_items")
      .select("id, parent_product_id, skin_id, display_name, display_icon"),
  ]);

  if (productsRes.error) {
    console.error("GET /api/shop/products error:", productsRes.error);
    return NextResponse.json({ success: false, error: productsRes.error.message }, { status: 500 });
  }

  // Group skins by parent_product_id
  const skinsByProduct: Record<string, Array<{ id: string; parent_product_id: string; skin_id: string; display_name: string; display_icon: string | null }>> = {};
  for (const skin of (skinsRes.data ?? [])) {
    const pid = skin.parent_product_id;
    if (!skinsByProduct[pid]) skinsByProduct[pid] = [];
    skinsByProduct[pid].push(skin);
  }

  const data = (productsRes.data ?? []).map((p) => {
    const product = p as unknown as Record<string, unknown> & { id: string };
    return {
      ...product,
      product_items: skinsByProduct[product.id] ?? [],
    };
  });

  return NextResponse.json({ success: true, data });
}
