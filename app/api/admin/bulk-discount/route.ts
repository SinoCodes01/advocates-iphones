import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const { discountPercentage } = await request.json();

    if (!discountPercentage || typeof discountPercentage !== "number") {
      return NextResponse.json({ error: "Invalid discount percentage" }, { status: 400 });
    }

    const { error } = await supabase.rpc('apply_bulk_discount', {
      discount_percentage: discountPercentage
    });

    if (error) throw error;
    
    // Invalidate the products cache so the storefront instantly reflects the new prices
    revalidateTag("products");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Bulk discount error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to apply bulk discount" },
      { status: 500 }
    );
  }
}
