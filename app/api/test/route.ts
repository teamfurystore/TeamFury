import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

// GET API (fetch data only)
export async function GET() {
  try {
    const { data, error } = await supabase.from("Test").select("*");

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
