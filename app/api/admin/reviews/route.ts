import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── helpers ───────────────────────────────────────────────────────────────────

function getToken(req: Request) {
  return req.headers.get("cookie")?.match(/sb-access-token=([^;]+)/)?.[1];
}

function authed(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

async function requireAdmin(req: Request) {
  const token = getToken(req);
  if (!token) return { user: null, token: null };
  const { data } = await authed(token).auth.getUser(token);
  return { user: data.user ?? null, token };
}

// ── GET — admin, returns ALL reviews (active + pending) ───────────────────────

export async function GET(req: Request) {
  const { user, token } = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await authed(token!)
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ── PATCH — admin, update any field (used for toggle active + full edits) ─────

export async function PATCH(req: Request) {
  const { user, token } = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();

  const { data, error } = await authed(token!)
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
  const { user, token } = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await authed(token!).from("reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
