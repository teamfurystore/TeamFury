import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";
import sharp from "sharp";

// Give sharp enough time to process large images
export const maxDuration = 30;

// ── Image processing ──────────────────────────────────────────────────────────
// Converts any uploaded image to WebP, resizes to max 1080px wide while
// preserving aspect ratio (never upscales), quality 82.

async function processImage(file: File): Promise<{ buffer: Buffer; fileName: string }> {
  const raw = Buffer.from(await file.arrayBuffer());
  const buffer = await sharp(raw)
    .resize({ width: 1080, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  return { buffer, fileName: `products/${Date.now()}.webp` };
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err)
    return String((err as { message: unknown }).message);
  return String(err);
}

// ── PATCH /api/products — toggle is_active ────────────────────────────────────

export async function PATCH(req: Request) {
  try {
    const { id, is_active } = await req.json();
    const { data, error } = await supabase
      .from("products")
      .update({ is_active: !is_active })
      .eq("id", id)
      .select();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("PATCH /api/products error:", err);
    return NextResponse.json({ error: "Toggle failed" }, { status: 500 });
  }
}

// ── POST /api/products — create product with image upload ─────────────────────

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file =
      (formData.get("file") as File | null) ??
      (formData.get("image") as File | null);
    const data = JSON.parse(formData.get("data") as string);
    const existingImageUrl: string | null = data?.image ?? null;

    if (!file && !existingImageUrl) {
      return NextResponse.json(
        { success: false, message: "No file uploaded and no existing image URL provided" },
        { status: 400 }
      );
    }

    let imageUrl = existingImageUrl;

    if (file) {
      const { buffer, fileName } = await processImage(file);

      const { error: uploadError } = await supabase.storage
        .from("Thumbnails")
        .upload(fileName, buffer, { contentType: "image/webp", upsert: false });

      if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from("Thumbnails")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { data: insertedData, error } = await supabase
      .from("products")
      .insert([{
        title: data.title,
        slug: data.slug,
        price: data.price ?? 0,
        discounted_price: data.discounted_price ?? 0,
        current_rank: data.current_rank ?? null,
        peak_rank: data.peak_rank ?? null,
        skins: data.skins ?? 0,
        knives: data.knives ?? 0,
        battle_passes: data.battle_passes ?? 0,
        region: data.region ?? null,
        level: data.level ?? 0,
        badge: data.badge ?? null,
        image: imageUrl,
        description: data.description ?? null,
        verified: data.verified ?? false,
        instant_delivery: data.instant_delivery ?? false,
        profile_url: data.profile_url ?? null,
      }])
      .select();

    if (error) throw new Error(`DB insert failed: ${error.message}`);

    return NextResponse.json(
      { success: true, message: "Image uploaded & product saved", imageUrl, data: insertedData },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: errorMessage(err) },
      { status: 500 }
    );
  }
}
