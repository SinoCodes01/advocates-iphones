import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase-admin";
import { generateOrderNumber } from "@/lib/utils";
import { orderSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const headerList = headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    
    // Limit to 3 orders per 10 minutes per IP
    if (!rateLimit(ip, 3, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many orders. Please try again later." },
        { status: 429 }
      );
    }

    const supabase = createAdminClient();
    const body = await request.json();
    
    // Validate request body using Zod
    const validation = orderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

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
    } = validation.data;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // 1. Create the order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        phone,
        email: email || null,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        notes: notes || null,
        status: "pending",
        subtotal,
        delivery_fee: deliveryFee,
        total,
      })
      .select("id, created_at, customer_name, delivery_address, delivery_fee, email, notes, order_number, payment_method, phone, status, subtotal, total")
      .single();

    if (orderError) throw orderError;

    // 2. Create order items and reserve products
    const orderItems = items.map((item) => {
      const details = [item.product.storage, item.product.color, item.product.condition].filter(Boolean).join(", ");
      return {
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: `${item.product.name}${details ? ` (${details})` : ""}`,
        quantity: item.quantity,
        unit_price: item.product.price,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Check stock and decrement quantity
    for (const item of items) {
      const { data: product, error: stockError } = await supabase
        .from("products")
        .select("stock_quantity, name")
        .eq("id", item.product.id)
        .single();

      if (stockError || !product) {
        throw new Error(`Product ${item.product.name} not found.`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new Error(`Product ${product.name} has insufficient stock.`);
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: product.stock_quantity - item.quantity })
        .eq("id", item.product.id);

      if (updateError) throw updateError;
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
    // Use admin client — this route is already protected by middleware.
    // The previous cookie-based auth check was failing because the SSR
    // session cookies were not being forwarded from the browser client.
    const supabase = createAdminClient();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("orders")
      .select("id, created_at, customer_name, delivery_address, delivery_fee, email, notes, order_number, payment_method, phone, status, subtotal, total, order_items(id, created_at, order_id, product_id, product_name, quantity, unit_price)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Normalize data to camelCase for the frontend
    const orders = data.map((order) => ({
      ...order,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      deliveryAddress: order.delivery_address,
      paymentMethod: order.payment_method,
      deliveryFee: order.delivery_fee,
      createdAt: order.created_at,
      items: order.order_items.map((item) => ({
        ...item,
        orderId: item.order_id,
        productId: item.product_id,
        productName: item.product_name,
        unitPrice: item.unit_price,
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
    // Use admin client — route is already protected by middleware.
    const supabase = createAdminClient();

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
      .select("id, created_at, customer_name, delivery_address, delivery_fee, email, notes, order_number, payment_method, phone, status, subtotal, total, order_items(id, created_at, order_id, product_id, product_name, quantity, unit_price)")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select("id, created_at, customer_name, delivery_address, delivery_fee, email, notes, order_number, payment_method, phone, status, subtotal, total")
      .single();

    if (error) throw error;

    // Handle inventory status based on new order status
    if (status === "cancelled" && currentOrder.status !== "cancelled") {
      // Restore stock if the order was not already cancelled
      for (const item of currentOrder.order_items) {
        if (item.product_id) {
          const { data: product } = await supabase
            .from("products")
            .select("stock_quantity")
            .eq("id", item.product_id)
            .single();
            
          if (product) {
            await supabase
              .from("products")
              .update({ stock_quantity: product.stock_quantity + item.quantity })
              .eq("id", item.product_id);
          }
        }
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
