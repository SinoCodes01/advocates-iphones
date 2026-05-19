import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      deliveryAddress,
      paymentMethod,
      notes,
      items,
      subtotal,
      total,
    } = body;

    // Validate required fields
    if (!customerName || !phone || !deliveryAddress || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // 1. Create the order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        phone,
        email,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        notes,
        status: "pending",
        subtotal,
        total,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      selected_variant: item.selectedVariant || item.product.storage || "",
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Decrement stock (optional: could be done via RPC or separate updates)
    for (const item of items) {
      await supabase.rpc("decrement_stock", {
        product_id: item.product.id,
        count: item.quantity,
      });
    }

    return NextResponse.json({ success: true, order: orderData }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ orders: data, success: true });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}