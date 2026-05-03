import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

interface ProductItemInput {
  skin_id: string;
  display_name: string;
  display_icon?: string | null;
}

// ── GET /api/products/skins?parent_product_id=uuid ────────────────────────────

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentProductId = searchParams.get("parent_product_id");

    if (!parentProductId)
      return NextResponse.json(
        { success: false, error: "Missing parent_product_id" },
        { status: 400 }
      );

    const { data, error } = await supabase
      .from("product_items")
      .select("*")
      .eq("parent_product_id", parentProductId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, count: data?.length ?? 0, data });
  } catch (err) {
    console.error("GET /api/products/skins error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch skins" },
      { status: 500 }
    );
  }
}

// ── POST /api/products/skins ──────────────────────────────────────────────────
// Appends skins to a product (no delete).

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parent_product_id, items } = body as {
      parent_product_id: string;
      items: ProductItemInput[];
    };

    if (!parent_product_id)
      return NextResponse.json(
        { success: false, error: "Missing parent_product_id" },
        { status: 400 }
      );
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json(
        { success: false, error: "items must be a non-empty array" },
        { status: 400 }
      );

    const insertData = items.map((item) => ({
      parent_product_id,
      skin_id: item.skin_id,
      display_name: item.display_name,
      display_icon: item.display_icon ?? null,
    }));

    const { data, error } = await supabase
      .from("product_items")
      .insert(insertData)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("POST /api/products/skins error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to insert skins" },
      { status: 500 }
    );
  }
}

// ── PUT /api/products/skins ───────────────────────────────────────────────────
// REPLACE — atomically deletes all existing skins for a product then inserts
// the new set. Used by the admin SkinPickerPopup "Save" action.
//
// Body: { parent_product_id: string, items: ProductItemInput[] }
// items can be [] to clear all skins.

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { parent_product_id, items } = body as {
      parent_product_id: string;
      items: ProductItemInput[];
    };

    if (!parent_product_id)
      return NextResponse.json(
        { success: false, error: "Missing parent_product_id" },
        { status: 400 }
      );
    if (!Array.isArray(items))
      return NextResponse.json(
        { success: false, error: "items must be an array" },
        { status: 400 }
      );

    // Step 1 — wipe existing skins for this product
    const { error: deleteError } = await supabase
      .from("product_items")
      .delete()
      .eq("parent_product_id", parent_product_id);

    if (deleteError) throw deleteError;

    // Step 2 — insert the new selection (skip if empty — just clearing)
    let inserted: unknown[] = [];
    if (items.length > 0) {
      const insertData = items.map((item) => ({
        parent_product_id,
        skin_id: item.skin_id,
        display_name: item.display_name,
        display_icon: item.display_icon ?? null,
      }));

      const { data, error: insertError } = await supabase
        .from("product_items")
        .insert(insertData)
        .select();

      if (insertError) throw insertError;
      inserted = data ?? [];
    }

    return NextResponse.json({ success: true, count: inserted.length, data: inserted });
  } catch (err) {
    console.error("PUT /api/products/skins error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to replace skins" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/products/skins ────────────────────────────────────────────────
// Body options:
//   { id }                                    — delete single row by PK
//   { parent_product_id, skin_ids: string[] } — delete specific skins by skin_id
//   { parent_product_id }                     — delete ALL skins for a product

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, parent_product_id, skin_ids } = body;

    if (!id && !parent_product_id)
      return NextResponse.json(
        { success: false, error: "Missing id or parent_product_id" },
        { status: 400 }
      );

    if (id) {
      const { error } = await supabase.from("product_items").delete().eq("id", id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (Array.isArray(skin_ids) && skin_ids.length > 0) {
      const { error } = await supabase
        .from("product_items")
        .delete()
        .eq("parent_product_id", parent_product_id)
        .in("skin_id", skin_ids);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from("product_items")
      .delete()
      .eq("parent_product_id", parent_product_id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/products/skins error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete skins" },
      { status: 500 }
    );
  }
}
