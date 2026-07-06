import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("promotions")
      .insert(body)
      .select("id, label, title, href, active, display_order, created_at")
      .single();

    if (error) throw error;
    revalidateTag("promotions");
    return NextResponse.json({ success: true, promotion: data });
  } catch (error: any) {
    console.error("Promotion creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create promotion" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) throw new Error("Promotion ID is required");

    const { data, error } = await supabase
      .from("promotions")
      .update(updates)
      .eq("id", id)
      .select("id, label, title, href, active, display_order, created_at")
      .single();

    if (error) throw error;
    revalidateTag("promotions");
    return NextResponse.json({ success: true, promotion: data });
  } catch (error: any) {
    console.error("Promotion update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update promotion" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Promotion ID is required");

    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) throw error;
    revalidateTag("promotions");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Promotion deletion error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete promotion" }, { status: 500 });
  }
}
