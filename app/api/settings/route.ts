import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { unstable_cache } from "next/cache";

export async function GET() {
  try {
    const getSettings = unstable_cache(
      async () => {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("store_settings")
          .select("free_delivery_threshold")
          .eq("id", "default")
          .maybeSingle();

        if (error) throw error;
        return data;
      },
      ["store-settings"],
      { tags: ["settings"], revalidate: 3600 }
    );

    const data = await getSettings();

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