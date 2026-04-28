import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { createClient } from "@supabase/supabase-js";

// ── helpers ──────────────────────────────────────────────────────────────────

function getToken(req: Request) {
  return req.headers.get("cookie")?.match(/sb-access-token=([^;]+)/)?.[1];
}

async function getAuthedClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

async function verifyAdmin(req: Request) {
  const token = getToken(req);
  if (!token) return null;
  const client = await getAuthedClient(token);
  const { data } = await client.auth.getUser(token);
  return data.user ?? null;
}

// ── POST — public, saves contact submission ───────────────────────────────────

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, subject, message, phone } = body;

  const { data, error } = await supabase
    .from("contacts")
    .insert([{ name, email, subject, message, phone }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data,message:"Submitted Successfully" });
}

// ── GET — admin only, returns all contacts ────────────────────────────────────

export async function GET(req: Request) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await getAuthedClient(token);
  const { data: userData } = await client.auth.getUser(token);
  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await client
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// ── DELETE — admin only, deletes a single contact by ?id= ────────────────────

export async function DELETE(req: Request) {
  const user = await verifyAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const token = getToken(req)!;
  const client = await getAuthedClient(token);

  const { error } = await client.from("contacts").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true ,message:"Deleted Successfully"});
}