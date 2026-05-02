import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file =
      (formData.get("file") as File | null) ??
      (formData.get("image") as File | null);
    const payload = formData.get("data")?.toString();
    const parsedPayload = payload ? JSON.parse(payload) : null;
    const existingImageUrl = parsedPayload?.image ?? null;

    const data = JSON.parse(formData.get("data") as string);

    if (!file && !existingImageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded and no existing image URL provided",
        },
        { status: 400 },
      );
    }

    let imageUrl = existingImageUrl;

    if (file) {
      const ext = file.name.split(".").pop();
      const fileName = `products/test-${Date.now()}.${ext}`;

      console.log("📤 Uploading image:", fileName);

      // ✅ Upload
      const { error: uploadError } = await supabase.storage
        .from("Thumbnails")
        .upload(fileName, file, {
          contentType: file.type,
        });

      if (uploadError) {
        console.error("❌ Upload failed:", uploadError);
        throw uploadError;
      }

      console.log("✅ Image uploaded successfully");

      // ✅ Get public URL
      const { data } = supabase.storage
        .from("Thumbnails")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;

      console.log("🔗 Image URL:", imageUrl);
    }

    // ✅ Payload
    const Finalpayload = {
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
    };

    console.log("📦 Inserting payload:", Finalpayload);

    const { data: insertedData, error } = await supabase
      .from("products")
      .insert([Finalpayload])
      .select();

    if (error) {
      console.error("❌ DB insert failed:", error);
      throw error;
    }

    console.log("✅ Product inserted successfully");

    // ✅ FINAL RESPONSE (ACK)
    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded & product saved",
        imageUrl,
        data: insertedData,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("🔥 ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
        error: err,
      },
      { status: 500 },
    );
  }
}
