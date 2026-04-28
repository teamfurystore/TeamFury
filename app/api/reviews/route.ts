import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── POST — public, anyone can submit a review (lands as active=false) ─────────

export async function POST(req: Request) {
  const body = await req.json();
  const { name, rating, rank, account_bought, review, platform } = body;

  if (!name || !review || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const avatar = name
    .trim()
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const { data, error } = await anon
    .from("reviews")
    .insert([{
      name,
      avatar,
      rating: Number(rating),
      rank: rank ?? "",
      account_bought: account_bought ?? "",
      review,
      platform: platform ?? "Direct",
      verified: false,
      active: false,   // always pending until admin approves
      date: new Date(),
    }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

// ── GET — public, returns ONLY active=true reviews ────────────────────────────

export async function GET() {
  const { data, error } = await anon
    .from("reviews")
    .select("id, name, avatar, rating, rank, account_bought, date, review, verified, platform")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
