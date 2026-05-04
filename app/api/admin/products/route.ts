import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Auth (same pattern as admin/reviews) ─────────────────────────────────────

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function extractToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const plain = cookieHeader.match(/sb-access-token=([^;]+)/)?.[1];
  if (plain) return plain;
  const jsonRaw = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/)?.[1];
  if (jsonRaw) {
    try {
      const decoded = decodeURIComponent(jsonRaw);
      const parsed = JSON.parse(decoded);
      const session = Array.isArray(parsed) ? parsed[0] : parsed;
      return session?.access_token ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

function dbClient(req: Request) {
  const token = extractToken(req.headers.get("cookie"));
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {},
  );
}

// async function requireAdmin(req: Request): Promise<{ ok: boolean }> {
//   const token = extractToken(req.headers.get("cookie"));
//   if (!token) return { ok: false };

//   const { data, error } = await anonClient().auth.getUser(token);
//   if (error || !data.user) return { ok: false };
//   return { ok: true };
// }

async function requireAdmin(req: Request): Promise<{ ok: boolean }> {
  const token = extractToken(req.headers.get("cookie"));
  if (!token) return { ok: false };

  // create client with user token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    },
  );

  // 🔹 1. Get authenticated user
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) return { ok: false };

  // 🔹 2. Fetch role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile) return { ok: false };

  // 🔹 3. Check role
  return { ok: profile.role === "admin" };
}

export async function GET(req: Request) {
  const { ok } = await requireAdmin(req);
  if (!ok) {
    console.log("token issue or role issue");

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = dbClient(req);

  // Fetch products and their skins in parallel (no FK constraint = no join)
  const [productsRes, skinsRes] = await Promise.all([
    db
      .from("products")
      .select("*, active:is_active")
      .order("created_at", { ascending: false }),
    db
      .from("product_items")
      .select(
        "id, parent_product_id, skin_id, display_name, display_icon, created_at",
      ),
  ]);

  if (productsRes.error)
    return NextResponse.json(
      { error: productsRes.error.message },
      { status: 500 },
    );
  if (skinsRes.error)
    return NextResponse.json(
      { error: skinsRes.error.message },
      { status: 500 },
    );

  // Group skins by parent_product_id
  const skinsByProduct: Record<string, typeof skinsRes.data> = {};
  for (const skin of skinsRes.data ?? []) {
    const pid = skin.parent_product_id;
    if (!skinsByProduct[pid]) skinsByProduct[pid] = [];
    skinsByProduct[pid].push(skin);
  }

  // Embed product_items into each product
  const data = (productsRes.data ?? []).map((p) => ({
    ...p,
    product_items: skinsByProduct[p.id] ?? [],
  }));

  return NextResponse.json({ success: true, data });
}

// ── PUT /api/admin/products ───────────────────────────────────────────────────
// Full update of a product (edit form). Accepts multipart/form-data with
// optional file upload. Image is converted to WebP 1080px max, quality 82.

export async function PUT(req: Request) {
  const { ok } = await requireAdmin(req);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const raw = formData.get("data")?.toString();
    if (!raw)
      return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const payload = JSON.parse(raw);
    const { id, ...fields } = payload;
    if (!id)
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 },
      );

    let imageUrl: string | undefined = fields.image;

    if (file) {
      // Convert to WebP, resize to max 1080px wide, quality 82
      const rawBuf = Buffer.from(await file.arrayBuffer());
      const buffer = await (await import("sharp"))
        .default(rawBuf)
        .resize({ width: 1080, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      const fileName = `products/${fields.slug || id}-${Date.now()}.webp`;

      const { supabase: storageClient } =
        await import("@/utils/supabaseClient");
      const { error: uploadError } = await storageClient.storage
        .from("Thumbnails")
        .upload(fileName, buffer, { contentType: "image/webp" });
      if (uploadError) throw uploadError;

      const { data: urlData } = storageClient.storage
        .from("Thumbnails")
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const updatePayload = {
      title: fields.title,
      slug: fields.slug,
      price: fields.price ?? 0,
      discounted_price: fields.discounted_price ?? 0,
      current_rank: fields.current_rank ?? null,
      peak_rank: fields.peak_rank ?? null,
      skins: fields.skins ?? 0,
      knives: fields.knives ?? 0,
      battle_passes: fields.battle_passes ?? 0,
      region: fields.region ?? null,
      level: fields.level ?? 0,
      badge: fields.badge || null,
      image: imageUrl,
      description: fields.description ?? null,
      verified: fields.verified ?? false,
      instant_delivery: fields.instant_delivery ?? false,
      profile_url: fields.profile_url ?? null,
    };

    const { data, error } = await dbClient(req)
      .from("products")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("PUT /api/admin/products error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// ── DELETE /api/admin/products?id= ───────────────────────────────────────────
// Cascade delete:
//   1. Fetch the product to get its image URL
//   2. Delete the image from Supabase Storage (Thumbnails bucket)
//   3. Soft delete the product row

const getFilePathFromUrl = (url: string): string | null => {
  try {
    const match =
      url.match(/\/storage\/v1\/object\/public\/Thumbnails\/(.+)$/) ??
      url.match(/\/object\/public\/Thumbnails\/(.+)$/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};

export async function DELETE(req: Request) {
  try {
    const { ok } = await requireAdmin(req);
    if (!ok)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = dbClient(req);

    // ✅ get id from URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id in query" },
        { status: 400 },
      );
    }

    // 🔹 1. Fetch product image
    const { data: product, error: fetchError } = await db
      .from("products")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const imageUrl = product?.image;

    // 🔹 2. Delete image from storage
    if (imageUrl) {
      const filePath = getFilePathFromUrl(imageUrl);
      if (filePath) {
        console.log("🗑 Deleting image:", filePath);

        const { supabase: storageClient } =
          await import("@/utils/supabaseClient");
        const { data, error } = await storageClient.storage
          .from("Thumbnails")
          .remove([filePath]);

        console.log("📦 Supabase delete response:", data);

        if (error) {
          console.error("❌ Storage delete failed:", error);
        } else {
          console.log("✅ Image delete request sent");
        }
      } else {
        console.warn(
          "⚠️ Unable to extract storage path from image URL:",
          imageUrl,
        );
      }
    }

    // 🔹 3. HARD DELETE PRODUCT (CASCADE handles items)
    const { error } = await db.from("products").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Product permanently deleted",
    });
  } catch (err) {
    console.error("❌ DELETE error:", err);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 },
    );
  }
}
