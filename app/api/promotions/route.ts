import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";  // Changed from createClient

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const supabase = createAdminClient();  // Using admin client
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, promotions: data });
  } catch (error) {
    console.error("Promotions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}