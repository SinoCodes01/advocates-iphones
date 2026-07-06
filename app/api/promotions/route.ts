import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { unstable_cache } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const getPromotions = unstable_cache(
      async () => {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("promotions")
          .select("id, label, title, href, active, display_order, created_at")
          .eq("active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        return data;
      },
      ["promotions-list"],
      { tags: ["promotions"], revalidate: 3600 } // Cache for 1 hour, or until revalidated
    );

    const promotions = await getPromotions();

    return NextResponse.json({ success: true, promotions });
  } catch (error) {
    console.error("Promotions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}