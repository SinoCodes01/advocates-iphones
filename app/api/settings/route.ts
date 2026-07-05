import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";  // Changed from createClient


export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const supabase = createAdminClient();  // Using admin client
    const { data, error } = await supabase
      .from("store_settings")
      .select("free_delivery_threshold")
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;

    // Provide fallback if settings row doesn't exist
    const settings = data || { free_delivery_threshold: 0 };

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}