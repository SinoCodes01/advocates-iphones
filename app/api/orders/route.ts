import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
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
      deliveryFee,
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
        delivery_fee: deliveryFee,
        total,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items and reserve products
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

    // 3. Reserve products (since they are unique, quantity should be 1)
    for (const item of items) {
      const { data: reserved, error: reserveError } = await supabase.rpc("reserve_product", {
        p_id: item.product.id,
      });

      if (reserveError || !reserved) {
        // If reservation fails, we should ideally roll back or mark order as failed
        // For now, we'll throw an error which will be caught below
        throw new Error(`Product ${item.product.name} is no longer available.`);
      }
    }

    return NextResponse.json({ success: true, order: orderData }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    
    // Auth check for viewing orders
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Proactively clean up expired reservations (e.g., older than 2 hours)
    await supabase.rpc("release_expired_reservations", {
      expiration_interval: "2 hours",
    });

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

    // Normalize data to CamelCase for the frontend
    const orders = data.map((order: any) => ({
      ...order,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      deliveryAddress: order.delivery_address,
      paymentMethod: order.payment_method,
      deliveryFee: order.delivery_fee,
      createdAt: order.created_at,
      items: order.order_items.map((item: any) => ({
        ...item,
        orderId: item.order_id,
        productId: item.product_id,
        productName: item.product_name,
        unitPrice: item.unit_price,
        selectedVariant: item.selected_variant,
        createdAt: item.created_at,
      })),
    }));

    return NextResponse.json({ orders, success: true });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the current order to see items if we need to release/confirm
    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Handle inventory status based on new order status
    if (status === "confirmed" || status === "shipped" || status === "delivered") {
      for (const item of currentOrder.order_items) {
        await supabase.rpc("confirm_sale", { p_id: item.product_id });
      }
    } else if (status === "cancelled") {
      for (const item of currentOrder.order_items) {
        await supabase.rpc("release_product", { p_id: item.product_id });
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
