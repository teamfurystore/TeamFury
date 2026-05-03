import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

/**
 * GET /api/shop/products
 * Public endpoint — returns only active, non-deleted products.
 * No auth required.
 *
 * Response: { success: true, data: DbProduct[] }
 */
export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, title, image, profile_url, price, discounted_price, badge, " +
      "current_rank, peak_rank, skins, knives, battle_passes, region, level, " +
      "verified, instant_delivery, description, created_at"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/shop/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
