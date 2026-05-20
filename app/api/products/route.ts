import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // Can be comma-separated
    const condition = searchParams.get("condition"); // Can be comma-separated
    const storage = searchParams.get("storage"); // Can be comma-separated
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    // Verify session for active filter
    const { data: { user } } = await supabase.auth.getUser();
    
    // Only filter by active for non-authenticated users (storefront)
    if (!user) {
      query = query.eq("active", true);
    }

    if (slug) {
      query = query.eq("slug", slug);
    }

    // Handle multi-select for category
    if (category && category !== "All") {
      const categories = category.split(",");
      query = query.in("category", categories);
    }

    // Handle multi-select for condition
    if (condition && condition !== "All") {
      const conditions = condition.split(",");
      query = query.in("condition", conditions);
    }

    // Handle multi-select for storage
    if (storage) {
      const storageSizes = storage.split(",");
      query = query.in("storage", storageSizes);
    }

    // Handle price range
    if (minPrice) {
      query = query.gte("price", parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price", parseFloat(maxPrice));
    }

    if (featured === "true") {
      query = query.eq("featured", true);
    }

    if (search) {
      // Search in name, description, storage, and color
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,storage.ilike.%${search}%,color.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Normalize data to CamelCase for the frontend
    const products = data.map((product: any) => ({
      ...product,
      compareAtPrice: product.compare_at_price,
      colorHex: product.color_hex,
      warrantyMonths: product.warranty_months,
      batteryHealth: product.battery_health,
      createdAt: product.created_at,
    }));

    return NextResponse.json({ products, success: true });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await supabase
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) throw new Error("Product ID is required");

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Product ID is required");

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
