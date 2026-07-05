import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const { error } = await supabase
      .from("store_settings")
      .upsert({ id: 'default', ...body });

    if (error) throw error;

    // Return the complete saved settings object
    return NextResponse.json({ success: true, settings: { ...body } });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}