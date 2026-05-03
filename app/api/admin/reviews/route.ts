import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client factory ───────────────────────────────────────────────────

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Auth helper ───────────────────────────────────────────────────────────────
// Supabase stores the session cookie as sb-<project-ref>-auth-token (a JSON
// blob) OR as a plain sb-access-token JWT depending on the client version.

function extractToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  // 1. Plain JWT cookie (older pattern)
  const plain = cookieHeader.match(/sb-access-token=([^;]+)/)?.[1];
  if (plain) return plain;

  // 2. JSON blob cookie (newer @supabase/ssr pattern)
  //    Cookie name: sb-<project-ref>-auth-token=<url-encoded-JSON>
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

async function requireAdmin(req: Request): Promise<{ ok: boolean }> {
  const token = extractToken(req.headers.get("cookie"));
  if (!token) return { ok: false };

  const { data, error } = await anonClient().auth.getUser(token);
  if (error || !data.user) return { ok: false };

  return { ok: true };
}

// ── DB client — anon key is fine; RLS allows authenticated users ──────────────
// We pass the user's JWT so Supabase RLS sees an authenticated request.

function dbClient(req: Request) {
  const token = extractToken(req.headers.get("cookie"));
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : {}
  );
}

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
  const { name, avatar, rating, rank, account_bought, date, review, verified, active, platform } = body;

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
      account_bought: account_bought ?? "",
      date: date ?? new Date().toISOString(),
      review,
      platform: platform ?? "Direct",
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
