import { NextResponse } from "next/server";

// This endpoint is intentionally disabled — admin accounts are created
// directly in Supabase and must have role = "admin" in the profiles table.
export async function POST() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}