import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { createClient } from "@supabase/supabase-js";

// Post Contact Details
export async function POST(req: Request) {

 const body = await req.json();

 const { name, email, subject, message } = body;

 const { data, error } = await supabase
   .from("contacts")
   .insert([
      {
        name,
        email,
        subject,
        message
      }
   ]);

 if (error) {
   return NextResponse.json(
      { error: error.message },
      { status: 500 }
   );
 }

 return NextResponse.json({
   success: true,
   data
 });

}

// Get Contact Details
export async function GET(req: Request) {

 const accessToken =
   req.headers.get("cookie")?.match(/sb-access-token=([^;]+)/)?.[1];
const supabase = createClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
   {
     global: {
       headers: {
         Authorization: `Bearer ${accessToken}`
       }
     }
   }
 );
 if (!accessToken) {
   return NextResponse.json(
     { error: "Unauthorized" },
     { status: 401 }
   );
 }

 const { data: userData } = await supabase.auth.getUser(accessToken);

 
 if (!userData.user) {
   return NextResponse.json(
     { error: "Unauthorized" },
     { status: 401 }
   );
 }

 const { data, error } = await supabase
   .from("contacts")
   .select("*");

 if (error) {
   return NextResponse.json(
     { error: error.message },
     { status: 500 }
   );
 }

 return NextResponse.json(data);
}