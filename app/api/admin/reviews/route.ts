import { NextResponse } from "next/server";
import { requireAdmin, dbClient } from "@/utils/adminAuth";

// ── GET — admin, returns ALL reviews (active + pending) ───────────────────────

export async function GET(req: Request) {
  const { ok } = await requireAdmin(req);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await dbClient(req)
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ── POST — admin, add a review with full control (active can be true) ─────────

export async function POST(req: Request) {
  const { ok } = await requireAdmin(req);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, avatar, rating, rank, date, review, verified, active, platform } = body;

  if (!name || !review || !rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const derivedAvatar =
    avatar ||
    name.trim().split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  const { data, error } = await dbClient(req)
    .from("reviews")
    .insert([{
      name,
      avatar: derivedAvatar,
      rating: Number(rating),
      rank: rank ?? "",
      date: date ?? new Date().toISOString(),
      review,
      platform: platform ?? "Others",
      verified: verified ?? false,
      active: active ?? false,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

// ── PATCH — admin, update any field (toggle active + full edits) ──────────────

export async function PATCH(req: Request) {
  const { ok } = await requireAdmin(req);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();

  const { data, error } = await dbClient(req)
    .from("reviews")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

// ── DELETE — admin, hard delete a review ──────────────────────────────────────

export async function DELETE(req: Request) {
  const { ok } = await requireAdmin(req);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await dbClient(req).from("reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
