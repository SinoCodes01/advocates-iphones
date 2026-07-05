import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("store_settings")
      .select("free_delivery_threshold")
      .eq("id", "default")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, settings: data });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
